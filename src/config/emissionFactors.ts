export interface EmissionFactorNode {
  factor: number;
  source: string;
  sourceUrl: string;
  updatedAt: string;
  region: string;
}

export interface EmissionFactors {
  transport: Record<string, EmissionFactorNode>;
  energy: { electricity: EmissionFactorNode };
  water: { usage: EmissionFactorNode };
  food: Record<string, EmissionFactorNode>;
  shopping: Record<string, EmissionFactorNode>;
}

export const defaultEmissionFactors: EmissionFactors = {
  transport: {
    'Petrol Car': { factor: 0.192, source: 'DEFRA (UK Govt)', sourceUrl: 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2023', updatedAt: '2023-06-01', region: 'Global Average' },
    'Diesel Car': { factor: 0.171, source: 'DEFRA (UK Govt)', sourceUrl: 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2023', updatedAt: '2023-06-01', region: 'Global Average' },
    'Electric Vehicle': { factor: 0.050, source: 'EPA eGRID', sourceUrl: 'https://www.epa.gov/egrid', updatedAt: '2023-01-30', region: 'US Average' },
    'Bus': { factor: 0.089, source: 'DEFRA (UK Govt)', sourceUrl: 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2023', updatedAt: '2023-06-01', region: 'Global Average' },
    'Train': { factor: 0.041, source: 'DEFRA (UK Govt)', sourceUrl: 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2023', updatedAt: '2023-06-01', region: 'Global Average' },
    'Flight': { factor: 0.255, source: 'GHG Protocol', sourceUrl: 'https://ghgprotocol.org/', updatedAt: '2022-04-15', region: 'Global Average' }
  },
  energy: {
    electricity: { factor: 0.475, source: 'EPA eGRID', sourceUrl: 'https://www.epa.gov/egrid', updatedAt: '2023-01-30', region: 'US Average' }
  },
  water: {
    usage: { factor: 0.0003, source: 'DEFRA (UK Govt)', sourceUrl: 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2023', updatedAt: '2023-06-01', region: 'Global Average' }
  },
  food: {
    'Beef': { factor: 27, source: 'IPCC', sourceUrl: 'https://www.ipcc.ch/srccl/', updatedAt: '2019-08-08', region: 'Global Average' },
    'Chicken': { factor: 6.9, source: 'IPCC', sourceUrl: 'https://www.ipcc.ch/srccl/', updatedAt: '2019-08-08', region: 'Global Average' },
    'Vegetarian': { factor: 2, source: 'IPCC', sourceUrl: 'https://www.ipcc.ch/srccl/', updatedAt: '2019-08-08', region: 'Global Average' },
    'Vegan': { factor: 1.5, source: 'IPCC', sourceUrl: 'https://www.ipcc.ch/srccl/', updatedAt: '2019-08-08', region: 'Global Average' }
  },
  shopping: {
    'Low Impact': { factor: 5, source: 'GHG Protocol', sourceUrl: 'https://ghgprotocol.org/', updatedAt: '2022-04-15', region: 'Global Average' },
    'Medium Impact': { factor: 15, source: 'GHG Protocol', sourceUrl: 'https://ghgprotocol.org/', updatedAt: '2022-04-15', region: 'Global Average' },
    'High Impact': { factor: 40, source: 'GHG Protocol', sourceUrl: 'https://ghgprotocol.org/', updatedAt: '2022-04-15', region: 'Global Average' }
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
