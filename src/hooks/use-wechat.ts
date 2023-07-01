import { useMemo } from 'react';
const useWechat = () => {
  const redirectUrl = window.location.origin + window.location.pathname;
  const { VITE_APP_API_BASE_URL } = import.meta.env;

  const isWeixinBrowser = useMemo(() => {
    const ua = navigator.userAgent.toLowerCase();
    return !!/micromessenger/.test(ua);
  }, [navigator]);

  const weChatLogin = () => {
    const wxUrl = `${VITE_APP_API_BASE_URL}wechat/weixin/redirect?redirect_url=${redirectUrl}`;
    window.location.href = wxUrl;
  };

  return {
    isWeixinBrowser,
    weChatLogin,
  };
};

export default useWechat;
