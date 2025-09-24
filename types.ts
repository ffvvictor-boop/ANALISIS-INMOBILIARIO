export interface Investor {
    id: number;
    participation: number; // Porcentaje
    type: 'individual' | 'company'; // Persona Física o Sociedad
    financingPercentage: number;
    loanInterestRate: number; // TAE (%)
    associatedCostsRate: number;
}

export interface RealEstateDealInput {
    // Compra
    propertyValue: number;
    purchaseTaxType: 'itp_10' | 'itp_6' | 'iva_21';
    notaryFees: number;
    registryFees: number;
    agencyFees: number; // Gestoría
    realEstateAgencyFees: number;
    setupElectricity: boolean;
    setupWater: boolean;

    // Reforma y Licencias
    areaSqm: number;
    renovationCostPerSqm: number;
    furnitureCostPerSqm: number;
    contingencyRate: number; // Desvíos (%)
    generalExpenses: number; // Gastos Generales (valor absoluto)
    technicalFees: number; // Honorarios Técnicos
    renovationVatType: '10' | '21';
    icioRate: number; // ICIO (%)

    // Venta
    salePrice: number;
    capitalGainsTaxRate: number; // Plusvalía (%)
    ceeCost: number;
    notarySaleCost: number;

    // Alquiler
    monthlyRent: number;
    ibiFee: number;
    insuranceFee: number;
    cleaningFee: number;

    // Inversores
    investors: Investor[];
}

export interface InvestorResult {
    id: number;
    participation: number;
    type: 'individual' | 'company';
    grossProfit: number;
    taxAmount: number;
    netProfit: number;
    capitalProvided: number;
    loanAmount: number;
}

export interface CalculationResult {
    // Compra
    totalPurchaseNet: number;
    totalPurchaseTaxes: number;
    totalPurchaseCost: number;
    
    // Reforma, Suministros y Técnicos
    totalRenovationNet: number;
    totalRenovationTaxes: number;
    totalRenovationCost: number;
    
    // Licencias y otros
    totalLicensesCost: number;
    totalOtherCosts: number;

    // Coste Total
    totalProjectCost: number;

    // Venta
    saleNetIncome: number;
    saleExpenses: number;
    saleProfitBeforeTax: number;
    saleProfitability: number;

    // Alquiler
    annualRentalIncome: number;
    annualRentalExpenses: number;

    // Financiación (agregado)
    loanAmount: number;
    loanAssociatedCosts: number;
    totalCapitalProvided: number;

    // Reparto por inversor
    investorBreakdown: InvestorResult[];
}