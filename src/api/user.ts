import request from '@/utils/request';

export const getWxQrCode = (type: string, redirectUrl: string) => {
  return request(`https://api.gpt-link.com/wechat/weixinweb/qrcode?type=${type}&redirect_url=${redirectUrl}`);
};
