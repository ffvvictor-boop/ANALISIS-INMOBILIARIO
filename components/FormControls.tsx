import React from 'react';

// Utility Functions
export const formatCurrency = (value: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);


// Form Control Components
interface InputFieldProps {
    id: string;
    label: string;
    icon: string;
    value: number | '';
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    step?: string;
    unit?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ id, label, icon, value, onChange, step = "0.01", unit = '' }) => (
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

export const SelectField: React.FC<SelectFieldProps> = ({ id, label, icon, value, onChange, options }) => (
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

export const CheckboxField: React.FC<CheckboxFieldProps> = ({ id, label, checked, onChange }) => (
    <div className="flex items-center">
        <input type="checkbox" id={id} name={id} checked={checked} onChange={onChange} className="h-4 w-4 rounded border-gray-500 text-blue-500 focus:ring-blue-400 bg-white/10" />
        <label htmlFor={id} className="ml-3 block text-sm text-gray-100">{label}</label>
    </div>
);


export const MinimalistInputField: React.FC<{id: string, value: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, unit: string}> = ({id, value, onChange, unit}) => (
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
);


export const TabButton: React.FC<{ label: string; icon: string; isActive: boolean; onClick: () => void }> = ({ label, icon, isActive, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={`w-1/2 py-2 px-3 text-sm font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${isActive ? 'bg-white/20 text-white' : 'text-gray-200 hover:bg-white/10'}`}
        aria-pressed={isActive}
    >
        <i className={`fas ${icon}`}></i> {label}
    </button>
);
