import { RealEstateDealInput, CalculationResult, InvestorBreakdown, CalculationDetails, RentalAnalysis } from '../types';

const SUPPLY_SETUP_FEE = 250;
const VAT_RATE = 0.21;
const CLEANING_FEE_MONTHLY_VAT_INCLUDED = 30 * (1 + VAT_RATE);

const getPurchaseTaxRate = (type: string): number => {
    switch (type) {
        case 'itp_10': return 0.10;
        case 'itp_6': return 0.06;
        case 'iva_21': return 0.21;
        default: return 0.10;
    }
};

const getRenovationVatRate = (type: string): number => {
    switch (type) {
        case '10': return 0.10;
        case '21': return 0.21;
        case 'none': return 0;
        default: return 0.10;
    }
};

const calculateProfitTax = (profit: number, type: 'individual' | 'company'): number => {
    if (type === 'company') {
        return profit * 0.25; // Corporate tax (simplified)
    }
    // IRPF for individuals (simplified progressive scale)
    if (profit <= 6000) return profit * 0.19;
    if (profit <= 50000) return (6000 * 0.19) + ((profit - 6000) * 0.21);
    if (profit <= 200000) return (6000 * 0.19) + (44000 * 0.21) + ((profit - 50000) * 0.23);
    return (6000 * 0.19) + (44000 * 0.21) + (150000 * 0.23) + ((profit - 200000) * 0.26);
};

const calculateRentalScenario = (
    inputs: RealEstateDealInput, 
    totalProjectCost: number, 
    scenario: 'traditional' | 'rooms'
): RentalAnalysis => {
    const totalMonthlyRent = scenario === 'traditional'
        ? inputs.monthlyRent
        : (inputs.numberOfRooms * inputs.rentPerRoom);

    const managementFee = inputs.includeManagementFee ? totalMonthlyRent : 0;
    const cleaningAnnualFee = inputs.includeCleaningFee ? CLEANING_FEE_MONTHLY_VAT_INCLUDED * 12 : 0;
    const baseAnnualExpenses = inputs.ibiFee + inputs.insuranceFee;

    const grossAnnualRent = totalMonthlyRent * 12;
    const annualExpenses = baseAnnualExpenses + managementFee + cleaningAnnualFee;
    const netAnnualRent = grossAnnualRent - annualExpenses;
    
    const grossRentalYield = totalProjectCost > 0 ? (grossAnnualRent / totalProjectCost) * 100 : 0;
    const netRentalYield = totalProjectCost > 0 ? (netAnnualRent / totalProjectCost) * 100 : 0;

    return {
        grossAnnualRent,
        annualExpenses,
        netAnnualRent,
        grossRentalYield,
        netRentalYield
    };
};

