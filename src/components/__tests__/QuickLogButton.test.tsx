import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import QuickLogButton from '../QuickLogButton';

describe('QuickLogButton', () => {
  it('should render quick log button', () => {
    const { getByText } = render(
      <QuickLogButton
        onQuickLog={jest.fn()}
        onDetailedLog={jest.fn()}
      />
    );

    expect(getByText('Log Cigarette')).toBeTruthy();
    expect(getByText('+ Add Details')).toBeTruthy();
  });

  it('should call onQuickLog when quick button pressed', () => {
    const onQuickLog = jest.fn();
    const { getByLabelText } = render(
      <QuickLogButton
        onQuickLog={onQuickLog}
        onDetailedLog={jest.fn()}
      />
    );

    fireEvent.press(getByLabelText('Quick log cigarette'));

    expect(onQuickLog).toHaveBeenCalled();
  });

  it('should call onDetailedLog when detailed button pressed', () => {
    const onDetailedLog = jest.fn();
    const { getByLabelText } = render(
      <QuickLogButton
        onQuickLog={jest.fn()}
        onDetailedLog={onDetailedLog}
      />
    );

    fireEvent.press(getByLabelText('Add detailed log'));

    expect(onDetailedLog).toHaveBeenCalled();
  });

  it('should show loading indicator when logging', () => {
    const { getByTestId, queryByText } = render(
      <QuickLogButton
        onQuickLog={jest.fn()}
        onDetailedLog={jest.fn()}
        isLogging={true}
      />
    );

    expect(queryByText('Log Cigarette')).toBeNull();
  });

  it('should disable buttons when logging', () => {
    const onQuickLog = jest.fn();
    const { getByLabelText } = render(
      <QuickLogButton
        onQuickLog={onQuickLog}
        onDetailedLog={jest.fn()}
        isLogging={true}
      />
    );

    const button = getByLabelText('Quick log cigarette');
    fireEvent.press(button);

    expect(onQuickLog).not.toHaveBeenCalled();
  });

  it('should have accessibility properties', () => {
    const { getByLabelText } = render(
      <QuickLogButton
        onQuickLog={jest.fn()}
        onDetailedLog={jest.fn()}
      />
    );

    const quickButton = getByLabelText('Quick log cigarette');
    expect(quickButton).toBeTruthy();

    const detailedButton = getByLabelText('Add detailed log');
    expect(detailedButton).toBeTruthy();
  });
});
