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

export enum LoginTypeEnum {
  QRCODE = 'qrcode',
  PASSWORD = 'password',
}

interface AppState {
  theme: ThemeModeType;
  language: LanguagesType;
  loginType: LoginTypeEnum;
  setTheme: (theme: ThemeModeType) => void;
  setLanguage: (language: LanguagesType) => void;
  setLoginType: (loginType: LoginTypeEnum) => void;
}

const initialState = {
  theme: ThemeModeType.SYSTEM,
  language: LanguagesType.ZH,
  loginType: LoginTypeEnum.QRCODE,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,

      setTheme: (theme: ThemeModeType) => set({ theme }),
      setLanguage: (language: LanguagesType) => set({ language }),
      setLoginType: (loginType: LoginTypeEnum) => set({ loginType }),
    }),
    {
      name: StoreKey.Config,
    },
  ),
);
