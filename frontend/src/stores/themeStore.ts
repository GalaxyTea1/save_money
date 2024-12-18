import { create } from "zustand";

interface ThemeStore {
  isDark: boolean;
  toggleDark: () => void;
  theme: 'default' | 'blue' | 'green';
  setTheme: (theme: 'default' | 'blue' | 'green') => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  isDark: false,
  toggleDark: () => set((state) => ({ isDark: !state.isDark })),
  theme: 'default',
  setTheme: (theme) => set({ theme })
}));

export default useThemeStore; 