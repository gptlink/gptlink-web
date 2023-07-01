import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppConfigType, LoginTypeEnum } from '@/api/app';

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
  loginType: LoginTypeEnum;
  appConfig: AppConfigType;
  setTheme: (theme: ThemeModeType) => void;
  setAppConfig: (theme: AppConfigType) => void;
  setLanguage: (language: LanguagesType) => void;
  setLoginType: (loginType: LoginTypeEnum) => void;
}

const initialState = {
  theme: ThemeModeType.SYSTEM,
  language: LanguagesType.ZH,
  loginType: LoginTypeEnum.WECHAT,
  appConfig: Object.create(null),
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,

      setTheme: (theme: ThemeModeType) => {
        const systemMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (theme === ThemeModeType.DARK || (theme === ThemeModeType.SYSTEM && systemMode)) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        set({ theme });
      },
      setLanguage: (language: LanguagesType) => set({ language }),
      setLoginType: (loginType: LoginTypeEnum) => set({ loginType }),
      setAppConfig: (appConfig: AppConfigType) => set({ appConfig, loginType: appConfig.login_type }),
    }),
    {
      name: StoreKey.Config,
    },
  ),
);
