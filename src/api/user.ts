import request from '@/utils/request';

export interface BillType {
  name: string;
  num: number;
  used: number;
}

export interface UserPackageType {
  num: number;
  package_name: string;
  created_at: string;
  type: number;
}

export interface UserInfoType {
  nickname: string;
  avatar: string;
  identity: number[];
  openid: string;
}

export interface UserInfoByCodeType {
  oauth_id: string;
  user: UserInfoType;
  access_token: string;
}

export interface WxQrCodeType {
  qr_code_url: string;
}

export default {
  getWxQrCode(type: string, redirectUrl: string): Promise<WxQrCodeType> {
    return request(`wechat/${type}/qrcode?type=${type}&redirect_url=${redirectUrl}`);
  },
  getUserInfoByCode(type: string, code: string): Promise<UserInfoByCodeType> {
    return request(`wechat/${type}/login`, { method: 'post', body: JSON.stringify({ code, type, share_openid: '' }) });
  },
  getUserProfile(): Promise<UserInfoType> {
    return request('user/profile');
  },
  getUserBill(): Promise<BillType> {
    return request('user/bill-package');
  },
  getUserPackages(): Promise<UserPackageType[]> {
    return request('user/package/record');
  },
  register(data: { nickname: string; mobile: string; password: string }): Promise<{
    user: UserInfoType;
    access_token: string;
  }> {
    return request('auth/register', {
      method: 'post',
      body: JSON.stringify(data),
    });
  },
  login(data: { nickname: string; password: string }): Promise<{
    user: UserInfoType;
    access_token: string;
  }> {
    return request('auth/login', {
      method: 'post',
      body: JSON.stringify(data),
    });
  },
  resetPassword(data: {
    nickname: string;
    password: string;
    mobile: string;
    reenteredPassword: string;
    verify: string;
    verify_type: number;
  }): Promise<UserInfoType> {
    return request('auth/reset', {
      method: 'post',
      body: JSON.stringify(data),
    });
  },
};
