import React, { useState, useCallback, useEffect } from 'react';
import { RealEstateDealInput, CalculationResult, Investor } from './types';
import { analyzeRealEstateDeal } from './services/calculatorService';
import DealForm from './components/CalculatorForm';
import ReportDisplay from './components/ResultsDisplay';
import DetailedReport from './components/DetailedReport';

const initialInvestors: Investor[] = [{ 
    id: 1, 
    participation: 100, 
    type: 'individual',
    financingPercentage: 80,
    loanInterestRate: 3,
    associatedCostsRate: 1.5
}];

const initialInputs: RealEstateDealInput = {
    propertyValue: 110000,
    purchaseTaxType: 'itp_10',
    notaryFees: 600,
    registryFees: 450,
    agencyFees: 300,
    realEstateAgencyFees: 0,
    setupElectricity: false,
    setupWater: false,
    areaSqm: 70,
    renovationCostPerSqm: 500,
    furnitureCostPerSqm: 40,
    contingencyRate: 5,
    generalExpenses: 0,
    technicalFees: 0,
    renovationVatType: '10',
    icioRate: 5,
    salePrice: 195000,
    capitalGainsTaxRate: 2,
    ceeCost: 250,
    notarySaleCost: 500,
    monthlyRent: 700,
    ibiFee: 150,
    insuranceFee: 150,
    cleaningFee: 20,
    investors: initialInvestors,
};

const App: React.FC = () => {
    const [inputs, setInputs] = useState<RealEstateDealInput>(initialInputs);
    const [result, setResult] = useState<CalculationResult | null>(null);
    const [reportView, setReportView] = useState<'summary' | 'details'>('summary');

    useEffect(() => {
        const calculatedResult = analyzeRealEstateDeal(inputs);
        setResult(calculatedResult);
    }, [inputs]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setInputs(prev => ({ ...prev, [name]: checked }));
        } else {
            setInputs(prev => ({ 
                ...prev, 
                [name]: (type === 'number' && value !== '') ? parseFloat(value) : value 
            }));
        }
    }, []);
    
    const handleInvestorChange = useCallback((id: number, field: keyof Omit<Investor, 'id'>, value: string | number) => {
        setInputs(prev => ({
            ...prev,
            investors: prev.investors.map(inv => {
                if (inv.id === id) {
                    if (field === 'participation') {
                        const numericValue = Number(value);
                        return { ...inv, [field]: isNaN(numericValue) || numericValue < 0 ? 0 : numericValue };
                    }
                    return { ...inv, [field]: value };
                }
                return inv;
            })
        }));
    }, []);
    
    const handleInvestorCountChange = useCallback((count: number) => {
        setInputs(prev => {
            const currentInvestors = prev.investors;
            const newInvestors: Investor[] = [];
            const participation = parseFloat((100 / count).toFixed(2));

            for (let i = 0; i < count; i++) {
                if (currentInvestors[i]) {
                    newInvestors.push({ ...currentInvestors[i], participation: participation });
                } else {
                    newInvestors.push({ 
                        id: Date.now() + i, 
                        participation: participation, 
                        type: 'individual',
                        financingPercentage: 80,
                        loanInterestRate: 3,
                        associatedCostsRate: 1.5
                    });
                }
            }
            
            const totalParticipation = newInvestors.reduce((sum, inv) => sum + inv.participation, 0);
            if (newInvestors.length > 0) {
                 const diff = 100 - totalParticipation;
                 newInvestors[newInvestors.length - 1].participation += diff;
                 newInvestors[newInvestors.length - 1].participation = parseFloat(newInvestors[newInvestors.length-1].participation.toFixed(2));
            }

            return { ...prev, investors: newInvestors };
        });
    }, []);
    
    const handleReset = useCallback(() => {
        setInputs(initialInputs);
    }, []);

    const totalParticipation = inputs.investors.reduce((sum, inv) => sum + inv.participation, 0);

    return (
        <div className="min-h-screen p-2 sm:p-4 md:p-8">
            <main className="max-w-screen-2xl mx-auto">
                <header className="text-center mb-6 sm:mb-10">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 tracking-tight">
                        AO HOME
                    </h1>
                    <p className="mt-2 text-base sm:text-lg text-gray-600">
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
                            totalParticipation={totalParticipation}
                        />
                    </div>
                    <div className="lg:col-span-3">
                        {result ? (
                            <div className="space-y-4">
                                <div className="flex items-center bg-gray-200/80 p-1 rounded-xl">
                                    <button 
                                        onClick={() => setReportView('summary')}
                                        className={`w-1/2 py-2 px-4 text-sm font-bold rounded-lg transition-all duration-300 ${reportView === 'summary' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-600'}`}>
                                        <i className="fas fa-chart-pie mr-2"></i>Resumen de Rentabilidad
                                    </button>
                                    <button 
                                        onClick={() => setReportView('details')}
                                        className={`w-1/2 py-2 px-4 text-sm font-bold rounded-lg transition-all duration-300 ${reportView === 'details' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-600'}`}>
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
                           <div className="h-full flex items-center justify-center p-8 bg-white border border-gray-200/80 rounded-2xl shadow-sm">
                               <div className="text-center text-gray-500">
                                   <i className="fas fa-house-flag text-6xl text-gray-300 mb-4"></i>
                                   <h2 className="text-2xl font-semibold text-gray-700">Esperando análisis</h2>
                                   <p className="mt-2 text-gray-500">Completa los datos y haz clic en "Analizar Operación".</p>
                               </div>
                           </div>
                        )}
                    </div>
                </div>
                <footer className="text-center mt-12 text-gray-500 text-sm">
                    <p>Creado con <i className="fas fa-heart text-red-400"></i>. Una herramienta para inversores.</p>
                    <p>Esta es una herramienta de estimación y no constituye asesoramiento financiero o fiscal.</p>
                </footer>
            </main>
        </div>
    );
};

export default App;