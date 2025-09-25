import React from 'react';
import { CalculationResult, RealEstateDealInput } from '../types';

interface DetailRowProps {
    label: string;
    value: number;
    isSubtotal?: boolean;
    isTotal?: boolean;
    indent?: boolean;
    isSubHeader?: boolean;
    isPdf?: boolean;
}

const formatCurrency = (value: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
const formatPercent = (value: number) => `${value.toFixed(2)}%`;

const DetailRow: React.FC<DetailRowProps> = ({ label, value, isSubtotal, isTotal, indent, isSubHeader, isPdf }) => {
    const textColor = isPdf ? 'text-gray-800' : 'text-white';
    const subHeaderColor = isPdf ? 'text-gray-600' : 'text-gray-300';

    if (isSubHeader) {
        return <h4 className={`font-semibold ${subHeaderColor} mt-4 mb-1`}>{label}</h4>
    }
    return (
        <div className={`flex justify-between py-1.5 ${indent ? 'pl-4' : ''} ${isTotal ? `font-bold text-lg ${isPdf ? 'border-gray-300' : 'border-white/20'} border-t-2 pt-2 mt-2` : ''} ${isSubtotal ? 'font-semibold' : ''} ${textColor}`}>
            <span>{label}</span>
            <span>{formatCurrency(value)}</span>
        </div>
    )
};

const Section: React.FC<{ title: string; icon: string; children: React.ReactNode; isPdf?: boolean }> = ({ title, icon, children, isPdf }) => (
    <div className={isPdf ? 'bg-gray-50 p-4 rounded-lg border border-gray-200' : 'bg-white/5 backdrop-blur-sm p-4 sm:p-5 rounded-lg border border-white/10'}>
        <h3 className={`text-lg sm:text-xl font-bold ${isPdf ? 'text-gray-700 border-gray-200' : 'text-white border-white/10'} mb-3 sm:mb-4 border-b pb-2`}><i className={`${icon} mr-3 ${isPdf ? 'text-blue-500' : 'text-blue-400'}`}></i>{title}</h3>
        <div className="space-y-1">{children}</div>
    </div>
);


const DetailedReport: React.FC<{ result: CalculationResult; inputs: RealEstateDealInput; isPdf?: boolean }> = ({ result, inputs, isPdf = false }) => {
    const { details } = result;

    const containerClasses = isPdf
        ? "bg-white p-8 text-gray-800 space-y-6 text-base"
        : "bg-black/20 backdrop-blur-xl p-4 sm:p-6 rounded-2xl shadow-lg border border-white/20 text-white space-y-4 sm:space-y-6 max-h-[80vh] overflow-y-auto text-sm sm:text-base";

    const titleColor = isPdf ? 'text-gray-800' : 'text-white';
    const textColor = isPdf ? 'text-gray-500' : 'text-gray-300';
    const accentColor = isPdf ? 'text-green-600' : 'text-green-400';
    const accentTealColor = isPdf ? 'text-teal-600' : 'text-teal-400';

    return (
        <div className={containerClasses}>
            <h2 className={`text-2xl sm:text-3xl font-bold ${titleColor}`}>Informe Detallado de la Operación</h2>
            
            <Section title="Costes de Compra" icon="fa-solid fa-file-invoice-dollar" isPdf={isPdf}>
                <DetailRow label="Valor del Inmueble" value={details.propertyValue} isPdf={isPdf}/>
                <DetailRow label={`Impuesto de Transmisión (${inputs.purchaseTaxType.toUpperCase().replace('_', ' ')})`} value={details.purchaseTax} isPdf={isPdf}/>
                <DetailRow label="Notaría" value={details.notaryFees} isPdf={isPdf}/>
                <DetailRow label="Registro" value={details.registryFees} isPdf={isPdf}/>
                <DetailRow label="Gestoría" value={details.agencyFees} isPdf={isPdf}/>
                <DetailRow label="Honorarios Inmobiliaria" value={details.realEstateAgencyFees} isPdf={isPdf}/>
                <DetailRow label="Total Costes de Compra" value={result.totalPurchaseCost} isSubtotal isPdf={isPdf}/>
            </Section>

            <Section title="Costes de Reforma y Acondicionamiento" icon="fa-solid fa-person-digging" isPdf={isPdf}>
                <DetailRow isSubHeader label="Reforma y Mobiliario" value={0} isPdf={isPdf}/>
                <DetailRow label="Coste Base Reforma" value={details.renovationBaseCost} indent isPdf={isPdf}/>
                <DetailRow label="Coste Base Mobiliario" value={details.furnitureBaseCost} indent isPdf={isPdf}/>
                <DetailRow label={`IVA Reforma (${inputs.renovationVatType === 'none' ? '0' : inputs.renovationVatType}%)`} value={details.renovationVat} indent isPdf={isPdf}/>
                <DetailRow label="Subtotal Reforma y Mobiliario" value={details.renovationBaseCost + details.furnitureBaseCost + details.renovationVat} isSubtotal isPdf={isPdf}/>

                <DetailRow isSubHeader label="Otros Costes y Desvíos" value={0} isPdf={isPdf}/>
                <DetailRow label={`Desvíos (${inputs.contingencyRate}%)`} value={details.contingencyAmount} indent isPdf={isPdf}/>
                <DetailRow label="Gastos Generales" value={details.generalExpenses} indent isPdf={isPdf}/>
                <DetailRow label="Honorarios Técnicos (Base)" value={details.technicalFeesBase} indent isPdf={isPdf}/>
                <DetailRow label="IVA Honorarios Técnicos (21%)" value={details.technicalFeesVat} indent isPdf={isPdf}/>
                <DetailRow label={`ICIO (${inputs.icioRate}%)`} value={details.icioTax} indent isPdf={isPdf}/>
                <DetailRow label="Alta de Suministros" value={details.supplySetupCost} indent isPdf={isPdf}/>
                <DetailRow label="Total Reforma y Acondicionamiento" value={result.totalRenovationCost} isSubtotal isPdf={isPdf}/>
            </Section>

            <Section title="Resumen de Inversión Total" icon="fa-solid fa-sack-xmark" isPdf={isPdf}>
                 <DetailRow label="Total Costes de Compra" value={result.totalPurchaseCost} isPdf={isPdf}/>
                 <DetailRow label="Total Reforma y Acondicionamiento" value={result.totalRenovationCost} isPdf={isPdf}/>
                 <DetailRow label="INVERSIÓN TOTAL" value={result.totalProjectCost} isTotal isPdf={isPdf}/>
            </Section>

            <Section title="Proyección de Venta" icon="fa-solid fa-chart-line" isPdf={isPdf}>
                <DetailRow label="Precio de Venta Estimado" value={inputs.salePrice} isPdf={isPdf}/>
                <DetailRow isSubHeader label="Gastos de Venta" value={0} isPdf={isPdf}/>
                <DetailRow label="Plusvalía Municipal" value={details.capitalGainsTax} indent isPdf={isPdf}/>
                <DetailRow label="Certificado Energético (CEE)" value={details.ceeCost} indent isPdf={isPdf}/>
                <DetailRow label="Notaría de Venta" value={details.notarySaleCost} indent isPdf={isPdf}/>
                <DetailRow label="Total Gastos de Venta" value={details.capitalGainsTax + details.ceeCost + details.notarySaleCost} isSubtotal isPdf={isPdf}/>
                <DetailRow label="BENEFICIO BRUTO (Antes de Impuestos)" value={result.saleProfitBeforeTax} isTotal isPdf={isPdf}/>
                <DetailRow label="BENEFICIO NETO (Después de Impuestos)" value={result.netProfitAfterTax} isTotal isPdf={isPdf}/>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-around mt-4 pt-4 border-t border-white/10">
                    <div className="text-center">
                        <div className={`text-sm ${textColor}`}>Rentabilidad s/Coste</div>
                        <div className={`text-2xl font-bold ${accentColor}`}>{formatPercent(result.saleProfitability)}</div>
                    </div>
                     <div className="text-center">
                        <div className={`text-sm ${textColor}`}>Rentabilidad s/Capital Aportado</div>
                        <div className={`text-2xl font-bold ${accentColor}`}>{formatPercent(result.totalCapitalProvided > 0 ? (result.saleProfitBeforeTax / result.totalCapitalProvided * 100) : 0)}</div>
                    </div>
                </div>
            </Section>
            
            <Section title="Análisis de Alquiler" icon="fa-solid fa-house-user" isPdf={isPdf}>
                <DetailRow label="Ingresos Anuales Brutos" value={details.grossAnnualRent} isPdf={isPdf}/>
                <DetailRow label="Gastos Anuales (IBI, Seguro, etc.)" value={details.annualExpenses} isPdf={isPdf}/>
                <DetailRow label="Ingresos Anuales Netos" value={details.netAnnualRent} isSubtotal isPdf={isPdf}/>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-around mt-4 pt-4 border-t border-white/10">
                    <div className="text-center">
                        <div className={`text-sm ${textColor}`}>Rentabilidad Bruta Alquiler</div>
                        <div className={`text-2xl font-bold ${accentTealColor}`}>{formatPercent(result.grossRentalYield)}</div>
                    </div>
                     <div className="text-center">
                        <div className={`text-sm ${textColor}`}>Rentabilidad Neta Alquiler</div>
                        <div className={`text-2xl font-bold ${accentTealColor}`}>{formatPercent(result.netRentalYield)}</div>
                    </div>
                </div>
            </Section>

        </div>
    );
};

export default DetailedReport;