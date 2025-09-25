import React, { useState, useCallback, useEffect } from 'react';
import { RealEstateDealInput, CalculationResult, Investor } from '../types';
import { analyzeRealEstateDeal } from '../services/calculatorService';

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
    investors: initialInvestors,
    rentalType: 'traditional',
    numberOfRooms: 3,
    rentPerRoom: 350,
    includeManagementFee: false,
    includeCleaningFee: false,
};


export const useDealCalculator = () => {
    const [inputs, setInputs] = useState<RealEstateDealInput>(initialInputs);
    const [result, setResult] = useState<CalculationResult | null>(null);

    const handleAnalyze = useCallback(() => {
        const calculatedResult = analyzeRealEstateDeal(inputs);
        setResult(calculatedResult);
    }, [inputs]);

    // Recalcular automáticamente en cada cambio
    useEffect(() => {
        handleAnalyze();
    }, [handleAnalyze]);


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
        setResult(null);
    }, []);

    const totalParticipation = inputs.investors.reduce((sum, inv) => sum + inv.participation, 0);

    return {
        inputs,
        result,
        handleInputChange,
        handleInvestorChange,
        handleInvestorCountChange,
        handleReset,
        handleAnalyze,
        totalParticipation
    };
};
