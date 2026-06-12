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
  assumptions: string;
}

export function calculateCarbonImpact(params: CarbonCalculationParams): number {
  try {
    const cat = params.category?.toLowerCase() || '';
    const factors = getEmissionFactors();

    if (cat === 'transport') {
      const dist = Number(params.distance);
      if (!params.vehicleType || isNaN(dist) || dist < 0) return 0;

      const factor = factors.transport[params.vehicleType] || 0;
      return Number((dist * factor).toFixed(2));
    }

    if (cat === 'energy') {
      const kwh = Number(params.electricity);
      if (isNaN(kwh) || kwh < 0) return 0;
      return Number((kwh * factors.energy.electricity).toFixed(2));
    }

    if (cat === 'water') {
      const liters = Number(params.waterUsage);
      if (isNaN(liters) || liters < 0) return 0;
      return Number((liters * factors.water.usage).toFixed(2));
    }

    if (cat === 'food') {
      if (!params.mealType) return 0;
      return factors.food[params.mealType] || 0;
    }

    if (cat === 'shopping') {
      if (!params.shoppingImpact) return 0;
      return factors.shopping[params.shoppingImpact] || 0;
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
    const source = "EPA / DEFRA Average Standards";

    if (cat === 'transport') {
      const dist = Number(params.distance);
      if (!params.vehicleType || isNaN(dist) || dist < 0) return null;

      const factor = factors.transport[params.vehicleType] || 0;
      const total = Number((dist * factor).toFixed(2));
      return {
        total,
        formula: `${dist} km × ${factor} kg CO₂e/km`,
        emissionFactor: factor,
        factorUnit: "kg CO₂e/km",
        source,
        assumptions: `Assumes average passenger load for a ${params.vehicleType}.`
      };
    }

    if (cat === 'energy') {
      const kwh = Number(params.electricity);
      if (isNaN(kwh) || kwh < 0) return null;
      const factor = factors.energy.electricity;
      const total = Number((kwh * factor).toFixed(2));
      return {
        total,
        formula: `${kwh} kWh × ${factor} kg CO₂e/kWh`,
        emissionFactor: factor,
        factorUnit: "kg CO₂e/kWh",
        source,
        assumptions: "Assumes standard grid electricity emission averages."
      };
    }

    if (cat === 'water') {
      const liters = Number(params.waterUsage);
      if (isNaN(liters) || liters < 0) return null;
      const factor = factors.water.usage;
      const total = Number((liters * factor).toFixed(2));
      return {
        total,
        formula: `${liters} L × ${factor} kg CO₂e/L`,
        emissionFactor: factor,
        factorUnit: "kg CO₂e/L",
        source,
        assumptions: "Includes water treatment and supply energy costs."
      };
    }

    if (cat === 'food') {
      if (!params.mealType) return null;
      const factor = factors.food[params.mealType] || 0;
      return {
        total: factor,
        formula: `1 meal × ${factor} kg CO₂e/meal`,
        emissionFactor: factor,
        factorUnit: "kg CO₂e/meal",
        source,
        assumptions: `Based on average lifecycle emissions for a ${params.mealType.toLowerCase()} meal.`
      };
    }

    if (cat === 'shopping') {
      if (!params.shoppingImpact) return null;
      const factor = factors.shopping[params.shoppingImpact] || 0;
      return {
        total: factor,
        formula: `Standard baseline for ${params.shoppingImpact}`,
        emissionFactor: factor,
        factorUnit: "kg CO₂e/purchase",
        source,
        assumptions: "Generic estimate based on typical product carbon footprints."
      };
    }

    return null;
  } catch (error) {
    console.error("Error generating carbon breakdown:", error);
    return null;
  }
}
