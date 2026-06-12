import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AIInsightCard } from '@/components/dashboard/AIInsightCard';
import { AIInsight } from '@/services/aiCoachService';

const mockInsight: AIInsight = {
  score: 85,
  strengths: ['Great low carbon transport options'],
  weaknesses: ['High food footprint'],
  challengeSuggestion: 'Try a vegan day challenge!',
  monthlyImprovementPlan: 'Reduce heating usage',
  carbonReductionOpportunities: 'Potential to save 2.4 tCO2e/yr',
};

describe('AIInsightCard Component', () => {
  it('renders fallback description when insight is missing', () => {
    render(<AIInsightCard insight={null} />);
    expect(screen.getByText(/No recent AI insights available/i)).toBeDefined();
  });

  it('renders insight details correctly when provided', () => {
    render(<AIInsightCard insight={mockInsight} />);
    expect(screen.getByText(/sustainability score of/i)).toBeDefined();
    expect(screen.getByText('85')).toBeDefined();
    expect(screen.getByText('Try a vegan day challenge!')).toBeDefined();
    expect(screen.getByText('Potential to save 2.4 tCO2e/yr')).toBeDefined();
  });
});
