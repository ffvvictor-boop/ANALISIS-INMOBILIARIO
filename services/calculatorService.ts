import { RealEstateDealInput, CalculationResult, InvestorResult } from '../types';

/**
 * Calcula el impuesto IRPF de forma progresiva según los tramos españoles.
 * @param profit El beneficio bruto sobre el que se calcula el impuesto.
 * @returns El importe total del impuesto a pagar.
 */
const calculateIrpf = (profit: number): number => {
    if (profit <= 0) return 0;

    const brackets = [
        { limit: 300000, rate: 0.47 },
        { limit: 60000, rate: 0.45 },
        { limit: 35200, rate: 0.37 },
        { limit: 20200, rate: 0.30 },
        { limit: 12450, rate: 0.24 },
        { limit: 0, rate: 0.19 },
    ];

    let tax = 0;
    let remainingProfit = profit;

    for (const bracket of brackets) {
        if (remainingProfit > bracket.limit) {
            tax += (remainingProfit - bracket.limit) * bracket.rate;
            remainingProfit = bracket.limit;
        }
    }

    return tax;
};


export const analyzeRealEstateDeal = (inputs: RealEstateDealInput): CalculationResult => {
    // --- 1. CÁLCULO DE COSTES DE COMPRA ---
    let purchaseTax = 0;
    switch (inputs.purchaseTaxType) {
        case 'itp_10':
            purchaseTax = inputs.propertyValue * 0.10;
            break;
        case 'itp_6':
            purchaseTax = inputs.propertyValue * 0.06;
            break;
        case 'iva_21':
            purchaseTax = inputs.propertyValue * 0.21;
            break;
    }

    // Se añade el 21% de IVA a los costes de gestoría y honorarios de inmobiliaria, ya que los inputs son netos.
    const agencyFeesVat = inputs.agencyFees * 0.21;
    const realEstateAgencyFeesVat = inputs.realEstateAgencyFees * 0.21;

    const totalPurchaseNet = inputs.propertyValue + inputs.notaryFees + inputs.registryFees + inputs.agencyFees + inputs.realEstateAgencyFees;
    const totalPurchaseTaxes = purchaseTax + agencyFeesVat + realEstateAgencyFeesVat;
    const totalPurchaseCost = totalPurchaseNet + totalPurchaseTaxes;

    // --- 2. CÁLCULO DE COSTES DE REFORMA, TÉCNICOS Y SUMINISTROS ---
    const renovationBaseCost = inputs.renovationCostPerSqm * inputs.areaSqm;
    const furnitureBaseCost = inputs.furnitureCostPerSqm * inputs.areaSqm;
    const renovationAndFurnitureCost = renovationBaseCost + furnitureBaseCost;
    
    const contingencyAmount = renovationAndFurnitureCost * (inputs.contingencyRate / 100);
    const renovationNetBeforeVat = renovationAndFurnitureCost + contingencyAmount + inputs.generalExpenses;

    const renovationVatRate = inputs.renovationVatType === '10' ? 0.10 : 0.21;
    const renovationVat = renovationNetBeforeVat * renovationVatRate;
    
    const technicalFeesVat = inputs.technicalFees * 0.21;
    
    const utilitiesNet = (inputs.setupElectricity ? 250 : 0) + (inputs.setupWater ? 250 : 0);
    const utilitiesVat = utilitiesNet * 0.21;

    const totalRenovationNet = renovationNetBeforeVat + inputs.technicalFees + utilitiesNet;
    const totalRenovationTaxes = renovationVat + technicalFeesVat + utilitiesVat;
    const totalRenovationCost = totalRenovationNet + totalRenovationTaxes;
    
    // --- 3. CÁLCULO DE LICENCIAS Y OTROS ---
    const icioCost = renovationBaseCost * (inputs.icioRate / 100);
    const totalLicensesCost = icioCost;
    const totalOtherCosts = inputs.ibiFee + inputs.insuranceFee;
    
    // --- 4. COSTE TOTAL DEL PROYECTO ---
    const totalProjectCost = totalPurchaseCost + totalRenovationCost + totalLicensesCost + totalOtherCosts;
    
    // --- 5. ANÁLISIS DE VENTA ---
    const saleNetIncome = inputs.salePrice;
    const capitalGainsTax = inputs.salePrice * (inputs.capitalGainsTaxRate / 100);
    const saleExpenses = capitalGainsTax + inputs.ceeCost + inputs.notarySaleCost;
    const saleProfitBeforeTax = saleNetIncome - totalProjectCost - saleExpenses;
    const saleProfitability = totalProjectCost > 0 ? (saleProfitBeforeTax / totalProjectCost) * 100 : 0;
    
    // --- 6. ANÁLISIS DE ALQUILER ---
    const annualRentalIncome = inputs.monthlyRent * 12;
    const annualRentalExpenses = inputs.ibiFee + inputs.insuranceFee + (inputs.cleaningFee * 12);

    // --- 7. ANÁLISIS DE FINANCIACIÓN Y CAPITAL APORTADO (POR INVERSOR) ---
    let totalLoanAmount = 0;
    let totalLoanAssociatedCosts = 0;
    let totalCapitalProvided = 0;
    const CORPORATE_TAX_RATE = 0.25; // 25%

    const investorBreakdown: InvestorResult[] = inputs.investors.map(investor => {
        const investorShareOfCost = totalProjectCost * (investor.participation / 100);
        
        const loanAmount = investorShareOfCost * (investor.financingPercentage / 100);
        const loanAssociatedCosts = loanAmount * (investor.associatedCostsRate / 100);
        
        const unfinancedCapital = investorShareOfCost - loanAmount;
        const capitalProvided = unfinancedCapital + loanAssociatedCosts;

        totalLoanAmount += loanAmount;
        totalLoanAssociatedCosts += loanAssociatedCosts;
        totalCapitalProvided += capitalProvided;

        const grossProfit = saleProfitBeforeTax * (investor.participation / 100);
        
        const taxAmount = investor.type === 'individual' 
            ? calculateIrpf(grossProfit) 
            : (grossProfit > 0 ? grossProfit * CORPORATE_TAX_RATE : 0);
            
        const netProfit = grossProfit - taxAmount;

        return {
            id: investor.id,
            participation: investor.participation,
            type: investor.type,
            grossProfit,
            taxAmount,
            netProfit,
            capitalProvided,
            loanAmount
        };
    });


    return {
        totalPurchaseNet,
        totalPurchaseTaxes,
        totalPurchaseCost,
        totalRenovationNet,
        totalRenovationTaxes,
        totalRenovationCost,
        totalLicensesCost,
        totalOtherCosts,
        totalProjectCost,
        saleNetIncome,
        saleExpenses,
        saleProfitBeforeTax,
        saleProfitability,
        annualRentalIncome,
        annualRentalExpenses,
        loanAmount: totalLoanAmount,
        loanAssociatedCosts: totalLoanAssociatedCosts,
        totalCapitalProvided: totalCapitalProvided,
        investorBreakdown,
    };
};