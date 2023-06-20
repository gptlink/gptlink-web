import request from '@/utils/request';

export interface ConfigAgreementType {
  title: string;
  agreement: string;
}

export default {
  getConfigAgreement(): Promise<ConfigAgreementType> {
    return request('config/agreement');
  },
};
