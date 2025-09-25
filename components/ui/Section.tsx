import React, { useState } from 'react';

interface SectionProps {
    title: string;
    icon: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    isPdf?: boolean; // For DetailedReport
}

const Section: React.FC<SectionProps> = ({ title, icon, children, defaultOpen = false, isPdf = false }) => {

    if (isPdf) { // Non-interactive version for PDF
        return (
            <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
                <h3 className='text-lg sm:text-xl font-bold text-gray-700 border-gray-200 mb-3 sm:mb-4 border-b pb-2'>
                    <i className={`${icon} mr-3 text-blue-500`}></i>{title}
                </h3>
                <div className="space-y-1">{children}</div>
            </div>
        );
    }

    // Interactive version for UI, uses local state for toggle
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
};

export default Section;
