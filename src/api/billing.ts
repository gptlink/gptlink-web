import request from '@/utils/request';

export default {
  getBillingPackage() {
    return request('package');
  },
};
