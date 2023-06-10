import request from '@/utils/request';

export default {
  getBillingPackage() {
    return request('package');
  },
  exchangeRedemptionCode(cdk: string) {
    return request('cdk', {
      method: 'post',
      body: JSON.stringify({ cdk }),
    });
  },
  orderBilling(data: { channel: string; package_id: number; pay_type: string; platform: number }) {
    return request('order', {
      method: 'post',
      body: JSON.stringify(data),
    });
  },
  billingPayDetail(id: number) {
    return request(`order/${id}/pay`);
  },
  billingDetail(id: number) {
    return request(`order/${id}`);
  },
};
