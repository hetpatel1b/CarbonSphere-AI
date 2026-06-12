import { getEmissionFactors } from '@/config/emissionFactors';

export interface CarbonCalculationParams {
  category: string;
  vehicleType?: string;
  distance?: number;
  electricity?: number;
  waterUsage?: number;
  mealType?: string;
  shoppingImpact?: string;
}

export interface CarbonCalculationBreakdown {
  total: number;
  formula: string;
  emissionFactor: number;
  factorUnit: string;
  source: string;
  sourceOrganization?: string;
  sourceUrl?: string;
  region?: string;
  updatedAt?: string;
  assumptions: string;
}

export function calculateCarbonImpact(params: CarbonCalculationParams): number {
  try {
    const cat = params.category?.toLowerCase() || '';
    const factors = getEmissionFactors();

    if (cat === 'transport') {
      const dist = Number(params.distance);
      if (!params.vehicleType || isNaN(dist) || dist < 0) return 0;

      const factorNode = factors.transport[params.vehicleType];
      if (!factorNode) return 0;
      return Number((dist * factorNode.factor).toFixed(2));
    }

    if (cat === 'energy') {
      const kwh = Number(params.electricity);
      if (isNaN(kwh) || kwh < 0) return 0;
      return Number((kwh * factors.energy.electricity.factor).toFixed(2));
    }

    if (cat === 'water') {
      const liters = Number(params.waterUsage);
      if (isNaN(liters) || liters < 0) return 0;
      return Number((liters * factors.water.usage.factor).toFixed(2));
    }

    if (cat === 'food') {
      if (!params.mealType) return 0;
      return factors.food[params.mealType]?.factor || 0;
    }

    if (cat === 'shopping') {
      if (!params.shoppingImpact) return 0;
      return factors.shopping[params.shoppingImpact]?.factor || 0;
    }

    return 0;
  } catch (error) {
    console.error("Error in calculating carbon impact:", error);
    return 0;
  }
}

export function getCarbonCalculationBreakdown(params: CarbonCalculationParams): CarbonCalculationBreakdown | null {
  try {
    const cat = params.category?.toLowerCase() || '';
    const factors = getEmissionFactors();

    if (cat === 'transport') {
      const dist = Number(params.distance);
      if (!params.vehicleType || isNaN(dist) || dist < 0) return null;

      const node = factors.transport[params.vehicleType];
      if (!node) return null;
      const total = Number((dist * node.factor).toFixed(2));
      return {
        total,
        formula: `${dist} km × ${node.factor} kg CO₂e/km`,
        emissionFactor: node.factor,
        factorUnit: "kg CO₂e/km",
        source: node.source,
        sourceOrganization: node.sourceOrganization,
        sourceUrl: node.sourceUrl,
        region: node.region,
        updatedAt: node.updatedAt,
        assumptions: `Assumes average passenger load for a ${params.vehicleType}.`
      };
    }

    if (cat === 'energy') {
      const kwh = Number(params.electricity);
      if (isNaN(kwh) || kwh < 0) return null;
      const node = factors.energy.electricity;
      const total = Number((kwh * node.factor).toFixed(2));
      return {
        total,
        formula: `${kwh} kWh × ${node.factor} kg CO₂e/kWh`,
        emissionFactor: node.factor,
        factorUnit: "kg CO₂e/kWh",
        source: node.source,
        sourceOrganization: node.sourceOrganization,
        sourceUrl: node.sourceUrl,
        region: node.region,
        updatedAt: node.updatedAt,
        assumptions: "Assumes standard grid electricity emission averages."
      };
    }

    if (cat === 'water') {
      const liters = Number(params.waterUsage);
      if (isNaN(liters) || liters < 0) return null;
      const node = factors.water.usage;
      const total = Number((liters * node.factor).toFixed(2));
      return {
        total,
        formula: `${liters} L × ${node.factor} kg CO₂e/L`,
        emissionFactor: node.factor,
        factorUnit: "kg CO₂e/L",
        source: node.source,
        sourceOrganization: node.sourceOrganization,
        sourceUrl: node.sourceUrl,
        region: node.region,
        updatedAt: node.updatedAt,
        assumptions: "Includes water treatment and supply energy costs."
      };
    }

    if (cat === 'food') {
      if (!params.mealType) return null;
      const node = factors.food[params.mealType];
      if (!node) return null;
      return {
        total: node.factor,
        formula: `1 meal × ${node.factor} kg CO₂e/meal`,
        emissionFactor: node.factor,
        factorUnit: "kg CO₂e/meal",
        source: node.source,
        sourceOrganization: node.sourceOrganization,
        sourceUrl: node.sourceUrl,
        region: node.region,
        updatedAt: node.updatedAt,
        assumptions: `Based on average lifecycle emissions for a ${params.mealType.toLowerCase()} meal.`
      };
    }

    if (cat === 'shopping') {
      if (!params.shoppingImpact) return null;
      const node = factors.shopping[params.shoppingImpact];
      if (!node) return null;
      return {
        total: node.factor,
        formula: `Standard baseline for ${params.shoppingImpact}`,
        emissionFactor: node.factor,
        factorUnit: "kg CO₂e/purchase",
        source: node.source,
        sourceOrganization: node.sourceOrganization,
        sourceUrl: node.sourceUrl,
        region: node.region,
        updatedAt: node.updatedAt,
        assumptions: "Generic estimate based on typical product carbon footprints."
      };
    }

    return null;
  } catch (error) {
    console.error("Error generating carbon breakdown:", error);
    return null;
  }
}
