import React, { useState } from 'react';
import DealForm from './components/CalculatorForm';
import ReportDisplay from './components/ResultsDisplay';
import DetailedReport from './components/DetailedReport';
import { useDealCalculator } from './hooks/useDealCalculator';

const App: React.FC = () => {
    const [reportView, setReportView] = useState<'summary' | 'details'>('summary');

    const {
        inputs,
        result,
        handleInputChange,
        handleInvestorChange,
        handleInvestorCountChange,
        handleReset,
        handleAnalyze,
        totalParticipation
    } = useDealCalculator();


    return (
        <div className="min-h-screen p-2 sm:p-4 md:p-8">
            <main className="max-w-screen-2xl mx-auto">
                <header className="text-center mb-6 sm:mb-10">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                        AO HOME
                    </h1>
                    <p className="mt-2 text-base sm:text-lg text-gray-200">
                        Evalúa tus proyectos de inversión con todo detalle.
                    </p>
                </header>
                
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                    <div className="lg:col-span-2">
                        <DealForm 
                            inputs={inputs} 
                            onInputChange={handleInputChange}
                            onInvestorChange={handleInvestorChange}
                            onInvestorCountChange={handleInvestorCountChange}
                            onReset={handleReset}
                            onAnalyze={handleAnalyze}
                            totalParticipation={totalParticipation}
                            result={result}
                        />
                    </div>
                    <div className="lg:col-span-3">
                        {result ? (
                            <div className="space-y-4">
                                <div className="flex items-center bg-black/20 backdrop-blur-sm p-1 rounded-xl border border-white/20">
                                    <button 
                                        onClick={() => setReportView('summary')}
                                        className={`w-1/2 py-2 px-4 text-sm font-bold rounded-lg transition-all duration-300 ${reportView === 'summary' ? 'bg-white/20 text-white' : 'text-gray-200 hover:bg-white/10'}`}>
                                        <i className="fas fa-chart-pie mr-2"></i>Resumen de Rentabilidad
                                    </button>
                                    <button 
                                        onClick={() => setReportView('details')}
                                        className={`w-1/2 py-2 px-4 text-sm font-bold rounded-lg transition-all duration-300 ${reportView === 'details' ? 'bg-white/20 text-white' : 'text-gray-200 hover:bg-white/10'}`}>
                                        <i className="fas fa-list-check mr-2"></i>Informe Detallado
                                    </button>
                                </div>
                                {reportView === 'summary' ? (
                                    <ReportDisplay result={result} inputs={inputs} />
                                ) : (
                                    <DetailedReport result={result} inputs={inputs} />
                                )}
                            </div>
                        ) : (
                           <div className="h-full flex items-center justify-center p-8 bg-black/20 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg">
                               <div className="text-center text-gray-200">
                                   <i className="fas fa-house-flag text-6xl text-gray-300 mb-4"></i>
                                   <h2 className="text-2xl font-semibold text-white">Esperando análisis</h2>
                                   <p className="mt-2 text-gray-200">Completa los datos y haz clic en "Actualizar".</p>
                               </div>
                           </div>
                        )}
                    </div>
                </div>
                <footer className="text-center mt-12 text-gray-200 text-sm">
                    <p>Creado con <i className="fas fa-heart text-red-400"></i>. Una herramienta para inversores.</p>
                    <p>Esta es una herramienta de estimación y no constituye asesoramiento financiero o fiscal.</p>
                </footer>
            </main>
        </div>
    );
};

export default App;
