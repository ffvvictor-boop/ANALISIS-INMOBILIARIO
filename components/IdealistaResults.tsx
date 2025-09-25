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
            
            {data.idealistaMapUrl && (
                <a 
                    href={data.idealistaMapUrl}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block w-full text-center bg-blue-600/80 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
                >
                    <i className="fas fa-map-marked-alt mr-2"></i>
                    Ver mapa de precios en Idealista
                </a>
            )}
        </div>
    );
};

export default IdealistaResults;