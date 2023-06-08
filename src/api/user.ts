import request from '@/utils/request';

export default {
  getWxQrCode(type: string, redirectUrl: string) {
    return request(`wechat/${type}/qrcode?type=${type}&redirect_url=${redirectUrl}`);
  },
  getUserInfoByCode(type: string, code: string) {
    return request(`wechat/${type}/login`, { method: 'post', body: JSON.stringify({ code, type, share_openid: '' }) });
  },
  getUserProfile() {
    return request(`user/profile`);
  },
};
