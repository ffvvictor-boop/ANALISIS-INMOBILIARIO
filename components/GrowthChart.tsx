import React from 'react';

interface GrowthChartProps {
    cost: number;
    saleValue: number;
    profit: number;
}

const formatCurrency = (value: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);

const GrowthChart: React.FC<GrowthChartProps> = ({ cost, saleValue, profit }) => {
    // For visualization, only show positive profit in the bar.
    const positiveProfit = Math.max(0, profit);
    const totalForBar = cost + positiveProfit;
    const costPercentage = totalForBar > 0 ? (cost / totalForBar) * 100 : 100;
    const profitPercentage = totalForBar > 0 ? (positiveProfit / totalForBar) * 100 : 0;
    
    return (
        <div className="bg-white/5 backdrop-blur-sm p-4 sm:p-5 rounded-lg border border-white/10 h-full flex flex-col justify-between">
            <div>
                <h3 className="text-lg font-bold text-white mb-1">Crecimiento de la Inversión</h3>
                <p className="text-sm text-gray-200">De coste a valor de venta.</p>
            </div>
            
            <div className="my-6 space-y-3">
                <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-yellow-400 mr-3"></div>
                    <div className="text-sm text-gray-200 flex justify-between w-full">
                        <span>Inversión Total</span>
                        <span className="font-bold text-white">{formatCurrency(cost)}</span>
                    </div>
                </div>
                <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${profit >= 0 ? 'bg-green-400' : 'bg-red-400'} mr-3`}></div>
                    <div className="text-sm text-gray-200 flex justify-between w-full">
                        <span>Beneficio Bruto</span>
                        <span className={`font-bold ${profit >= 0 ? 'text-white' : 'text-red-400'}`}>{formatCurrency(profit)}</span>
                    </div>
                </div>
                 <div className="flex items-center border-t border-white/10 pt-3 mt-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mr-3"></div>
                    <div className="text-sm text-gray-200 flex justify-between w-full">
                        <span>Precio de Venta</span>
                        <span className="font-bold text-white">{formatCurrency(saleValue)}</span>
                    </div>
                </div>
            </div>

            <div className="w-full bg-gray-700/50 rounded-full h-4 overflow-hidden flex">
                <div className="bg-yellow-400 h-full" style={{ width: `${costPercentage}%` }} title={`Cost: ${costPercentage.toFixed(2)}%`}></div>
                <div className="bg-green-400 h-full" style={{ width: `${profitPercentage}%` }} title={`Profit: ${profitPercentage.toFixed(2)}%`}></div>
            </div>
        </div>
    );
};

export default GrowthChart;