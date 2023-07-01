import { useMemo } from 'react';
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

  return {
    isWeixinBrowser,
    weChatLogin,
  };
};

export default useWechat;
