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

// TODO: 分离 appConfig 配置，实时拉取数据
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

      setTheme: (theme: ThemeModeType) => set({ theme }),
      setLanguage: (language: LanguagesType) => set({ language }),
      setLoginType: (loginType: LoginTypeEnum) => set({ loginType }),
      setAppConfig: (appConfig: AppConfigType) => set({ appConfig, loginType: appConfig.login_type }),
    }),
    {
      name: StoreKey.Config,
    },
  ),
);
