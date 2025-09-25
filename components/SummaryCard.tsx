import React from 'react';

interface SummaryCardProps {
    title: string;
    value: string;
    icon: string;
    colorClass?: string;
    iconColorClass?: string;
    subValue?: string;
    subTitle?: string;
    highlight?: 'green' | 'red';
    subTitleTooltip?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, colorClass, iconColorClass, subValue, subTitle, highlight, subTitleTooltip }) => {
    
    let containerClasses = "bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/10 flex items-start space-x-4 h-full transition-all duration-300";
    let currentIconColorClass = iconColorClass || "text-blue-300";
    let currentColorClass = colorClass || "bg-blue-500/20";
    
    if (highlight === 'green') {
        containerClasses = "bg-green-600/50 backdrop-blur-sm p-4 rounded-lg border border-green-400/30 flex items-start space-x-4 h-full transition-all duration-300";
        currentIconColorClass = "text-green-100";
        currentColorClass = "bg-green-500/50";
    } else if (highlight === 'red') {
        containerClasses = "bg-red-600/50 backdrop-blur-sm p-4 rounded-lg border border-red-400/30 flex items-start space-x-4 h-full transition-all duration-300";
        currentIconColorClass = "text-red-100";
        currentColorClass = "bg-red-500/50";
    }

    return (
        <div className={containerClasses}>
            <div className={`text-2xl p-3 rounded-lg ${currentColorClass} ${currentIconColorClass}`}>
                <i className={`fas ${icon}`}></i>
            </div>
            <div>
                <p className="text-sm text-gray-200">{title}</p>
                <p className={`text-2xl font-bold ${highlight ? 'text-white' : 'text-white'}`}>{value}</p>
                {subTitle && subValue && (
                    <div className="flex items-center gap-1.5 mt-1">
                        <p className={`text-xs ${highlight ? 'text-gray-100' : 'text-gray-300'}`}>
                            {subTitle}: <span className="font-semibold">{subValue}</span>
                        </p>
                        {subTitleTooltip && (
                            <div className="relative group flex items-center">
                                <i className="fas fa-info-circle text-gray-400 cursor-pointer text-xs"></i>
                                <div className="absolute bottom-full mb-2 w-48 bg-gray-800 text-white text-xs rounded-lg py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 shadow-lg border border-white/10 left-1/2 -translate-x-1/2">
                                    {subTitleTooltip}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SummaryCard;