import { create } from 'zustand';
import userService, { BillType } from '@/api/user';

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
    if (!currentBill || !currentBill.num) return 0;
    return currentBill.num - currentBill.used;
  },
}));
