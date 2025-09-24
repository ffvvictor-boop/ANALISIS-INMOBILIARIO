import React, { useRef } from 'react';
import { CalculationResult } from '../types';
import SummaryCard from './SummaryCard';

// @ts-ignore
const { jsPDF } = window.jspdf;
// @ts-ignore
const { html2canvas } = window;


interface ReportDisplayProps {
    result: CalculationResult;
}

const formatCurrency = (value: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
const formatPercent = (value: number) => `${value.toFixed(2)}%`;

const DetailRow: React.FC<{ label: string; value: string; isTotal?: boolean }> = ({ label, value, isTotal = false }) => (
    <div className={`flex justify-between py-2.5 px-3 rounded-md ${isTotal ? 'font-bold text-gray-800 bg-black/10 mt-2' : 'border-b border-black/10'}`}>
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-800">{value}</span>
    </div>
);

const ReportDisplay: React.FC<ReportDisplayProps> = ({ result }) => {
    const reportRef = useRef<HTMLDivElement>(null);

    const handleDownloadPdf = () => {
        if (!reportRef.current) return;
        
        const reportElement = reportRef.current;
        html2canvas(reportElement, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('informe_rentabilidad_inmobiliaria.pdf');
        });
    };
    
    const getHighlight = (value: number): 'green' | 'red' | undefined => {
        if (value > 15) return 'green';
        if (value < 6) return 'red';
        return undefined;
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                 <h2 className="text-3xl font-bold text-gray-800">Resumen de la Operación</h2>
                 <button onClick={handleDownloadPdf} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105 duration-300">
                    <i className="fas fa-file-pdf mr-2"></i> Descargar Informe
                </button>
            </div>
            
            <div ref={reportRef} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200/80 text-gray-800">
                <div id="report-content" className="flex flex-col justify-between min-h-[75vh]">
                    
                    <div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h3 className="text-xl font-semibold text-gray-700 mb-3"><i className="fa-solid fa-calculator mr-2 text-amber-500"></i>Desglose de Costes</h3>
                                <DetailRow label="Coste Compra (Neto + Imp.)" value={formatCurrency(result.totalPurchaseCost)} />
                                <DetailRow label="Coste Reforma y otros (Neto + Imp.)" value={formatCurrency(result.totalRenovationCost)} />
                                <DetailRow label="COSTE TOTAL" value={formatCurrency(result.totalProjectCost)} isTotal />
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h3 className="text-xl font-semibold text-gray-700 mb-3"><i className="fa-solid fa-landmark mr-2 text-amber-500"></i>Financiación y Capital</h3>
                                <DetailRow label="Importe Financiado (Total)" value={formatCurrency(result.loanAmount)} />
                                {/* FIX: Changed incorrect function call 'format' to 'formatCurrency' to correctly format the value. */}
                                <DetailRow label="Costes Asociados Préstamo (Total)" value={formatCurrency(result.loanAssociatedCosts)} />
                                <DetailRow label="CAPITAL APORTADO TOTAL" value={formatCurrency(result.totalCapitalProvided)} isTotal />
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-xl font-semibold text-gray-700 mb-3"><i className="fa-solid fa-users-viewfinder mr-2 text-amber-500"></i>Desglose por Inversor</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
                                        <tr>
                                            <th className="p-3">Inversor</th>
                                            <th className="p-3">Capital Aportado</th>
                                            <th className="p-3">Beneficio Bruto</th>
                                            <th className="p-3">Impuestos (Estim.)</th>
                                            <th className="p-3">Beneficio Neto</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.investorBreakdown.map((inv, index) => (
                                            <tr key={inv.id} className="border-b border-gray-200 hover:bg-gray-50">
                                                <td className="p-3 font-medium text-gray-800">#{index + 1} ({inv.type === 'individual' ? 'Persona' : 'Sociedad'})</td>
                                                <td className="p-3 text-gray-800">{formatCurrency(inv.capitalProvided)}</td>
                                                <td className="p-3 text-gray-800">{formatCurrency(inv.grossProfit)}</td>
                                                <td className="p-3 text-red-600">({formatCurrency(inv.taxAmount)})</td>
                                                <td className="p-3 font-bold text-green-700">{formatCurrency(inv.netProfit)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="font-bold bg-gray-100 text-gray-800">
                                        <tr>
                                            <td className="p-3">TOTAL</td>
                                            <td className="p-3">{formatCurrency(result.totalCapitalProvided)}</td>
                                            <td className="p-3">{formatCurrency(result.saleProfitBeforeTax)}</td>
                                            <td className="p-3 text-red-600">({formatCurrency(result.investorBreakdown.reduce((s, i) => s + i.taxAmount, 0))})</td>
                                            <td className="p-3">{formatCurrency(result.netProfitAfterTax)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>

                    <footer className="text-center mt-12 text-gray-500 text-xs">
                         <p>Este es un informe de estimación y no constituye asesoramiento financiero o fiscal. Los cálculos de impuestos son simplificados.</p>
                         <p>&copy; {new Date().getFullYear()} Analizador de Rentabilidad Inmobiliaria. Todos los derechos reservados.</p>
                    </footer>
                </div>
            </div>
        </div>
    );
};

{/* FIX: Added a default export to the ReportDisplay component to resolve the module import error in App.tsx. */}
export default ReportDisplay;