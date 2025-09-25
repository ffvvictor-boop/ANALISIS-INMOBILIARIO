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
    <div className={`flex justify-between items-center py-2.5 px-2 sm:px-3 rounded-md ${isTotal ? 'font-bold text-gray-800 bg-black/10 mt-2' : 'border-b border-black/10'}`}>
        <div>
            <span className="text-gray-600">{label}</span>
            {subtitle && <span className="block text-xs text-gray-500">{subtitle}</span>}
        </div>
        <span className="font-medium text-gray-800 text-right">{value}</span>
    </div>
);

const ReportDisplay: React.FC<ReportDisplayProps> = ({ result, inputs }) => {
    const reportRef = useRef<HTMLDivElement>(null);

    const handleDownloadPdf = async () => {
        if (!reportRef.current) return;
    
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const reportWidth = 1200; // Ancho consistente para renderizar el PDF
    
        const addImageToPdf = (canvas: HTMLCanvasElement, isFirstPage: boolean) => {
            if (!isFirstPage) {
                pdf.addPage();
            }
            const imgData = canvas.toDataURL('image/png');
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            let position = 0;
            let heightLeft = pdfHeight;
    
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
            heightLeft -= pageHeight;
    
            while (heightLeft > 0) {
                position -= pageHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
                heightLeft -= pageHeight;
            }
        };
    
        // --- 1. Renderizar y capturar el Resumen ---
        const summaryContainer = document.createElement('div');
        summaryContainer.style.position = 'absolute';
        summaryContainer.style.left = '-9999px';
        summaryContainer.style.width = `${reportWidth}px`;
        const summaryClone = reportRef.current.cloneNode(true) as HTMLElement;
        summaryContainer.appendChild(summaryClone);
        document.body.appendChild(summaryContainer);
    
        const summaryCanvas = await html2canvas(summaryContainer, { scale: 2, backgroundColor: '#ffffff' });
        document.body.removeChild(summaryContainer);
    
        // --- 2. Renderizar y capturar el Informe Detallado ---
        const detailContainer = document.createElement('div');
        detailContainer.style.position = 'absolute';
        detailContainer.style.left = '-9999px';
        detailContainer.style.width = `${reportWidth}px`;
        document.body.appendChild(detailContainer);
        const detailRoot = ReactDOMClient.createRoot(detailContainer);
    
        await new Promise<void>(resolve => {
            detailRoot.render(<DetailedReport result={result} inputs={inputs} />);
            setTimeout(resolve, 500); // Dar tiempo para el renderizado
        });
    
        const detailCanvas = await html2canvas(detailContainer, { scale: 2, backgroundColor: '#ffffff' });
        detailRoot.unmount();
        document.body.removeChild(detailContainer);
    
        // --- 3. Añadir ambas imágenes al PDF y guardar ---
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
                 <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Resumen de la Operación</h2>
                 <button onClick={handleDownloadPdf} className="w-full sm:w-auto bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105 duration-300 text-sm sm:text-base">
                    <i className="fas fa-file-pdf mr-2"></i> Descargar Informe
                </button>
            </div>
            
            <div ref={reportRef} className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200/80 text-gray-800">
                <div id="report-content" className="flex flex-col justify-between min-h-[75vh]">
                    
                    <div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
                            <SummaryCard title="Coste Total Operación" value={result.totalProjectCost} icon="fa-solid fa-building-shield" color="text-red-500" isCurrency />
                            <SummaryCard title="Beneficio Venta (antes imp.)" value={result.saleProfitBeforeTax} icon="fa-solid fa-sack-dollar" color="text-green-500" isCurrency />
                            <SummaryCard
                                title="Rentabilidad en Venta (s/Coste)"
                                value={result.saleProfitability}
                                icon="fa-solid fa-arrow-trend-up"
                                color="text-green-500"
                                highlight={getHighlight(result.saleProfitability)}
                            />
                             <SummaryCard
                                title="Rentabilidad Neta Alquiler"
                                value={result.netRentalYield}
                                icon="fa-solid fa-house-user"
                                color="text-teal-500"
                                highlight={getHighlight(result.netRentalYield)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3"><i className="fa-solid fa-calculator mr-2 text-amber-500"></i>Desglose de Costes</h3>
                                <DetailRow label="Coste Compra" subtitle="(Neto + Imp.)" value={formatCurrency(result.totalPurchaseCost)} />
                                <DetailRow label="Coste Reforma y otros" subtitle="(Neto + Imp.)" value={formatCurrency(result.totalRenovationCost)} />
                                <DetailRow label="COSTE TOTAL" value={formatCurrency(result.totalProjectCost)} isTotal />
                            </div>
                            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3"><i className="fa-solid fa-landmark mr-2 text-amber-500"></i>Financiación y Capital</h3>
                                <DetailRow label="Importe Financiado" subtitle="(Total)" value={formatCurrency(result.loanAmount)} />
                                <DetailRow label="Costes Asociados Préstamo" subtitle="(Total)" value={formatCurrency(result.loanAssociatedCosts)} />
                                <DetailRow label="CAPITAL APORTADO TOTAL" value={formatCurrency(result.totalCapitalProvided)} isTotal />
                            </div>
                        </div>

                        <div className="mt-6 sm:mt-8">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3"><i className="fa-solid fa-users-viewfinder mr-2 text-amber-500"></i>Desglose por Inversor</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs sm:text-sm">
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
                                            <tr key={inv.id} className="border-b border-gray-200 hover:bg-gray-50">
                                                <td className="p-2 sm:p-3 font-medium text-gray-800">#{index + 1} ({inv.type === 'individual' ? 'Persona' : 'Sociedad'})</td>
                                                <td className="p-2 sm:p-3 text-gray-800">{formatCurrency(inv.capitalProvided)}</td>
                                                <td className="p-2 sm:p-3 text-gray-800">{formatCurrency(inv.grossProfit)}</td>
                                                <td className="p-2 sm:p-3 text-red-600">({formatCurrency(inv.taxAmount)})</td>
                                                <td className="p-2 sm:p-3 font-bold text-green-700">{formatCurrency(inv.netProfit)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="font-bold bg-gray-100 text-gray-800 text-sm">
                                        <tr>
                                            <td className="p-2 sm:p-3">TOTAL</td>
                                            <td className="p-2 sm:p-3">{formatCurrency(result.totalCapitalProvided)}</td>
                                            <td className="p-2 sm:p-3">{formatCurrency(result.saleProfitBeforeTax)}</td>
                                            <td className="p-2 sm:p-3 text-red-600">({formatCurrency(result.investorBreakdown.reduce((s, i) => s + i.taxAmount, 0))})</td>
                                            <td className="p-2 sm:p-3">{formatCurrency(result.netProfitAfterTax)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>

                    <footer className="text-center mt-12 text-gray-500 text-xs">
                         <p>Este es un informe de estimación y no constituye asesoramiento financiero o fiscal. Los cálculos de impuestos son simplificados.</p>
                         <p>&copy; {new Date().getFullYear()} AO HOME. Todos los derechos reservados.</p>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default ReportDisplay;