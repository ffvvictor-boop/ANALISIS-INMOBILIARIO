import React, { useState } from 'react';
import { RealEstateDealInput, Investor, CalculationResult } from '../types';

interface InputFieldProps {
    id: string;
    label: string;
    icon: string;
    value: number | '';
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    step?: string;
    unit?: string;
    investorId?: number;
}

const InputField: React.FC<InputFieldProps> = ({ id, label, icon, value, onChange, step = "0.01", unit = '' }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-200 mb-1">{label}</label>
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <i className={`${icon} text-gray-300`}></i>
            </div>
            <input type="number" id={id} name={id} value={value} onChange={onChange} step={step} className="w-full pl-10 pr-12 py-2 bg-white/10 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 placeholder-gray-300" placeholder="0"/>
            {unit && <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-200 text-sm">{unit}</span>}
        </div>
    </div>
);


interface SelectFieldProps {
    id: string;
    label: string;
    icon: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string; label: string }[];
}

const SelectField: React.FC<SelectFieldProps> = ({ id, label, icon, value, onChange, options }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-200 mb-1">{label}</label>
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><i className={`${icon} text-gray-300`}></i></div>
            <select id={id} name={id} value={value} onChange={onChange} className="w-full pl-10 py-2.5 bg-white/10 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 appearance-none">
                {options.map(opt => <option key={opt.value} value={opt.value} className="bg-gray-800">{opt.label}</option>)}
            </select>
        </div>
    </div>
);

