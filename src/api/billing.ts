import request from '@/utils/request';

export enum Channel {
  WECHAT = 'wechat',
  ALI_PAY = 'alipay',
}

export enum PayStatus {
  PENDING = 1,
  SUCCESS = 2,
}

export enum PayType {
  JSAPI = 'JSAPI',
  NATIVE = 'NATIVE',
}

export interface ExchangeRedemptionCodeType {
  id: number;
  name: string;
  type: number;
  expired_day: number;
  num: number;
  price: number;
}

export interface PackageType {
  id: number;
  name: string;
  price: number;
  identity: number;
}

export interface PayInfoType {
  id: number;
  price: string;
  channel: Channel;
  pay_type: PayType;
  package_name: string;
  data: {
    code_url: string;
    appId: string;
    timeStamp: string;
    nonceStr: string;
    signType: string;
    paySign: string;
    package: string;
  };
}

export interface OrderBillingType {
  id: number;
  package_id: number;
  channel: Channel;
  pay_type: PayType;
  user_id: string;
  status: PayStatus;
  platform: string;
  business_id: string;
}

export interface BillingDetailType {
  id: number;
  trade_no: string;
  user_id: number;
  status: number;
}

export default {
  getBillingPackage(): Promise<PackageType[]> {
    return request('package');
  },
  exchangeRedemptionCode(cdk: string): Promise<ExchangeRedemptionCodeType> {
    return request('cdk', {
      method: 'post',
      body: JSON.stringify({ cdk }),
    });
  },
  orderBilling(data: {
    channel: Channel;
    package_id: number;
    pay_type: PayType;
    platform: number;
  }): Promise<OrderBillingType> {
    return request('order', {
      method: 'post',
      body: JSON.stringify(data),
    });
  },
  billingPayDetail(id: number): Promise<PayInfoType> {
    return request(`order/${id}/pay`);
  },
  billingDetail(id: number): Promise<BillingDetailType> {
    return request(`order/${id}`);
  },
};
