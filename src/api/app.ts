import request from '@/utils/request';

export interface ConfigAgreementType {
  title: string;
  agreement: string;
}

export enum LoginTypeEnum {
  PASSWORD = '1',
  WECHAT = '2',
  PHONE = '3',
  WECHAT_AND_PHONE = '4',
}

export interface AppConfigType {
  name: string;
  icp: string;
  web_logo: string;
  admin_logo: string;
  login_type: LoginTypeEnum;
  user_logo: string;
}

export default {
  getConfigAgreement(): Promise<ConfigAgreementType> {
    return request('config/agreement');
  },
  getAppConfig(): Promise<AppConfigType> {
    return request('config/basic-info');
  },
};
