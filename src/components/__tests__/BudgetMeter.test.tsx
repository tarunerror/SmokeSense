import React from 'react';
import { render } from '@testing-library/react-native';
import BudgetMeter from '../BudgetMeter';
import { BudgetStatus } from '../../types/models';

describe('BudgetMeter', () => {
  const mockStatus: BudgetStatus = {
    budget: {
      dailyLimit: 10,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    todayCount: 5,
    percentage: 50,
    remaining: 5,
  };

  it('should render linear variant by default', () => {
    const { getByText } = render(<BudgetMeter status={mockStatus} />);

    expect(getByText('5 / 10')).toBeTruthy();
    expect(getByText('5 left')).toBeTruthy();
    expect(getByText('50%')).toBeTruthy();
  });

  it('should render circular variant', () => {
    const { getByText } = render(
      <BudgetMeter status={mockStatus} variant="circular" />
    );

    expect(getByText('5')).toBeTruthy();
    expect(getByText('/ 10')).toBeTruthy();
    expect(getByText('5 remaining')).toBeTruthy();
  });

  it('should show over budget message', () => {
    const overBudgetStatus: BudgetStatus = {
      ...mockStatus,
      todayCount: 12,
      percentage: 120,
      remaining: 0,
    };

    const { getByText } = render(
      <BudgetMeter status={overBudgetStatus} variant="circular" />
    );

    expect(getByText('Budget exceeded')).toBeTruthy();
  });

  it('should show over budget in linear variant', () => {
    const overBudgetStatus: BudgetStatus = {
      ...mockStatus,
      todayCount: 11,
      percentage: 110,
      remaining: 0,
    };

    const { getByText } = render(<BudgetMeter status={overBudgetStatus} />);

    expect(getByText('Over budget!')).toBeTruthy();
  });

  it('should have accessibility label', () => {
    const { getByLabelText } = render(<BudgetMeter status={mockStatus} />);

    expect(
      getByLabelText('5 of 10 cigarettes logged today. 5 remaining.')
    ).toBeTruthy();
  });
});
