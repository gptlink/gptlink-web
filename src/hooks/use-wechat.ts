import { useMemo } from 'react';
import { PayInfoType } from '@/api/billing';

declare global {
  interface Window {
    WeixinJSBridge: unknown & {
      invoke: (name: string, params: Record<string, string>, callback: (data: Record<string, string>) => void) => void;
    };
  }
}

const useWechat = () => {
  const redirectUrl = window.location.origin + window.location.pathname;
  const { VITE_API_DOMAIN } = import.meta.env;

  const isWeixinBrowser = useMemo(() => {
    const ua = navigator.userAgent.toLowerCase();
    return !!/micromessenger/.test(ua);
  }, [navigator]);

  const weChatLogin = () => {
    const wxUrl = `${VITE_API_DOMAIN}/wechat/weixin/redirect?redirect_url=${redirectUrl}`;
    window.location.href = wxUrl;
  };

  const handleWeChatPay = (payInfo: PayInfoType, callback: () => void): unknown => {
    const data = payInfo.data;
    if (!window.WeixinJSBridge) return;
    if (data) {
      const { appId, timeStamp, nonceStr, signType, paySign } = data;
      const params = {
        appId,
        timeStamp,
        nonceStr,
        signType,
        paySign,
        package: data.package,
      };

      window.WeixinJSBridge.invoke(
        // 调起支付
        'getBrandWCPayRequest',
        params,
        (res: Record<string, string>) => {
          if (res.err_msg === 'get_brand_wcpay_request:ok') {
            callback();
          }
        },
      );
    }
  };

  const weChatPay = (payInfo: PayInfoType, callback: () => void) => {
    if (typeof window.WeixinJSBridge === 'undefined') {
      document.addEventListener('WeixinJSBridgeReady', handleWeChatPay(payInfo, callback) as EventListener);
    } else {
      handleWeChatPay(payInfo, callback);
    }
  };

  return {
    isWeixinBrowser,
    weChatLogin,
    weChatPay,
  };
};

export default useWechat;
