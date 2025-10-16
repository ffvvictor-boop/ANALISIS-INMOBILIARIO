import React from 'react';

interface GrowthChartProps {
    purchaseCost: number;
    renovationCost: number;
    totalCost: number;
    saleValue: number;
    profit: number;
}

const formatCurrency = (value: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);

const GrowthChart: React.FC<GrowthChartProps> = ({ purchaseCost, renovationCost, totalCost, saleValue, profit }) => {
    return (
        <div className="bg-white/5 backdrop-blur-sm p-4 sm:p-5 rounded-lg border border-white/10 h-full flex flex-col">
            <div>
                <h3 className="text-lg font-bold text-white mb-1">RESUMEN</h3>
                <p className="text-sm text-gray-200">Desglose de la operación de venta.</p>
            </div>
            
            <div className="my-auto space-y-3">
                 <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-gray-400 mr-3"></div>
                    <div className="text-sm text-gray-200 flex justify-between w-full">
                        <span>Coste de Compra</span>
                        <span className="font-bold text-white">{formatCurrency(purchaseCost)}</span>
                    </div>
                </div>
                 <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-gray-400 mr-3"></div>
                    <div className="text-sm text-gray-200 flex justify-between w-full">
                        <span>Coste de Reforma</span>
                        <span className="font-bold text-white">{formatCurrency(renovationCost)}</span>
                    </div>
                </div>
                 <div className="flex items-center border-t border-white/10 pt-3 mt-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-400 mr-3"></div>
                    <div className="text-sm text-gray-200 flex justify-between w-full">
                        <span>Inversión Total</span>
                        <span className="font-bold text-white">{formatCurrency(totalCost)}</span>
                    </div>
                </div>
                 <div className="flex items-center border-t border-white/10 pt-3 mt-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mr-3"></div>
                    <div className="text-sm text-gray-200 flex justify-between w-full">
                        <span>Precio de Venta</span>
                        <span className="font-bold text-white">{formatCurrency(saleValue)}</span>
                    </div>
                </div>
                <div className="flex items-center border-t-2 border-white/20 pt-3 mt-3">
                    <div className={`w-2 h-2 rounded-full ${profit >= 0 ? 'bg-green-400' : 'bg-red-400'} mr-3`}></div>
                    <div className="text-sm text-gray-200 flex justify-between w-full">
                        <span className="font-bold text-white">Beneficio</span>
                        <span className={`font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatCurrency(profit)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GrowthChart;