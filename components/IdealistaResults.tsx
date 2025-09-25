import React from 'react';
import { IdealistaData } from '../types';

interface IdealistaResultsProps {
    data: IdealistaData | null;
    isLoading: boolean;
    error: string | null;
}

const formatCurrency = (value: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);

const IdealistaResults: React.FC<IdealistaResultsProps> = ({ data, isLoading, error }) => {
    
    if (isLoading) {
        return (
            <div className="bg-black/20 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/20 text-center text-gray-200">
                <i className="fas fa-spinner fa-spin text-4xl text-teal-300 mb-3"></i>
                <p className="font-semibold text-white">Consultando datos de mercado...</p>
                <p className="text-sm">Esto puede tardar unos segundos.</p>
            </div>
        );
    }
    
    if (error) {
         return (
            <div className="bg-red-500/20 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-red-500/30 text-center text-red-200">
                <i className="fas fa-exclamation-triangle text-4xl mb-3"></i>
                <p className="font-semibold text-white">Error en la Búsqueda</p>
                <p className="text-sm">{error}</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="bg-black/20 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/20 text-center text-gray-300">
                <i className="fas fa-search-dollar text-4xl mb-3"></i>
                <p className="font-semibold text-white">Análisis de Mercado</p>
                <p className="text-sm">Introduce una dirección y busca para ver datos de Idealista.</p>
            </div>
        );
    }

    return (
        <div className="bg-black/20 backdrop-blur-xl p-4 sm:p-6 rounded-2xl shadow-lg border border-white/20 space-y-4">
            <h3 className="text-xl font-bold text-white"><i className="fas fa-chart-area mr-2 text-teal-300"></i>Análisis de Mercado (Idealista)</h3>
            
            <div className="bg-teal-500/20 border border-teal-400/30 rounded-lg p-4 text-center">
                <p className="text-sm text-teal-100">Precio Medio en la Zona</p>
                <p className="text-3xl font-bold text-white">{formatCurrency(data.averagePricePerSqm)}/m²</p>
            </div>
            
            <div>
                <h4 className="font-semibold text-gray-100 mb-2">Testigos de Venta Similares</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {data.similarListings.map((listing, index) => (
                        <a 
                            href={listing.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            key={index} 
                            className="block bg-white/5 hover:bg-white/10 p-3 rounded-lg border border-white/10 transition-all duration-300"
                        >
                            <div className="flex justify-between items-start">
                                <p className="text-sm text-gray-200 flex-1 pr-4">{listing.description}</p>
                                <div className="text-right flex-shrink-0">
                                    <p className="font-bold text-white">{formatCurrency(listing.price)}</p>
                                    <p className="text-xs text-gray-300">{listing.surface} m²</p>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default IdealistaResults;
