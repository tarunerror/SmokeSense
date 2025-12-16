import { create } from 'zustand';

import type { ThemeMode } from '@/design-system';

type AppState = {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
};

export const useAppStore = create<AppState>((set) => ({
  themeMode: 'system',
  setThemeMode: (themeMode) => set({ themeMode }),
}));
