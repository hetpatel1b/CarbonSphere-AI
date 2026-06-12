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

    if (cat === 'transport') {
      const dist = Number(params.distance);
      if (!params.vehicleType || isNaN(dist) || dist < 0) return 0;

      const factors: Record<string, number> = {
        'Petrol Car': 0.192,
        'Diesel Car': 0.171,
        'Electric Vehicle': 0.050,
        'Bus': 0.089,
        'Train': 0.041,
        'Flight': 0.255
      };

      const factor = factors[params.vehicleType] || 0;
      return Number((dist * factor).toFixed(2));
    }

    if (cat === 'energy') {
      const kwh = Number(params.electricity);
      if (isNaN(kwh) || kwh < 0) return 0;
      return Number((kwh * 0.475).toFixed(2));
    }

    if (cat === 'water') {
      const liters = Number(params.waterUsage);
      if (isNaN(liters) || liters < 0) return 0;
      return Number((liters * 0.0003).toFixed(2));
    }

    if (cat === 'food') {
      if (!params.mealType) return 0;
      const factors: Record<string, number> = {
        'Beef': 27,
        'Chicken': 6.9,
        'Vegetarian': 2,
        'Vegan': 1.5
      };
      return factors[params.mealType] || 0;
    }

    if (cat === 'shopping') {
      if (!params.shoppingImpact) return 0;
      const factors: Record<string, number> = {
        'Low Impact': 5,
        'Medium Impact': 15,
        'High Impact': 40
      };
      return factors[params.shoppingImpact] || 0;
    }

    return 0;
  } catch (error) {
    console.error("Error in calculating carbon impact:", error);
    return 0;
  }
}
