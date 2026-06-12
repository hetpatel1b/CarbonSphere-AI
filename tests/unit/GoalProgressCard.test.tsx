import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { GoalProgressCard } from '@/components/dashboard/GoalProgressCard';

describe('GoalProgressCard Component', () => {
  it('renders correctly with given title and target progress values', () => {
    render(<GoalProgressCard title="Weekly Energy Limit" current={150} target={200} unit="kWh" />);

    expect(screen.getByText('Weekly Energy Limit')).toBeDefined();
    expect(screen.getByText('/ 200 kWh')).toBeDefined();
  });

  it('animates progress to target values', () => {
    vi.useFakeTimers();
    render(<GoalProgressCard title="Weekly Energy Limit" current={150} target={200} unit="kWh" />);

    // Fast-forward animation timer
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(screen.getByText('150.0')).toBeDefined();
    expect(screen.getByText('75%')).toBeDefined();
    vi.useRealTimers();
  });
});
