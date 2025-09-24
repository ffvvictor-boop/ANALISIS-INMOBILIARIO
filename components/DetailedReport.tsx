import React from 'react';
import { CalculationResult, RealEstateDealInput } from '../types';

interface DetailRowProps {
    label: string;
    value: number;
    isSubtotal?: boolean;
    isTotal?: boolean;
    indent?: boolean;
    isSubHeader?: boolean;
}

const formatCurrency = (value: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
const formatPercent = (value: number) => `${value.toFixed(2)}%`;

const DetailRow: React.FC<DetailRowProps> = ({ label, value, isSubtotal, isTotal, indent, isSubHeader }) => {
    if (isSubHeader) {
        return <h4 className="font-semibold text-gray-600 mt-4 mb-1">{label}</h4>
    }
    return (
        <div className={`flex justify-between py-1.5 ${indent ? 'pl-4' : ''} ${isTotal ? 'font-bold text-lg border-t-2 border-gray-300 pt-2 mt-2' : ''} ${isSubtotal ? 'font-semibold' : ''}`}>
            <span>{label}</span>
            <span>{formatCurrency(value)}</span>
        </div>
    )
};

const Section: React.FC<{ title: string; icon: string; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-gray-50/80 p-5 rounded-lg border border-gray-200">
        <h3 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2"><i className={`${icon} mr-3 text-blue-500`}></i>{title}</h3>
        <div className="space-y-1">{children}</div>
    </div>
);


const DetailedReport: React.FC<{ result: CalculationResult; inputs: RealEstateDealInput }> = ({ result, inputs }) => {
    const { details } = result;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200/80 text-gray-800 space-y-6 max-h-[80vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-gray-800">Informe Detallado de la Operación</h2>
            
            <Section title="Costes de Compra" icon="fa-solid fa-file-invoice-dollar">
                <DetailRow label="Valor del Inmueble" value={details.propertyValue} />
                <DetailRow label={`Impuesto de Transmisión (${inputs.purchaseTaxType.toUpperCase().replace('_', ' ')})`} value={details.purchaseTax} />
                <DetailRow label="Notaría" value={details.notaryFees} />
                <DetailRow label="Registro" value={details.registryFees} />
                <DetailRow label="Gestoría" value={details.agencyFees} />
                <DetailRow label="Honorarios Inmobiliaria" value={details.realEstateAgencyFees} />
                <DetailRow label="Total Costes de Compra" value={result.totalPurchaseCost} isSubtotal />
            </Section>

            <Section title="Costes de Reforma y Acondicionamiento" icon="fa-solid fa-person-digging">
                <DetailRow isSubHeader label="Reforma y Mobiliario" value={0}/>
                <DetailRow label="Coste Base Reforma" value={details.renovationBaseCost} indent />
                <DetailRow label="Coste Base Mobiliario" value={details.furnitureBaseCost} indent />
                <DetailRow label={`IVA Reforma (${inputs.renovationVatType === 'none' ? '0' : inputs.renovationVatType}%)`} value={details.renovationVat} indent />
                <DetailRow label="Subtotal Reforma y Mobiliario" value={details.renovationBaseCost + details.furnitureBaseCost + details.renovationVat} isSubtotal />

                <DetailRow isSubHeader label="Otros Costes y Desvíos" value={0}/>
                <DetailRow label={`Desvíos (${inputs.contingencyRate}%)`} value={details.contingencyAmount} indent />
                <DetailRow label="Gastos Generales" value={details.generalExpenses} indent />
                <DetailRow label="Honorarios Técnicos (Base)" value={details.technicalFeesBase} indent />
                <DetailRow label="IVA Honorarios Técnicos (21%)" value={details.technicalFeesVat} indent />
                <DetailRow label={`ICIO (${inputs.icioRate}%)`} value={details.icioTax} indent />
                <DetailRow label="Alta de Suministros" value={details.supplySetupCost} indent />
                <DetailRow label="Total Reforma y Acondicionamiento" value={result.totalRenovationCost} isSubtotal />
            </Section>

            <Section title="Resumen de Inversión Total" icon="fa-solid fa-sack-xmark">
                 <DetailRow label="Total Costes de Compra" value={result.totalPurchaseCost} />
                 <DetailRow label="Total Reforma y Acondicionamiento" value={result.totalRenovationCost} />
                 <DetailRow label="INVERSIÓN TOTAL" value={result.totalProjectCost} isTotal />
            </Section>

            <Section title="Proyección de Venta" icon="fa-solid fa-chart-line">
                <DetailRow label="Precio de Venta Estimado" value={inputs.salePrice} />
                <DetailRow isSubHeader label="Gastos de Venta" value={0}/>
                <DetailRow label="Plusvalía Municipal" value={details.capitalGainsTax} indent/>
                <DetailRow label="Certificado Energético (CEE)" value={details.ceeCost} indent/>
                <DetailRow label="Notaría de Venta" value={details.notarySaleCost} indent/>
                <DetailRow label="Total Gastos de Venta" value={details.capitalGainsTax + details.ceeCost + details.notarySaleCost} isSubtotal />
                <DetailRow label="BENEFICIO BRUTO (Antes de Impuestos)" value={result.saleProfitBeforeTax} isTotal />
                <DetailRow label="BENEFICIO NETO (Después de Impuestos)" value={result.netProfitAfterTax} isTotal />
                <div className="flex justify-around mt-4 pt-4 border-t">
                    <div className="text-center">
                        <div className="text-sm text-gray-500">Rentabilidad s/Coste</div>
                        <div className="text-2xl font-bold text-green-600">{formatPercent(result.saleProfitability)}</div>
                    </div>
                     <div className="text-center">
                        <div className="text-sm text-gray-500">Rentabilidad s/Capital Aportado</div>
                        <div className="text-2xl font-bold text-green-600">{formatPercent(result.totalCapitalProvided > 0 ? (result.saleProfitBeforeTax / result.totalCapitalProvided * 100) : 0)}</div>
                    </div>
                </div>
            </Section>
            
            <Section title="Análisis de Alquiler" icon="fa-solid fa-house-user">
                <DetailRow label="Ingresos Anuales Brutos" value={details.grossAnnualRent}/>
                <DetailRow label="Gastos Anuales (IBI, Seguro, etc.)" value={details.annualExpenses}/>
                <DetailRow label="Ingresos Anuales Netos" value={details.netAnnualRent} isSubtotal/>
                <div className="flex justify-around mt-4 pt-4 border-t">
                    <div className="text-center">
                        <div className="text-sm text-gray-500">Rentabilidad Bruta Alquiler</div>
                        <div className="text-2xl font-bold text-teal-600">{formatPercent(result.grossRentalYield)}</div>
                    </div>
                     <div className="text-center">
                        <div className="text-sm text-gray-500">Rentabilidad Neta Alquiler</div>
                        <div className="text-2xl font-bold text-teal-600">{formatPercent(result.netRentalYield)}</div>
                    </div>
                </div>
            </Section>

        </div>
    );
};

export default DetailedReport;
