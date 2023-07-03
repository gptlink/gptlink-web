import request from '@/utils/request';
import wx from 'weixin-js-sdk-ts';

export interface ConfigAgreementType {
  title: string;
  agreement: string;
  enable: boolean;
}

export enum LoginTypeEnum {
  PASSWORD = '',
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
  getAppConfig(): Promise<AppConfigType> {
    return request('config/basic-info');
  },
  getJsSDK(url: string): Promise<JsSDKType> {
    return request(`wechat/jssdk?url=${encodeURIComponent(url)}`);
  },
  getShareConfig(): Promise<ShareConfigType> {
    return request('config/share');
  },
};
