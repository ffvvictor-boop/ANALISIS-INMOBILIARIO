import React, { useRef } from 'react';
import ReactDOMClient from 'react-dom/client';
import { CalculationResult, RealEstateDealInput } from '../types';
import SummaryCard from './SummaryCard';
import DetailedReport from './DetailedReport';


// @ts-ignore
const { jsPDF } = window.jspdf;
// @ts-ignore
const { html2canvas } = window;


interface ReportDisplayProps {
    result: CalculationResult;
    inputs: RealEstateDealInput;
}

const formatCurrency = (value: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
const formatPercent = (value: number) => `${value.toFixed(2)}%`;

const DetailRow: React.FC<{ label: string; value: string; isTotal?: boolean, subtitle?: string }> = ({ label, value, isTotal = false, subtitle }) => (
    <div className={`flex justify-between items-center py-2.5 px-2 sm:px-3 rounded-md ${isTotal ? 'font-bold text-white bg-black/20 mt-2' : 'border-b border-white/10'}`}>
        <div>
            <span className="text-gray-300">{label}</span>
            {subtitle && <span className="block text-xs text-gray-400">{subtitle}</span>}
        </div>
        <span className="font-medium text-white text-right">{value}</span>
    </div>
);

const ReportDisplay: React.FC<ReportDisplayProps> = ({ result, inputs }) => {
    const reportRef = useRef<HTMLDivElement>(null);

    const handleDownloadPdf = async () => {
        // Create a temporary container for rendering the PDF content with a white background
        const pdfRenderContainer = document.createElement('div');
        pdfRenderContainer.style.position = 'absolute';
        pdfRenderContainer.style.left = '-9999px';
        pdfRenderContainer.style.width = '1200px'; // Consistent width for rendering
        pdfRenderContainer.style.background = 'white'; // Force white background for PDF
        document.body.appendChild(pdfRenderContainer);

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
    
        const addImageToPdf = (canvas: HTMLCanvasElement, isFirstPage: boolean) => {
            if (!isFirstPage) pdf.addPage();
            const imgData = canvas.toDataURL('image/png', 0.95);
            const canvasHeight = canvas.height;
            const pdfImageHeight = (canvasHeight * pdfWidth) / canvas.width;
            let position = 0;
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfImageHeight);
            let heightLeft = pdfImageHeight - pageHeight;
            while (heightLeft > 0) {
                position -= pageHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfImageHeight);
                heightLeft -= pageHeight;
            }
        };
    
        // --- 1. Render and capture Summary ---
        const summaryClone = reportRef.current!.cloneNode(true) as HTMLElement;
        pdfRenderContainer.appendChild(summaryClone);
        const summaryCanvas = await html2canvas(pdfRenderContainer, { scale: 2, useCORS: true, allowTaint: true });
        pdfRenderContainer.innerHTML = ''; // Clear for next content
    
        // --- 2. Render and capture Detailed Report ---
        const detailRoot = ReactDOMClient.createRoot(pdfRenderContainer);
        await new Promise<void>(resolve => {
            detailRoot.render(<DetailedReport result={result} inputs={inputs} isPdf={true} />);
            setTimeout(resolve, 500);
        });
        const detailCanvas = await html2canvas(pdfRenderContainer, { scale: 2, useCORS: true, allowTaint: true });
        detailRoot.unmount();
    
        // --- Cleanup and Save ---
        document.body.removeChild(pdfRenderContainer);
        addImageToPdf(summaryCanvas, true);
        addImageToPdf(detailCanvas, false);
        pdf.save('informe_ao_home.pdf');
    };
    
    const getHighlight = (value: number): 'green' | 'red' | undefined => {
        if (value > 15) return 'green';
        if (value < 6) return 'red';
        return undefined;
    };

    return (
        <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                 <h2 className="text-2xl sm:text-3xl font-bold text-white">Resumen de la Operación</h2>
                 <button onClick={handleDownloadPdf} className="w-full sm:w-auto bg-green-600/90 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-all transform hover:scale-105 duration-300 text-sm sm:text-base">
                    <i className="fas fa-file-pdf mr-2"></i> Descargar Informe
                </button>
            </div>
            
            <div ref={reportRef} className="bg-black/20 backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg border border-white/20 text-white">
                <div id="report-content" className="flex flex-col justify-between min-h-[75vh]">
                    
                    <div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
                            <SummaryCard title="Coste Total Operación" value={result.totalProjectCost} icon="fa-solid fa-building-shield" color="text-red-400" isCurrency />
                            <SummaryCard title="Beneficio Venta (antes imp.)" value={result.saleProfitBeforeTax} icon="fa-solid fa-sack-dollar" color="text-green-400" isCurrency />
                            <SummaryCard
                                title="Rentabilidad en Venta (s/Coste)"
                                value={result.saleProfitability}
                                icon="fa-solid fa-arrow-trend-up"
                                color="text-green-400"
                                highlight={getHighlight(result.saleProfitability)}
                            />
                             <SummaryCard
                                title="Rentabilidad Neta Alquiler"
                                value={result.netRentalYield}
                                icon="fa-solid fa-house-user"
                                color="text-teal-400"
                                highlight={getHighlight(result.netRentalYield)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            <div className="bg-white/5 p-3 sm:p-4 rounded-lg border border-white/10">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-200 mb-3"><i className="fa-solid fa-calculator mr-2 text-amber-400"></i>Desglose de Costes</h3>
                                <DetailRow label="Coste Compra" subtitle="(Neto + Imp.)" value={formatCurrency(result.totalPurchaseCost)} />
                                <DetailRow label="Coste Reforma y otros" subtitle="(Neto + Imp.)" value={formatCurrency(result.totalRenovationCost)} />
                                <DetailRow label="COSTE TOTAL" value={formatCurrency(result.totalProjectCost)} isTotal />
                            </div>
                            <div className="bg-white/5 p-3 sm:p-4 rounded-lg border border-white/10">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-200 mb-3"><i className="fa-solid fa-landmark mr-2 text-amber-400"></i>Financiación y Capital</h3>
                                <DetailRow label="Importe Financiado" subtitle="(Total)" value={formatCurrency(result.loanAmount)} />
                                <DetailRow label="Costes Asociados Préstamo" subtitle="(Total)" value={formatCurrency(result.loanAssociatedCosts)} />
                                <DetailRow label="CAPITAL APORTADO TOTAL" value={formatCurrency(result.totalCapitalProvided)} isTotal />
                            </div>
                        </div>

                        <div className="mt-6 sm:mt-8">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-200 mb-3"><i className="fa-solid fa-users-viewfinder mr-2 text-amber-400"></i>Desglose por Inversor</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-white/10 text-gray-300 uppercase text-xs sm:text-sm">
                                        <tr>
                                            <th className="p-2 sm:p-3">Inversor</th>
                                            <th className="p-2 sm:p-3">Capital Aportado</th>
                                            <th className="p-2 sm:p-3">Beneficio Bruto</th>
                                            <th className="p-2 sm:p-3">Impuestos (Estim.)</th>
                                            <th className="p-2 sm:p-3">Beneficio Neto</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {result.investorBreakdown.map((inv, index) => (
                                            <tr key={inv.id} className="border-b border-white/10 hover:bg-white/5">
                                                <td className="p-2 sm:p-3 font-medium text-white">#{index + 1} ({inv.type === 'individual' ? 'Persona' : 'Sociedad'})</td>
                                                <td className="p-2 sm:p-3 text-white">{formatCurrency(inv.capitalProvided)}</td>
                                                <td className="p-2 sm:p-3 text-white">{formatCurrency(inv.grossProfit)}</td>
                                                <td className="p-2 sm:p-3 text-red-400">({formatCurrency(inv.taxAmount)})</td>
                                                <td className="p-2 sm:p-3 font-bold text-green-400">{formatCurrency(inv.netProfit)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="font-bold bg-white/10 text-white text-sm">
                                        <tr>
                                            <td className="p-2 sm:p-3">TOTAL</td>
                                            <td className="p-2 sm:p-3">{formatCurrency(result.totalCapitalProvided)}</td>
                                            <td className="p-2 sm:p-3">{formatCurrency(result.saleProfitBeforeTax)}</td>
                                            <td className="p-2 sm:p-3 text-red-400">({formatCurrency(result.investorBreakdown.reduce((s, i) => s + i.taxAmount, 0))})</td>
                                            <td className="p-2 sm:p-3">{formatCurrency(result.netProfitAfterTax)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>

                    <footer className="text-center mt-12 text-gray-400 text-xs">
                         <p>Este es un informe de estimación y no constituye asesoramiento financiero o fiscal. Los cálculos de impuestos son simplificados.</p>
                         <p>&copy; {new Date().getFullYear()} AO HOME. Todos los derechos reservados.</p>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default ReportDisplay;