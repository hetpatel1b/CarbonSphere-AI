import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { CarbonScoreCard } from '@/components/dashboard/CarbonScoreCard';

describe('CarbonScoreCard Component', () => {
  it('renders correctly with given score and trend label', () => {
    render(<CarbonScoreCard score={850} trendLabel="Up 12% this month" />);

    expect(screen.getByText('Sustainability Score')).toBeDefined();
    expect(screen.getByText('Up 12% this month')).toBeDefined();
  });

  it('animates score to target value', () => {
    vi.useFakeTimers();
    render(<CarbonScoreCard score={850} trendLabel="Up 12% this month" />);

    // Fast-forward animation timer
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(screen.getByText('850')).toBeDefined();
    vi.useRealTimers();
  });
});