interface CheckboxFieldProps {
    id: string;
    label: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({ id, label, checked, onChange }) => (
    <div className="flex items-center">
        <input type="checkbox" id={id} name={id} checked={checked} onChange={onChange} className="h-4 w-4 rounded border-gray-500 text-blue-500 focus:ring-blue-400 bg-white/10" />
        <label htmlFor={id} className="ml-3 block text-sm text-gray-100">{label}</label>
    </div>
);


const Section: React.FC<{ title: string; icon: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, icon, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <details open={isOpen} onToggle={(e) => setIsOpen((e.currentTarget as HTMLDetailsElement).open)} className="bg-white/5 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-white/10">
            <summary className="cursor-pointer text-base sm:text-lg font-semibold text-white flex justify-between items-center">
                <span><i className={`${icon} mr-3 text-blue-400`}></i>{title}</span>
                <i className={`fas fa-chevron-down text-gray-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
            </summary>
            <div className="mt-4 space-y-4 border-t border-white/10 pt-4">{children}</div>
        </details>
    );
}

// Minimalist input for investor section
const MinimalistInputField: React.FC<{id: string, value: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, unit: string}> = ({id, value, onChange, unit}) => (
    <div className="relative">
        <input 
            type="number"
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            step="0.01"
            className="w-full py-2 bg-transparent text-white border-b-2 border-white/20 focus:outline-none focus:border-blue-400 transition duration-200 placeholder-gray-300"
            placeholder="0"
        />
        <span className="absolute inset-y-0 right-0 flex items-center pr-1 text-gray-200 text-sm">{unit}</span>
    </div>
)

const formatCurrency = (value: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);

interface DealFormProps {
    inputs: RealEstateDealInput;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onInvestorChange: (id: number, field: keyof Omit<Investor, 'id'>, value: string | number) => void;
    onInvestorCountChange: (count: number) => void;
    onReset: () => void;
    onAnalyze: () => void;
    totalParticipation: number;
    result: CalculationResult | null;
}

const DealForm: React.FC<DealFormProps> = ({ inputs, onInputChange, onInvestorChange, onInvestorCountChange, onReset, onAnalyze, totalParticipation, result }) => {
    
    const [projectionTab, setProjectionTab] = useState<'sale' | 'rent'>('sale');
    const totalParticipationRounded = parseFloat(totalParticipation.toFixed(2));
    const participationError = totalParticipationRounded !== 100;

    const TabButton: React.FC<{ label: string; icon: string; isActive: boolean; onClick: () => void }> = ({ label, icon, isActive, onClick }) => (
        <button
            type="button"
            onClick={onClick}
            className={`w-1/2 py-2 px-3 text-sm font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${isActive ? 'bg-white/20 text-white' : 'text-gray-200 hover:bg-white/10'}`}
            aria-pressed={isActive}
        >
            <i className={`fas ${icon}`}></i> {label}
        </button>
    );

    return (
        <div className="bg-black/20 backdrop-blur-xl p-4 sm:p-6 rounded-2xl shadow-lg border border-white/20 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white">Datos de la Operación</h2>
                <button 
                    onClick={onAnalyze} 
                    className="bg-blue-600/80 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105 duration-300 text-sm"
                    aria-label="Actualizar y calcular la rentabilidad"
                >
                    <i className="fas fa-sync-alt mr-2"></i> ACTUALIZAR
                </button>
            </div>
            <div className="space-y-4">
                
                <Section title="Compra del Inmueble" icon="fa-solid fa-file-signature" defaultOpen={true}>
                    <InputField id="propertyValue" label="Valor del Inmueble" icon="fa-solid fa-euro-sign" value={inputs.propertyValue} onChange={onInputChange} unit="€" />
                    <SelectField id="purchaseTaxType" label="Impuesto de Compra" icon="fa-solid fa-percent" value={inputs.purchaseTaxType} onChange={onInputChange} options={[
                        { value: 'itp_10', label: 'ITP (10%)' },
                        { value: 'itp_6', label: 'ITP Reducido <35 (6%)' },
                        { value: 'iva_21', label: 'IVA (21%)' }
                    ]}/>
                    <InputField id="notaryFees" label="Notaría" icon="fa-solid fa-gavel" value={inputs.notaryFees} onChange={onInputChange} unit="€" />
                    <InputField id="registryFees" label="Registro" icon="fa-solid fa-book" value={inputs.registryFees} onChange={onInputChange} unit="€" />
                    <InputField id="agencyFees" label="Gestoría" icon="fa-solid fa-briefcase" value={inputs.agencyFees} onChange={onInputChange} unit="€" />
                    <InputField id="realEstateAgencyFees" label="Honorarios Inmobiliaria" icon="fa-solid fa-handshake" value={inputs.realEstateAgencyFees} onChange={onInputChange} unit="€" />
                </Section>

                <Section title="Suministros" icon="fa-solid fa-lightbulb">
                    <p className="text-xs text-gray-300 -mt-2 mb-2">Coste estimado de alta: 250€ + 21% IVA por suministro.</p>
                    <CheckboxField id="setupElectricity" label="Alta Electricidad" checked={inputs.setupElectricity} onChange={onInputChange} />
                    <CheckboxField id="setupWater" label="Alta Agua" checked={inputs.setupWater} onChange={onInputChange} />
                </Section>

                <Section title="Reforma y Licencias" icon="fa-solid fa-person-digging">
                    <InputField id="areaSqm" label="Superficie" icon="fa-solid fa-ruler-combined" value={inputs.areaSqm} onChange={onInputChange} unit="m²"/>
                    <InputField id="renovationCostPerSqm" label="Coste Reforma/m²" icon="fa-solid fa-euro-sign" value={inputs.renovationCostPerSqm} onChange={onInputChange} unit="€/m²" />
                    <InputField id="furnitureCostPerSqm" label="Coste Mobiliario/m²" icon="fa-solid fa-couch" value={inputs.furnitureCostPerSqm} onChange={onInputChange} unit="€/m²"/>
                    <InputField id="contingencyRate" label="Desvíos" icon="fa-solid fa-percent" value={inputs.contingencyRate} onChange={onInputChange} unit="%"/>
                    <InputField id="generalExpenses" label="Gastos Generales" icon="fa-solid fa-file-invoice" value={inputs.generalExpenses} onChange={onInputChange} unit="€"/>
                    <InputField id="technicalFees" label="Honorarios Técnicos (+21% IVA)" icon="fa-solid fa-helmet-safety" value={inputs.technicalFees} onChange={onInputChange} unit="€"/>
                    <SelectField id="renovationVatType" label="IVA Reforma" icon="fa-solid fa-percent" value={inputs.renovationVatType} onChange={onInputChange} options={[ { value: '10', label: 'IVA (10%)' }, { value: '21', label: 'IVA (21%)' }, { value: 'none', label: 'Sin IVA' } ]}/>
                    <InputField id="icioRate" label="ICIO" icon="fa-solid fa-percent" value={inputs.icioRate} onChange={onInputChange} unit="%"/>
                </Section>

                <Section title="Inversores" icon="fa-solid fa-users">
                    <div>
                        <label htmlFor="investorCount" className="block text-sm font-medium text-gray-200 mb-1">Número de Inversores</label>
                        <select id="investorCount" value={inputs.investors.length} onChange={(e) => onInvestorCountChange(Number(e.target.value))} className="w-full py-2.5 bg-white/10 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400">
                            {[1, 2, 3, 4].map(n => <option key={n} value={n} className="bg-gray-800">{n}</option>)}
                        </select>
                    </div>
                    {inputs.investors.map((investor, index) => {
                        const capitalToProvide = result ? (investor.participation / 100) * result.totalCapitalProvided : 0;
                        return (
                            <div key={investor.id} className="p-3 sm:p-4 bg-black/10 rounded-lg mt-2 space-y-4 border border-white/10">
                                <h4 className="font-semibold text-white border-b border-white/10 pb-2">Inversor {index + 1}</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label htmlFor={`participation-${investor.id}`} className="block text-xs text-gray-300">Participación</label>
                                            {result && capitalToProvide > 0 && 
                                                <span className="text-xs text-blue-200 font-medium bg-blue-500/20 px-2 py-1 rounded">
                                                    {formatCurrency(capitalToProvide)}
                                                </span>
                                            }
                                        </div>
                                        <MinimalistInputField id={`participation-${investor.id}`} value={investor.participation} onChange={(e) => onInvestorChange(investor.id, 'participation', e.target.value)} unit="%"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-300 mb-1">Tipo</label>
                                        <select value={investor.type} onChange={(e) => onInvestorChange(investor.id, 'type', e.target.value)} className="w-full py-2 bg-transparent text-white border-b-2 border-white/20 focus:outline-none focus:border-blue-400 transition duration-200 appearance-none">
                                            <option value="individual" className="bg-gray-800">Persona Física</option>
                                            <option value="company" className="bg-gray-800">Sociedad</option>
                                        </select>
                                    </div>
                                </div>
                                <h5 className="font-medium text-gray-200 pt-3 text-sm border-t border-white/10 mt-4">Financiación Inversor {index + 1}</h5>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                                    <div>
                                        <label className="block text-xs text-gray-300 mb-1">% Financiación</label>
                                        <MinimalistInputField id={`financingPercentage-${investor.id}`} value={investor.financingPercentage} onChange={(e) => onInvestorChange(investor.id, 'financingPercentage', e.target.value)} unit="%"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-300 mb-1">TAE</label>
                                        <MinimalistInputField id={`loanInterestRate-${investor.id}`} value={investor.loanInterestRate} onChange={(e) => onInvestorChange(investor.id, 'loanInterestRate', e.target.value)} unit="%"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-300 mb-1">Costes Asoc.</label>
                                        <MinimalistInputField id={`associatedCostsRate-${investor.id}`} value={investor.associatedCostsRate} onChange={(e) => onInvestorChange(investor.id, 'associatedCostsRate', e.target.value)} unit="%"/>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {participationError && (
                        <div className="mt-2 p-3 bg-red-500/20 border border-red-500/30 text-red-200 text-sm rounded-lg" role="alert">
                            <i className="fas fa-exclamation-triangle mr-2"></i>
                            La suma de las participaciones debe ser 100%. Actualmente es <strong>{totalParticipationRounded}%</strong>.
                        </div>
                    )}
                </Section>
                
                <Section title="Proyecciones" icon="fa-solid fa-chart-line">
                    <div className="flex items-center bg-black/20 p-1 rounded-xl border border-white/20 mb-4">
                        <TabButton label="Venta" icon="fa-tag" isActive={projectionTab === 'sale'} onClick={() => setProjectionTab('sale')} />
                        <TabButton label="Alquiler" icon="fa-house-user" isActive={projectionTab === 'rent'} onClick={() => setProjectionTab('rent')} />
                    </div>

                    {projectionTab === 'sale' && (
                        <div className="space-y-4 animate-fade-in">
                            <InputField id="salePrice" label="Precio de Venta" icon="fa-solid fa-tag" value={inputs.salePrice} onChange={onInputChange} unit="€"/>
                            <InputField id="capitalGainsTaxRate" label="Plusvalía Municipal" icon="fa-solid fa-percent" value={inputs.capitalGainsTaxRate} onChange={onInputChange} unit="%"/>
                            <InputField id="ceeCost" label="Certificado Energético (CEE)" icon="fa-solid fa-leaf" value={inputs.ceeCost} onChange={onInputChange} unit="€"/>
                            <InputField id="notarySaleCost" label="Notaría Venta" icon="fa-solid fa-gavel" value={inputs.notarySaleCost} onChange={onInputChange} unit="€"/>
                        </div>
                    )}
                    
                    {projectionTab === 'rent' && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="flex items-center bg-black/20 p-1 rounded-xl border border-white/20">
                                <TabButton label="Tradicional" icon="fa-door-open" isActive={inputs.rentalType === 'traditional'} onClick={() => onInputChange({ target: { name: 'rentalType', value: 'traditional', type: 'select' } as any })} />
                                <TabButton label="Por Habitaciones" icon="fa-bed" isActive={inputs.rentalType === 'rooms'} onClick={() => onInputChange({ target: { name: 'rentalType', value: 'rooms', type: 'select' } as any })} />
                            </div>
                            {inputs.rentalType === 'traditional' ? (
                                <InputField id="monthlyRent" label="Alquiler Mensual" icon="fa-solid fa-calendar-days" value={inputs.monthlyRent} onChange={onInputChange} unit="€"/>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField id="numberOfRooms" label="Nº Habitaciones" icon="fa-solid fa-hashtag" value={inputs.numberOfRooms} onChange={onInputChange} unit="hab." step="1"/>
                                    <InputField id="rentPerRoom" label="Alquiler/hab." icon="fa-solid fa-euro-sign" value={inputs.rentPerRoom} onChange={onInputChange} unit="€/mes"/>
                                </div>
                            )}
                            <hr className="border-white/10"/>
                            <h4 className="text-md font-semibold text-white pt-2">Gastos Anuales Alquiler</h4>
                            <InputField id="ibiFee" label="IBI Anual" icon="fa-solid fa-file-invoice-dollar" value={inputs.ibiFee} onChange={onInputChange} unit="€"/>
                            <InputField id="insuranceFee" label="Seguro Anual" icon="fa-solid fa-shield-halved" value={inputs.insuranceFee} onChange={onInputChange} unit="€"/>
                            <CheckboxField id="includeManagementFee" label="Añadir gastos de gestión (1 mensualidad)" checked={inputs.includeManagementFee} onChange={onInputChange} />
                            <CheckboxField id="includeCleaningFee" label="Añadir gastos de limpieza (30€/mes + IVA)" checked={inputs.includeCleaningFee} onChange={onInputChange} />
                        </div>
                    )}
                </Section>
            </div>
        </div>
    );
};

export default DealForm;