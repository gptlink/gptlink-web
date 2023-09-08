import { create } from 'zustand';

import salesmanService, { SalesmanStatisticsType } from '@/api/salesman';

interface SalesmanState {
  statistics: SalesmanStatisticsType;
  getSalesmanStatistics: () => void;
}

const initialState = {
  statistics: {
    order_num: 0,
    order_price: '0.00',
    custom_num: 0,
    balance: '0.00',
    ratio: 0,
  },
};

export const useSalesmanStore = create<SalesmanState>()((set) => ({
  ...initialState,
  getSalesmanStatistics: async () => {
    const res = await salesmanService.getSalesmanStatistics();
    set({ statistics: res });
  },
}));
