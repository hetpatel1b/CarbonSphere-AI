import { describe, it, expect } from 'vitest';
import { calculateCarbonImpact } from '../../src/utils/carbonCalculator';

describe('carbonCalculator', () => {
  it('should return 0 for unknown categories', () => {
    expect(calculateCarbonImpact({ category: 'Unknown' })).toBe(0);
  });

  describe('Transport', () => {
    it('should calculate transport impact correctly', () => {
      expect(calculateCarbonImpact({ category: 'Transport', vehicleType: 'Petrol Car', distance: 10 })).toBe(1.92);
      expect(calculateCarbonImpact({ category: 'Transport', vehicleType: 'Electric Vehicle', distance: 100 })).toBe(5.00);
    });

    it('should return 0 if distance is negative', () => {
      expect(calculateCarbonImpact({ category: 'Transport', vehicleType: 'Petrol Car', distance: -10 })).toBe(0);
    });

    it('should return 0 if vehicleType is missing', () => {
      expect(calculateCarbonImpact({ category: 'Transport', distance: 10 })).toBe(0);
    });
  });

  describe('Energy', () => {
    it('should calculate energy impact correctly', () => {
      expect(calculateCarbonImpact({ category: 'Energy', electricity: 100 })).toBe(47.50);
    });

    it('should return 0 if electricity is negative', () => {
      expect(calculateCarbonImpact({ category: 'Energy', electricity: -50 })).toBe(0);
    });
  });

  describe('Water', () => {
    it('should calculate water impact correctly', () => {
      expect(calculateCarbonImpact({ category: 'Water', waterUsage: 1000 })).toBe(0.30);
    });

    it('should return 0 if water usage is negative', () => {
      expect(calculateCarbonImpact({ category: 'Water', waterUsage: -100 })).toBe(0);
    });
  });

  describe('Food', () => {
    it('should calculate food impact correctly', () => {
      expect(calculateCarbonImpact({ category: 'Food', mealType: 'Beef' })).toBe(27);
      expect(calculateCarbonImpact({ category: 'Food', mealType: 'Vegan' })).toBe(1.5);
    });

    it('should return 0 if meal type is unknown', () => {
      expect(calculateCarbonImpact({ category: 'Food', mealType: 'Unknown' })).toBe(0);
    });
  });

  describe('Shopping', () => {
    it('should calculate shopping impact correctly', () => {
      expect(calculateCarbonImpact({ category: 'Shopping', shoppingImpact: 'High Impact' })).toBe(40);
      expect(calculateCarbonImpact({ category: 'Shopping', shoppingImpact: 'Low Impact' })).toBe(5);
    });

    it('should return 0 if shopping impact is missing', () => {
      expect(calculateCarbonImpact({ category: 'Shopping' })).toBe(0);
    });
  });
});