export const analyzeRealEstateDeal = (inputs: RealEstateDealInput): CalculationResult => {
    // 1. Purchase Costs
    const purchaseTaxRate = getPurchaseTaxRate(inputs.purchaseTaxType);
    const purchaseTax = inputs.propertyValue * purchaseTaxRate;
    const totalPurchaseCost = inputs.propertyValue + purchaseTax + inputs.notaryFees + inputs.registryFees + inputs.agencyFees + inputs.realEstateAgencyFees;

    // 2. Renovation, Licenses & Other Costs
    const supplySetupCost = ((inputs.setupElectricity ? 1 : 0) + (inputs.setupWater ? 1 : 0)) * SUPPLY_SETUP_FEE * (1 + VAT_RATE);
    
    const renovationBaseCost = inputs.areaSqm * inputs.renovationCostPerSqm;
    const furnitureBaseCost = inputs.areaSqm * inputs.furnitureCostPerSqm;
    const renovationVatRate = getRenovationVatRate(inputs.renovationVatType);
    const renovationVat = (renovationBaseCost + furnitureBaseCost) * renovationVatRate;
    
    const contingencyAmount = (renovationBaseCost + furnitureBaseCost) * (inputs.contingencyRate / 100);
    
    const technicalFeesVat = inputs.technicalFees * VAT_RATE;
    const totalTechnicalFees = inputs.technicalFees + technicalFeesVat;

    const icioTax = renovationBaseCost * (inputs.icioRate / 100);

    const totalRenovationCost = renovationBaseCost + furnitureBaseCost + renovationVat + contingencyAmount + inputs.generalExpenses + totalTechnicalFees + icioTax + supplySetupCost;
    
    // 3. Total Project Cost
    const totalProjectCost = totalPurchaseCost + totalRenovationCost;
    
    // 4. Sale projection
    const capitalGainsTax = inputs.salePrice * (inputs.capitalGainsTaxRate / 100);
    const totalSaleExpenses = capitalGainsTax + inputs.ceeCost + inputs.notarySaleCost;
    const saleProfitBeforeTax = inputs.salePrice - totalProjectCost - totalSaleExpenses;

    const saleProfitability = totalProjectCost > 0 ? (saleProfitBeforeTax / totalProjectCost) * 100 : 0;

    // 5. Financing
    let totalLoanAmount = 0;
    let totalLoanAssociatedCosts = 0;

    inputs.investors.forEach(investor => {
        const loanAmountForInvestor = inputs.propertyValue * (investor.financingPercentage / 100) * (investor.participation / 100);
        totalLoanAmount += loanAmountForInvestor;
        totalLoanAssociatedCosts += loanAmountForInvestor * (investor.associatedCostsRate / 100);
    });
    
    const totalCapitalProvided = totalProjectCost - totalLoanAmount + totalLoanAssociatedCosts;

    // 6. Investor Breakdown
    const investorBreakdown: InvestorBreakdown[] = inputs.investors.map(investor => {
        const participationRatio = investor.participation / 100;
        const grossProfit = saleProfitBeforeTax * participationRatio;
        const taxAmount = calculateProfitTax(grossProfit, investor.type);
        const netProfit = grossProfit - taxAmount;

        const loanAmount = inputs.propertyValue * (investor.financingPercentage / 100) * participationRatio;
        const loanAssociatedCosts = loanAmount * (investor.associatedCostsRate / 100);
        const capitalProvided = (totalProjectCost * participationRatio) - loanAmount + loanAssociatedCosts;
        
        return {
            id: investor.id,
            participation: investor.participation,
            type: investor.type,
            grossProfit,
            taxAmount,
            netProfit,
            capitalProvided,
            loanAmount,
            loanAssociatedCosts
        };
    });

    const netProfitAfterTax = investorBreakdown.reduce((sum, inv) => sum + inv.netProfit, 0);

    // 7. Rental Yield Analysis
    const rentalAnalysisTraditional = calculateRentalScenario(inputs, totalProjectCost, 'traditional');
    const rentalAnalysisByRooms = calculateRentalScenario(inputs, totalProjectCost, 'rooms');
    const selectedRentalAnalysis = inputs.rentalType === 'traditional' ? rentalAnalysisTraditional : rentalAnalysisByRooms;

    const details: CalculationDetails = {
        propertyValue: inputs.propertyValue,
        purchaseTax,
        notaryFees: inputs.notaryFees,
        registryFees: inputs.registryFees,
        agencyFees: inputs.agencyFees,
        realEstateAgencyFees: inputs.realEstateAgencyFees,
        renovationBaseCost,
        renovationVat,
        furnitureBaseCost,
        furnitureVat: (furnitureBaseCost * renovationVatRate),
        contingencyAmount,
        generalExpenses: inputs.generalExpenses,
        technicalFeesBase: inputs.technicalFees,
        technicalFeesVat,
        icioTax,
        supplySetupCost,
        capitalGainsTax,
        ceeCost: inputs.ceeCost,
        notarySaleCost: inputs.notarySaleCost,
        grossAnnualRent: selectedRentalAnalysis.grossAnnualRent,
        annualExpenses: selectedRentalAnalysis.annualExpenses,
        netAnnualRent: selectedRentalAnalysis.netAnnualRent,
        grossRentalYield: selectedRentalAnalysis.grossRentalYield,
        netRentalYield: selectedRentalAnalysis.netRentalYield,
    };
    
    return {
        totalProjectCost,
        saleProfitability,
        saleProfitBeforeTax,
        netProfitAfterTax,
        totalPurchaseCost,
        totalRenovationCost,
        totalLicensesCost: icioTax,
        totalOtherCosts: supplySetupCost + inputs.generalExpenses + totalTechnicalFees,
        loanAmount: totalLoanAmount,
        loanAssociatedCosts: totalLoanAssociatedCosts,
        totalCapitalProvided,
        investorBreakdown,
        details,
        grossRentalYield: selectedRentalAnalysis.grossRentalYield,
        netRentalYield: selectedRentalAnalysis.netRentalYield,
        rentalAnalysis: {
            traditional: rentalAnalysisTraditional,
            byRooms: rentalAnalysisByRooms
        }
    };
};
