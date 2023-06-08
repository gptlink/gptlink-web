import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StoreKey } from '../constant';

interface UserState {
  nickName: string;
  avatar: string;
}

const initialState = {
  nickName: 'PengYYY',
  avatar:
    'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIm0q06mdqTumC0zFkOCRUAPRWSeId450ViaEAgvYKDHUvGFq33WZPdgGbRgY28PBAic8OOxpcHtOAg/132',
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...initialState,

      getUserInfo: () => set({}),
    }),
    {
      name: StoreKey.Config,
    },
  ),
);
