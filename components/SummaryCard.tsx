import React from 'react';

interface SummaryCardProps {
    title: string;
    value: number;
    icon: string;
    color: string;
    isCurrency?: boolean;
    highlight?: 'green' | 'red';
}

const formatValue = (value: number, isCurrency: boolean) => {
    if (isCurrency) {
        return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    }
    return `${value.toFixed(2)}%`;
};

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, color, isCurrency = false, highlight }) => {
    let backgroundClasses = 'bg-gray-100';
    let titleClasses = 'text-gray-500';
    let valueClasses = 'text-gray-800';

    if (highlight === 'green') {
        backgroundClasses = 'bg-green-200';
        titleClasses = 'text-green-900/80';
        valueClasses = 'text-green-900';
    } else if (highlight === 'red') {
        backgroundClasses = 'bg-red-200';
        titleClasses = 'text-red-900/80';
        valueClasses = 'text-red-900';
    }

    return (
        <div className={`p-4 sm:p-5 rounded-xl flex items-center space-x-3 sm:space-x-4 ${backgroundClasses} transition-all duration-300`}>
            <div className={`text-2xl sm:text-3xl ${color}`}>
                <i className={`${icon}`}></i>
            </div>
            <div>
                <p className={`text-xs sm:text-sm font-medium ${titleClasses}`}>{title}</p>
                <p className={`text-xl sm:text-2xl font-bold ${valueClasses}`}>
                    {formatValue(value, isCurrency)}
                </p>
            </div>
        </div>
    );
};

export default SummaryCard;