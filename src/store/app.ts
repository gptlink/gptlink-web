import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { StoreKey } from '../constants';

export enum ThemeModeType {
  DARK = 'dark',
  LIGHT = 'light',
  SYSTEM = 'system',
}

export enum LanguagesType {
  EN = 'en',
  ZH = 'zh',
}

interface AppState {
  theme: ThemeModeType;
  language: LanguagesType;
  setTheme: (theme: ThemeModeType) => void;
  setLanguage: (language: LanguagesType) => void;
}

const initialState = {
  theme: ThemeModeType.SYSTEM,
  language: LanguagesType.ZH,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,

      setTheme: (theme: ThemeModeType) => set({ theme }),
      setLanguage: (language: LanguagesType) => set({ language }),
    }),
    {
      name: StoreKey.Config,
    },
  ),
);
