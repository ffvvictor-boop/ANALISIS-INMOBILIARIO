import React, { useState, useCallback, useEffect } from 'react';
import { RealEstateDealInput, CalculationResult, Investor, IdealistaData, IdealistaDataSchema } from '../types';
import { analyzeRealEstateDeal } from '../services/calculatorService';
import { GoogleGenAI } from "@google/genai";

const initialInvestors: Investor[] = [{ 
    id: 1, 
    participation: 100, 
    type: 'individual',
    financingPercentage: 80,
    loanInterestRate: 3,
    associatedCostsRate: 1.5
}];

const initialInputs: RealEstateDealInput = {
    propertyAddress: '',
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
    const [idealistaData, setIdealistaData] = useState<IdealistaData | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);

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

    const handleIdealistaSearch = useCallback(async () => {
        if (!inputs.propertyAddress) return;
        
        setIsSearching(true);
        setSearchError(null);
        setIdealistaData(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Basado en los datos más recientes de Idealista.com para la dirección '${inputs.propertyAddress}', proporciona el precio medio por metro cuadrado en esa zona específica. Además, encuentra entre 3 y 5 anuncios de venta de inmuebles similares (pisos o casas) cerca de esa dirección. Para cada anuncio, facilita una breve descripción, el precio, la superficie en m² y la URL directa al anuncio en Idealista. Devuelve la respuesta como un objeto JSON estructurado.`;
            
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: IdealistaDataSchema,
                },
            });

            const data = JSON.parse(response.text);
            setIdealistaData(data);

        } catch (error) {
            console.error("Error al buscar datos en Idealista:", error);
            setSearchError("No se pudieron obtener los datos. Por favor, intenta de nuevo o modifica la dirección.");
        } finally {
            setIsSearching(false);
        }

    }, [inputs.propertyAddress]);
    
    const handleReset = useCallback(() => {
        setInputs(initialInputs);
        setResult(null);
        setIdealistaData(null);
        setSearchError(null);
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
        totalParticipation,
        handleIdealistaSearch,
        idealistaData,
        isSearching,
        searchError
    };
};