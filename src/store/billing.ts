import { create } from 'zustand';
import userService from '@/api/user';

type BillType = {
  name: string;
  num: number;
  used: number;
};

export type PackageType = {
  name: string;
  price: number;
  identity: number;
};

interface BillState {
  currentBill: BillType | null;
  getCurrentBilling: () => void;
  remaining: () => number;
}

const initData = {
  currentBill: null,
};

export const useBillingStore = create<BillState>()((set, get) => ({
  ...initData,
  getCurrentBilling: async () => {
    const res = await userService.getUserBill();
    set({ currentBill: res });
  },
  remaining: () => {
    const currentBill = get().currentBill;
    if (!currentBill) return 0;
    return currentBill.num - currentBill.used;
  },
}));
