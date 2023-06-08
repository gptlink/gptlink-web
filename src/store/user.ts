import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StoreKey } from '../constants';

type UserInfo = {
  nickName: string;
  avatar: string;
};

interface UserState {
  access_token: string;
  userInfo: UserInfo;
  setUserInfo: (val: UserInfo) => void;
  setAccessToken: (val: string) => void;
}

const initialState = {
  access_token: '',
  userInfo: {
    nickName: '',
    avatar: '',
  },
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...initialState,
      setUserInfo: (val: UserInfo) =>
        set({
          userInfo: val,
        }),
      setAccessToken: (val: string) => {
        localStorage.setItem(StoreKey.ACCESS_TOKEN, val);
        set({
          access_token: val,
        });
      },
    }),
    {
      name: StoreKey.User,
    },
  ),
);
