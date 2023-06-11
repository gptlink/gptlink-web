import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StoreKey } from '../constants';
import { UserInfo } from '@/api/user';

interface UserState {
  access_token: string;
  userInfo: UserInfo;
  setUserInfo: (val: UserInfo) => void;
  setAccessToken: (val: string) => void;
  signOut: () => void;
}

const initialState = {
  access_token: '',
  userInfo: {
    nickname: '',
    avatar: '',
    identity: [],
  },
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...initialState,
      setUserInfo: (val: UserInfo) => set({ userInfo: val }),
      setAccessToken: (val: string) => {
        localStorage.setItem(StoreKey.AccessToken, val);
        set({ access_token: val });
      },
      signOut() {
        set({ ...initialState });
        localStorage.removeItem(StoreKey.AccessToken);
      },
    }),
    {
      name: StoreKey.User,
    },
  ),
);
