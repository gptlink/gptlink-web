import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { StoreKey } from '@/constants';
import { UserInfoType } from '@/api/user';

interface UserState {
  access_token: string;
  userInfo: UserInfoType;
  setUserInfo: (val: UserInfoType) => void;
  setAccessToken: (val: string) => void;
  signOut: () => void;
  isLogin: () => boolean;
}

const initialState = {
  access_token: '',
  userInfo: {
    nickname: '',
    avatar: '',
    identity: 1,
    openid: '',
  },
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...initialState,
      setUserInfo: (val: UserInfoType) => set({ userInfo: val }),
      setAccessToken: (val: string) => {
        localStorage.setItem(StoreKey.AccessToken, val);
        set({ access_token: val });
      },
      signOut() {
        set({ ...initialState });
        localStorage.removeItem(StoreKey.AccessToken);
      },
      isLogin() {
        return !!localStorage.getItem(StoreKey.AccessToken);
      },
    }),
    {
      name: StoreKey.User,
    },
  ),
);
