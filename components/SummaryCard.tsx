import React from 'react';

interface SummaryCardProps {
    title: string;
    value: number;
    icon: string;
    color: string;
    isCurrency?: boolean;
}

const formatValue = (value: number, isCurrency: boolean) => {
    if (isCurrency) {
        return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    }
    return `${value.toFixed(2)}%`;
};

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, color, isCurrency = false }) => {
    return (
        <div className="bg-gray-100 p-5 rounded-xl flex items-center space-x-4">
            <div className={`text-3xl ${color}`}>
                <i className={`${icon}`}></i>
            </div>
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-800">
                    {formatValue(value, isCurrency)}
                </p>
            </div>
        </div>
    );
};

export default SummaryCard;