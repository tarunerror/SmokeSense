import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

import { ThemeProvider } from '@/design-system';
import { Button } from '@/components/ui';

describe('Button', () => {
  it('renders a label and calls onPress', () => {
    const onPress = jest.fn();

    const { getByRole, getByText } = render(
      <ThemeProvider>
        <Button label="Tap me" onPress={onPress} />
      </ThemeProvider>,
    );

    expect(getByText('Tap me')).toBeTruthy();

    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
