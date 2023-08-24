import request from '@/utils/request';

export interface SalesmanChildType {
  nickname?: string;
  order_price: string;
  order_num: number;
  created_at: string;
}

export interface SalesmanOrderType {
  price: string;
  created_at: string;
  custom: {
    nickname: string;
  };
}

export interface SalesmanStatisticsType {
  order_num: number;
  order_price: string;
  custom_num: number;
  balance: string;
  ratio: number;
}

export default {
  getSalesmanChildList(per_page?: number, page?: number): Promise<SalesmanChildType[]> {
    return request(`/salesman/child?per_page=${per_page}&page=${page}`);
  },
  getSalesmanOrderList(per_page?: number, page?: number): Promise<SalesmanOrderType[]> {
    return request(`/salesman/order?per_page=${per_page}&page=${page}`);
  },
  getSalesmanStatistics(): Promise<SalesmanStatisticsType> {
    return request(`/salesman/statistics`);
  },
};
