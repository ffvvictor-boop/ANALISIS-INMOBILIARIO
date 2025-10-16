
import { Type } from "@google/genai";

export interface Investor {
    id: number;
    participation: number;
    type: 'individual' | 'company';
    financingPercentage: number;
    loanInterestRate: number;
    associatedCostsRate: number;
}

export interface RealEstateDealInput {
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

// FIX: Add missing IdealistaData interface to resolve import error.
export interface IdealistaData {
    averagePricePerSqm: number;
    idealistaMapUrl: string;
}
