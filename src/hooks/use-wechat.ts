import { useMemo } from 'react';
import wx from 'weixin-js-sdk-ts';
import toast from 'react-hot-toast';

import appService, { JsSDKType } from '@/api/app';
import { useUserStore } from '@/store';
import { PayInfoType } from '@/api/billing';
import useTask from '@/hooks/use-task';

export const initWxConfig = (config: JsSDKType) => {
  wx.config({
    debug: false,
    appId: config.appId,
    timestamp: config.timestamp,
    nonceStr: config.nonceStr,
    signature: config.signature,
    jsApiList: config.jsApiList,
    openTagList: config.openTagList,
  });
};

const useWechat = () => {
  const [{ openid }] = useUserStore((state) => [state.userInfo]);
  const { shareCallback } = useTask();

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

  const setWeixinShare = async () => {
    if (!isWeixinBrowser) return;
    const config = await appService.getJsSDK(window.location.href);

    const params = {
      title: '你身边的好友邀请你加入「智能AI助手」',
      link: `${window.location.origin}${openid ? `/?shareOpenId=${openid}` : ''}`,
      imgUrl: '',
      desc: '',
    };

    const opt = {
      ...params,
      success: async () => {
        shareCallback();
      },
      cancel: () => {
        toast.error('取消分享');
      },
    };

    initWxConfig(config);

    wx.updateAppMessageShareData(opt);
    wx.updateTimelineShareData(opt);
    wx.onMenuShareTimeline(opt);
    wx.onMenuShareAppMessage(opt);

    wx.error((err) => {
      console.error('分享内容错误：', err);
    });
  };

  return {
    isWeixinBrowser,
    weChatLogin,
    weChatPay,
    setWeixinShare,
  };
};

export default useWechat;
