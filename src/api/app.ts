import request from '@/utils/request';
import wx from 'weixin-js-sdk-ts';

export interface ConfigAgreementType {
  title: string;
  agreement: string;
  enable: boolean;
}

export enum LoginTypeEnum {
  PASSWORD = '1',
  WECHAT = '2',
  PHONE = '3',
  WECHAT_AND_PHONE = '4',
}

export interface AppConfigInterface {
  name: string;
  icp: string;
  web_logo: string;
  admin_logo: string;
  user_logo: string;
}

export interface LoginTypeInterface {
  login_type: LoginTypeEnum;
  mobile_verify: boolean;
}

export enum PaymentChannelEnum {
  OFFLINE = 'offline',
  WECHAT = 'wechat',
}

export interface PaymentConfigType {
  channel: PaymentChannelEnum;
  offline: string;
}

export interface AppConfigType extends LoginTypeInterface, AppConfigInterface, PaymentConfigType {}

export interface JsSDKType {
  debug: boolean;
  beta: boolean;
  jsApiList: wx.jsApiList;
  openTagList: wx.openTagList;
  appId: string;
  nonceStr: string;
  timestamp: number;
  url: string;
  signature: string;
}

export interface ShareConfigType {
  desc: string;
  title: string;
  img_url: string;
  share_img: string;
}

export default {
  getConfigAgreement(): Promise<ConfigAgreementType> {
    return request('config/agreement');
  },
  getAppConfig(): Promise<AppConfigInterface> {
    return request('config/basic-info');
  },
  getLoginType(): Promise<LoginTypeInterface> {
    return request('config/login-type');
  },
  getJsSDK(url: string): Promise<{
    data: JsSDKType;
  }> {
    return request(`wechat/jssdk?url=${encodeURIComponent(url)}`);
  },
  getShareConfig(): Promise<ShareConfigType> {
    return request('config/share');
  },
  getPaymentConfig(): Promise<PaymentConfigType> {
    return request('config/payment');
  },
};
