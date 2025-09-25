import { Type } from "@google/genai";

export interface Investor {
    id: number;
    participation: number;
    type: 'individual' | 'company';
    financingPercentage: number;
    loanInterestRate: number;
    associatedCostsRate: number;
}

export interface IdealistaListing {
    description: string;
    price: number;
    surface: number;
    url: string;
}

export interface IdealistaData {
    averagePricePerSqm: number;
    similarListings: IdealistaListing[];
}

export const IdealistaDataSchema = {
    type: Type.OBJECT,
    properties: {
        averagePricePerSqm: {
            type: Type.NUMBER,
            description: "El precio medio por metro cuadrado en la zona de la dirección proporcionada.",
        },
        similarListings: {
            type: Type.ARRAY,
            description: "Una lista de 3 a 5 anuncios de inmuebles similares encontrados cerca de la dirección.",
            items: {
                type: Type.OBJECT,
                properties: {
                    description: {
                        type: Type.STRING,
                        description: "Una breve descripción del inmueble, como 'Piso en Calle de la Luna' o 'Chalet en venta'."
                    },
                    price: {
                        type: Type.NUMBER,
                        description: "El precio de venta del inmueble en euros."
                    },
                    surface: {
                        type: Type.NUMBER,
                        description: "La superficie del inmueble en metros cuadrados."
                    },
                    url: {
                        type: Type.STRING,
                        description: "El enlace directo (URL) a la página del anuncio en Idealista."
                    }
                },
                required: ["description", "price", "surface", "url"]
            }
        }
    },
    required: ["averagePricePerSqm", "similarListings"]
};

export interface RealEstateDealInput {
    propertyAddress: string;
    propertyValue: number;
    purchaseTaxType: string;
    notaryFees: number;
    registryFees: number;
    agencyFees: number;
    realEstateAgencyFees: number;
    setupElectricity: boolean;
    setupWater: boolean;
    areaSqm: number;
    renovationCostPerSqm: number;
    furnitureCostPerSqm: number;
    contingencyRate: number;
    generalExpenses: number;
    technicalFees: number;
    renovationVatType: string;
    icioRate: number;
    salePrice: number;
    capitalGainsTaxRate: number;
    ceeCost: number;
    notarySaleCost: number;
    monthlyRent: number;
    ibiFee: number;
    insuranceFee: number;
    investors: Investor[];
    // New rental fields
    rentalType: 'traditional' | 'rooms';
    numberOfRooms: number;
    rentPerRoom: number;
    includeManagementFee: boolean;
    includeCleaningFee: boolean;
}

export interface InvestorBreakdown {
    id: number;
    participation: number;
    type: 'individual' | 'company';
    capitalProvided: number;
    grossProfit: number;
    taxAmount: number;
    netProfit: number;
    loanAmount: number;
    loanAssociatedCosts: number;
}

export interface CalculationDetails {
    // Purchase Costs
    propertyValue: number;
    purchaseTax: number;
    notaryFees: number;
    registryFees: number;
    agencyFees: number;
    realEstateAgencyFees: number;
    
    // Renovation & Other Costs
    renovationBaseCost: number;
    renovationVat: number;
    furnitureBaseCost: number;
    furnitureVat: number;
    contingencyAmount: number;
    generalExpenses: number;
    technicalFeesBase: number;
    technicalFeesVat: number;
    icioTax: number;
    supplySetupCost: number;
    
    // Sale Costs
    capitalGainsTax: number;
    ceeCost: number;
    notarySaleCost: number;
    
    // Rental
    grossAnnualRent: number;
    annualExpenses: number;
    netAnnualRent: number;
    grossRentalYield: number;
    netRentalYield: number;
}

export interface RentalAnalysis {
    grossAnnualRent: number;
    annualExpenses: number;
    netAnnualRent: number;
    grossRentalYield: number;
    netRentalYield: number;
}

export interface CalculationResult {
    totalProjectCost: number;
    saleProfitability: number; // on cost
    saleProfitBeforeTax: number;
    netProfitAfterTax: number;
    
    totalPurchaseCost: number;
    totalRenovationCost: number; // and other costs
    totalLicensesCost: number; // part of renovation cost
    totalOtherCosts: number; // part of renovation cost
    
    loanAmount: number;
    loanAssociatedCosts: number;
    totalCapitalProvided: number;
    
    investorBreakdown: InvestorBreakdown[];
    details: CalculationDetails;

    // For summary card (based on selection)
    grossRentalYield: number;
    netRentalYield: number;
    
    // For detailed report
    rentalAnalysis: {
        traditional: RentalAnalysis;
        byRooms: RentalAnalysis;
    };
}