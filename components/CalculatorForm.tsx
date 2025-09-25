import React, { useState } from 'react';
import { RealEstateDealInput, Investor } from '../types';

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
        <label htmlFor={id} className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <i className={`${icon} text-gray-400`}></i>
            </div>
            <input type="number" id={id} name={id} value={value} onChange={onChange} step={step} className="w-full pl-10 pr-12 py-2 bg-gray-50 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 placeholder-gray-400" placeholder="0"/>
            {unit && <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 text-sm">{unit}</span>}
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
        <label htmlFor={id} className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><i className={`${icon} text-gray-400`}></i></div>
            <select id={id} name={id} value={value} onChange={onChange} className="w-full pl-10 py-2.5 bg-gray-50 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 appearance-none">
                {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
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
        <input type="checkbox" id={id} name={id} checked={checked} onChange={onChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
        <label htmlFor={id} className="ml-3 block text-sm text-gray-700">{label}</label>
    </div>
);


const Section: React.FC<{ title: string; icon: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, icon, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <details open={isOpen} onToggle={(e) => setIsOpen((e.currentTarget as HTMLDetailsElement).open)} className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200/80">
            <summary className="cursor-pointer text-base sm:text-lg font-semibold text-gray-700 flex justify-between items-center">
                <span><i className={`${icon} mr-3 text-blue-500`}></i>{title}</span>
                <i className={`fas fa-chevron-down text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
            </summary>
            <div className="mt-4 space-y-4 border-t border-gray-200/80 pt-4">{children}</div>
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
            className="w-full py-2 bg-transparent text-gray-800 border-b-2 border-gray-200 focus:outline-none focus:border-blue-500 transition duration-200 placeholder-gray-400"
            placeholder="0"
        />
        <span className="absolute inset-y-0 right-0 flex items-center pr-1 text-gray-500 text-sm">{unit}</span>
    </div>
)


interface DealFormProps {
    inputs: RealEstateDealInput;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onInvestorChange: (id: number, field: keyof Omit<Investor, 'id'>, value: string | number) => void;
    onInvestorCountChange: (count: number) => void;
    onReset: () => void;
    totalParticipation: number;
}

const DealForm: React.FC<DealFormProps> = ({ inputs, onInputChange, onInvestorChange, onInvestorCountChange, onReset, totalParticipation }) => {
    
    const totalParticipationRounded = parseFloat(totalParticipation.toFixed(2));
    const participationError = totalParticipationRounded !== 100;

    return (
        <div className="bg-gray-100 p-4 sm:p-6 rounded-2xl shadow-lg max-h-[85vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Datos de la Operación</h2>
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
                    <p className="text-xs text-gray-500 -mt-2 mb-2">Coste estimado de alta: 250€ + 21% IVA por suministro.</p>
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
                        <label htmlFor="investorCount" className="block text-sm font-medium text-gray-600 mb-1">Número de Inversores</label>
                        <select id="investorCount" value={inputs.investors.length} onChange={(e) => onInvestorCountChange(Number(e.target.value))} className="w-full py-2.5 bg-gray-50 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </div>
                    {inputs.investors.map((investor, index) => (
                        <div key={investor.id} className="p-3 sm:p-4 bg-gray-50 rounded-lg mt-2 space-y-4 border border-gray-200">
                            <h4 className="font-semibold text-gray-800 border-b border-gray-200 pb-2">Inversor {index + 1}</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Participación</label>
                                    <MinimalistInputField id={`participation-${investor.id}`} value={investor.participation} onChange={(e) => onInvestorChange(investor.id, 'participation', e.target.value)} unit="%"/>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Tipo</label>
                                    <select value={investor.type} onChange={(e) => onInvestorChange(investor.id, 'type', e.target.value)} className="w-full py-2 bg-transparent text-gray-800 border-b-2 border-gray-200 focus:outline-none focus:border-blue-500 transition duration-200 appearance-none">
                                        <option value="individual">Persona Física</option>
                                        <option value="company">Sociedad</option>
                                    </select>
                                </div>
                            </div>
                             <h5 className="font-medium text-gray-700 pt-3 text-sm border-t border-gray-100 mt-4">Financiación Inversor {index + 1}</h5>
                             <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">% Financiación</label>
                                    <MinimalistInputField id={`financingPercentage-${investor.id}`} value={investor.financingPercentage} onChange={(e) => onInvestorChange(investor.id, 'financingPercentage', e.target.value)} unit="%"/>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">TAE</label>
                                    <MinimalistInputField id={`loanInterestRate-${investor.id}`} value={investor.loanInterestRate} onChange={(e) => onInvestorChange(investor.id, 'loanInterestRate', e.target.value)} unit="%"/>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Costes Asoc.</label>
                                    <MinimalistInputField id={`associatedCostsRate-${investor.id}`} value={investor.associatedCostsRate} onChange={(e) => onInvestorChange(investor.id, 'associatedCostsRate', e.target.value)} unit="%"/>
                                </div>
                             </div>
                        </div>
                    ))}
                    {participationError && (
                        <div className="mt-2 p-3 bg-red-100 border border-red-300 text-red-800 text-sm rounded-lg" role="alert">
                            <i className="fas fa-exclamation-triangle mr-2"></i>
                            La suma de las participaciones debe ser 100%. Actualmente es <strong>{totalParticipationRounded}%</strong>.
                        </div>
                    )}
                </Section>
                
                <Section title="Proyección Venta y Alquiler" icon="fa-solid fa-chart-line">
                    <InputField id="salePrice" label="Precio de Venta" icon="fa-solid fa-tag" value={inputs.salePrice} onChange={onInputChange} unit="€"/>
                    <InputField id="capitalGainsTaxRate" label="Plusvalía Municipal" icon="fa-solid fa-percent" value={inputs.capitalGainsTaxRate} onChange={onInputChange} unit="%"/>
                    <InputField id="ceeCost" label="Certificado Energético (CEE)" icon="fa-solid fa-leaf" value={inputs.ceeCost} onChange={onInputChange} unit="€"/>
                    <InputField id="notarySaleCost" label="Notaría Venta" icon="fa-solid fa-gavel" value={inputs.notarySaleCost} onChange={onInputChange} unit="€"/>
                    <hr className="border-gray-200 my-4"/>
                    <InputField id="monthlyRent" label="Alquiler Mensual" icon="fa-solid fa-calendar-days" value={inputs.monthlyRent} onChange={onInputChange} unit="€"/>
                    <InputField id="ibiFee" label="IBI Anual" icon="fa-solid fa-file-invoice-dollar" value={inputs.ibiFee} onChange={onInputChange} unit="€"/>
                    <InputField id="insuranceFee" label="Seguro Anual" icon="fa-solid fa-shield-halved" value={inputs.insuranceFee} onChange={onInputChange} unit="€"/>
                    <InputField id="cleaningFee" label="Limpieza Mensual" icon="fa-solid fa-broom" value={inputs.cleaningFee} onChange={onInputChange} unit="€"/>
                </Section>
            </div>
        </div>
    );
};

export default DealForm;