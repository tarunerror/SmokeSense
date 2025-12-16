import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';

import { useAppStore } from '@/store/appStore';

import { AppTheme, darkTheme, lightTheme } from './theme';

const ThemeContext = createContext<AppTheme>(lightTheme);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const themeMode = useAppStore((s) => s.themeMode);

  const theme = useMemo<AppTheme>(() => {
    const resolved =
      themeMode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : themeMode;

    return resolved === 'dark' ? darkTheme : lightTheme;
  }, [systemScheme, themeMode]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
