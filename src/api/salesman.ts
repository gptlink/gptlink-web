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

export interface SalesmanWithdrawalLastType {
  config: {
    name: string;
    account: string;
  };
}

export interface SalesmanWithdrawalType {
  id: number;
  serial_no: string;
  price: string;
  status: number;
  paid_no: string;
  user_id: number;
  created_at: string;
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
  withdrawal(data: { price: string; channel: string; config: { account: string; name: string } }): Promise<void> {
    return request(`/salesman/withdrawal/apply`, {
      method: 'post',
      body: JSON.stringify(data),
    });
  },
  getSalesmanWithdrawalLast(): Promise<SalesmanWithdrawalLastType> {
    return request(`/salesman/withdrawal/last`);
  },
  getSalesmanWithdrawalList(per_page?: number, page?: number): Promise<SalesmanWithdrawalType[]> {
    return request(`/salesman/withdrawal?per_page=${per_page}&page=${page}`);
  },
};
