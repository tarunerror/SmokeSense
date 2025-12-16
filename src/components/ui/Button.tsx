import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { useTheme } from '@/design-system';

import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost';

type Size = 'sm' | 'md';

type Props = Omit<PressableProps, 'style'> & {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  style,
  ...props
}: Props) {
  const theme = useTheme();

  const height = size === 'sm' ? 40 : 48;
  const paddingHorizontal = size === 'sm' ? theme.spacing.lg : theme.spacing.xl;

  const base: ViewStyle = {
    height,
    paddingHorizontal,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  };

  const variantStyle: ViewStyle =
    variant === 'primary'
      ? {
          backgroundColor: theme.colors.primary,
        }
      : variant === 'secondary'
        ? {
            backgroundColor: theme.colors.surfaceAlt,
            borderWidth: 1,
            borderColor: theme.colors.border,
          }
        : {
            backgroundColor: 'transparent',
          };

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      style={({ pressed }) => [
        base,
        variantStyle,
        pressed && variant === 'primary' ? { backgroundColor: theme.colors.primaryPressed } : null,
        disabled || loading ? { opacity: 0.6 } : null,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? theme.colors.onPrimary : theme.colors.text} />
      ) : (
        <Text
          style={{
            fontWeight: '600',
            color: variant === 'primary' ? theme.colors.onPrimary : theme.colors.text,
          }}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}
