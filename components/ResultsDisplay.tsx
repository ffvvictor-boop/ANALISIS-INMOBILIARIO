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

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                 <h2 className="text-3xl font-bold text-gray-800">Resumen de la Operación</h2>
                 <button onClick={handleDownloadPdf} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105 duration-300">
                    <i className="fas fa-file-pdf mr-2"></i> Descargar Informe
                </button>
            </div>
            
            <div ref={reportRef} className="glassmorphism p-6 text-gray-800">
                <div id="report-content">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <SummaryCard title="Coste Total Operación" value={result.totalProjectCost} icon="fa-solid fa-building-shield" color="text-red-500" isCurrency />
                        <SummaryCard title="Rentabilidad en Venta (s/Coste)" value={result.saleProfitability} icon="fa-solid fa-arrow-trend-up" color="text-green-500" />
                        <SummaryCard title="Beneficio Venta (antes imp.)" value={result.saleProfitBeforeTax} icon="fa-solid fa-sack-dollar" color="text-green-500" isCurrency />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white/40 p-4 rounded-lg border border-white/20">
                            <h3 className="text-xl font-semibold text-gray-700 mb-3"><i className="fa-solid fa-calculator mr-2 text-amber-500"></i>Desglose de Costes</h3>
                            <DetailRow label="Coste Compra (Neto + Imp.)" value={formatCurrency(result.totalPurchaseCost)} />
                            <DetailRow label="Coste Reforma y otros (Neto + Imp.)" value={formatCurrency(result.totalRenovationCost)} />
                            <DetailRow label="Licencias y Gastos" value={formatCurrency(result.totalLicensesCost + result.totalOtherCosts)} />
                            <DetailRow label="COSTE TOTAL" value={formatCurrency(result.totalProjectCost)} isTotal />
                        </div>
                        <div className="bg-white/40 p-4 rounded-lg border border-white/20">
                            <h3 className="text-xl font-semibold text-gray-700 mb-3"><i className="fa-solid fa-landmark mr-2 text-amber-500"></i>Financiación y Capital</h3>
                            <DetailRow label="Importe Financiado (Total)" value={formatCurrency(result.loanAmount)} />
                            <DetailRow label="Costes Asociados Préstamo (Total)" value={formatCurrency(result.loanAssociatedCosts)} />
                            <DetailRow label="CAPITAL TOTAL APORTADO" value={formatCurrency(result.totalCapitalProvided)} isTotal />
                        </div>
                    </div>

                    <div className="bg-white/40 p-4 rounded-lg border border-white/20">
                        <h3 className="text-xl font-semibold text-gray-700 mb-3"><i className="fa-solid fa-users-viewfinder mr-2 text-amber-500"></i>Reparto de Beneficios por Inversor</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b-2 border-black/20 text-gray-500">
                                    <tr>
                                        <th className="p-3 font-semibold">Inversor</th>
                                        <th className="p-3 text-center font-semibold">Participación</th>
                                        <th className="p-3 font-semibold">Tipo</th>
                                        <th className="p-3 text-right font-semibold">Capital Aportado</th>
                                        <th className="p-3 text-right font-semibold">Beneficio Bruto</th>
                                        <th className="p-3 text-right font-semibold">Impuestos</th>
                                        <th className="p-3 text-right font-bold text-base">Beneficio Neto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {result.investorBreakdown.map((inv, index) => (
                                        <tr key={inv.id} className="border-b border-black/10">
                                            <td className="p-3 font-semibold text-gray-800">#{index + 1}</td>
                                            <td className="p-3 text-center text-gray-700">{formatPercent(inv.participation)}</td>
                                            <td className="p-3 text-gray-700">{inv.type === 'individual' ? 'P. Física' : 'Sociedad'}</td>
                                            <td className="p-3 text-right font-medium text-blue-600">{formatCurrency(inv.capitalProvided)}</td>
                                            <td className="p-3 text-right text-gray-700">{formatCurrency(inv.grossProfit)}</td>
                                            <td className="p-3 text-right text-red-500">-{formatCurrency(inv.taxAmount)}</td>
                                            <td className="p-3 text-right font-bold text-green-600 text-base">{formatCurrency(inv.netProfit)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportDisplay;