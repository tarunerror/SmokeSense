import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';

import { useTheme } from '@/design-system';

type Variant = 'title' | 'subtitle' | 'body' | 'caption' | 'mono';

type Props = RNTextProps & {
  variant?: Variant;
  muted?: boolean;
};

export function Text({ variant = 'body', muted = false, style, ...props }: Props) {
  const theme = useTheme();

  const base: TextStyle = {
    color: muted ? theme.colors.textMuted : theme.colors.text,
  };

  const variantStyle: TextStyle =
    variant === 'title'
      ? {
          fontSize: theme.typography.fontSize.xxl,
          lineHeight: theme.typography.lineHeight.xxl,
          fontWeight: '700',
        }
      : variant === 'subtitle'
        ? {
            fontSize: theme.typography.fontSize.xl,
            lineHeight: theme.typography.lineHeight.xl,
            fontWeight: '600',
          }
        : variant === 'caption'
          ? {
              fontSize: theme.typography.fontSize.sm,
              lineHeight: theme.typography.lineHeight.sm,
            }
          : variant === 'mono'
            ? {
                fontSize: theme.typography.fontSize.sm,
                lineHeight: theme.typography.lineHeight.sm,
                fontFamily: theme.typography.fontFamily.mono,
              }
            : {
                fontSize: theme.typography.fontSize.md,
                lineHeight: theme.typography.lineHeight.md,
              };

  return <RNText style={[base, variantStyle, style]} {...props} />;
}
