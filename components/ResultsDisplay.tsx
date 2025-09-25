import React from 'react';
import { CalculationResult, RealEstateDealInput } from '../types';
import SummaryCard from './SummaryCard';
import GrowthChart from './GrowthChart';
import BreakdownTable from './BreakdownTable';

const formatCurrency = (value: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
const formatPercent = (value: number) => `${value.toFixed(2)}%`;

interface ReportDisplayProps {
    result: CalculationResult;
    inputs: RealEstateDealInput;
}

const ReportDisplay: React.FC<ReportDisplayProps> = ({ result, inputs }) => {
    const profitOnCapital = result.totalCapitalProvided > 0 ? (result.saleProfitBeforeTax / result.totalCapitalProvided) * 100 : 0;

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard 
                    title="Beneficio Neto Total"
                    value={formatCurrency(result.netProfitAfterTax)}
                    icon="fa-sack-dollar"
                    iconColorClass="text-green-300"
                    colorClass="bg-green-500/20"
                    subTitle="Bruto"
                    subValue={formatCurrency(result.saleProfitBeforeTax)}
                />
                <SummaryCard 
                    title="Rentabilidad Venta"
                    value={formatPercent(result.saleProfitability)}
                    icon="fa-arrow-trend-up"
                    subTitle="s/Capital"
                    subValue={formatPercent(profitOnCapital)}
                    highlight={result.saleProfitability > 15 ? 'green' : 'red'}
                />
                <SummaryCard 
                    title="Inversión Total"
                    value={formatCurrency(result.totalProjectCost)}
                    icon="fa-coins"
                    iconColorClass="text-yellow-300"
                    colorClass="bg-yellow-500/20"
                    subTitle="Capital a aportar"
                    subValue={formatCurrency(result.totalCapitalProvided)}
                    subTitleTooltip="Calculado a partir de los impuestos, gastos de compra y el coste total de la reforma y acondicionamiento."
                />
                <SummaryCard 
                    title="Rentabilidad Alquiler"
                    value={formatPercent(result.netRentalYield)}
                    icon="fa-house-user"
                    subTitle="Bruta"
                    subValue={formatPercent(result.grossRentalYield)}
                    highlight={result.netRentalYield > 6 ? 'green' : 'red'}
                />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
                <div className="lg:col-span-2">
                     <GrowthChart 
                        cost={result.totalProjectCost} 
                        saleValue={inputs.salePrice} 
                        profit={result.saleProfitBeforeTax}
                    />
                </div>
                <div className="lg:col-span-3">
                    <BreakdownTable investors={result.investorBreakdown} />
                </div>
            </div>

        </div>
    );
};

export default ReportDisplay;