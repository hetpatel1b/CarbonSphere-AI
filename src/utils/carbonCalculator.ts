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
