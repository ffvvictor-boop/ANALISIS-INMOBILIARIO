import React from 'react';
import { InvestorBreakdown } from '../types';

const formatCurrency = (value: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);

interface BreakdownTableProps {
    investors: InvestorBreakdown[];
}

const BreakdownTable: React.FC<BreakdownTableProps> = ({ investors }) => {
    return (
        <div className="bg-white/5 backdrop-blur-sm p-4 sm:p-5 rounded-lg border border-white/10 h-full">
            <h3 className="text-lg font-bold text-white mb-4">Desglose por Inversor</h3>
            
            {/* Mobile View: Cards */}
            <div className="md:hidden space-y-4">
                {investors.map((inv, index) => (
                    <div key={inv.id} className="bg-black/20 p-4 rounded-lg border border-white/10">
                        <div className="flex justify-between items-center mb-3 pb-3 border-b border-white/10">
                            <h4 className="font-bold text-white">Inversor #{index + 1} <span className="text-xs font-normal text-gray-300">({inv.type === 'company' ? 'Soc.' : 'Ind.'})</span></h4>
                            <span className="text-sm font-semibold bg-blue-500/20 text-blue-200 px-2 py-1 rounded">{inv.participation.toFixed(2)}% Part.</span>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-300">Capital a aportar:</span>
                                <span className="text-white font-medium">{formatCurrency(inv.capitalProvided)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-300">Beneficio Bruto:</span>
                                <span className="text-green-400 font-medium">{formatCurrency(inv.grossProfit)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-300">Impuestos:</span>
                                <span className="text-red-400 font-medium">{formatCurrency(inv.taxAmount)}</span>
                            </div>
                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10">
                                <span className="text-white font-bold">Beneficio Neto:</span>
                                <span className="text-white font-bold text-xl">{formatCurrency(inv.netProfit)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-200">
                    <thead className="text-xs text-gray-300 uppercase bg-white/5">
                        <tr>
                            <th scope="col" className="px-4 py-3">Inversor</th>
                            <th scope="col" className="px-4 py-3">Part.</th>
                            <th scope="col" className="px-4 py-3">Capital a aportar</th>
                            <th scope="col" className="px-4 py-3">Beneficio Bruto</th>
                            <th scope="col" className="px-4 py-3">Impuestos</th>
                            <th scope="col" className="px-4 py-3">Beneficio Neto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {investors.map((inv, index) => (
                            <tr key={inv.id} className="border-b border-white/10 hover:bg-white/5">
                                <td className="px-4 py-3 font-medium text-white">
                                    #{index + 1} <span className="text-xs text-gray-300">({inv.type === 'company' ? 'Soc.' : 'Ind.'})</span>
                                </td>
                                <td className="px-4 py-3">{inv.participation.toFixed(2)}%</td>
                                <td className="px-4 py-3">{formatCurrency(inv.capitalProvided)}</td>
                                <td className="px-4 py-3 text-green-400">{formatCurrency(inv.grossProfit)}</td>
                                <td className="px-4 py-3 text-red-400">{formatCurrency(inv.taxAmount)}</td>
                                <td className="px-4 py-3 font-bold text-white">{formatCurrency(inv.netProfit)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BreakdownTable;