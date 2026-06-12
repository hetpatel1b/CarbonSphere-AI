export interface EmissionFactors {
  transport: Record<string, number>;
  energy: { electricity: number };
  water: { usage: number };
  food: Record<string, number>;
  shopping: Record<string, number>;
}

export const defaultEmissionFactors: EmissionFactors = {
  transport: {
    'Petrol Car': 0.192,
    'Diesel Car': 0.171,
    'Electric Vehicle': 0.050,
    'Bus': 0.089,
    'Train': 0.041,
    'Flight': 0.255
  },
  energy: {
    electricity: 0.475
  },
  water: {
    usage: 0.0003
  },
  food: {
    'Beef': 27,
    'Chicken': 6.9,
    'Vegetarian': 2,
    'Vegan': 1.5
  },
  shopping: {
    'Low Impact': 5,
    'Medium Impact': 15,
    'High Impact': 40
  }
};

/**
 * Fetch emission factors.
 * In the future, this can be swapped out to fetch from DEFRA or EPA APIs.
 */
export async function fetchEmissionFactors(): Promise<EmissionFactors> {
  // Simulate network or config lookup
  return Promise.resolve(defaultEmissionFactors);
}

/**
 * Get synchronous emission factors for immediate calculations.
 */
export function getEmissionFactors(): EmissionFactors {
  return defaultEmissionFactors;
}
