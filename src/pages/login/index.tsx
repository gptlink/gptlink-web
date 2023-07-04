import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import { LoginType, StoreKey } from '@/constants';
import { useUserStore, useAppStore } from '@/store';
import userServices from '@/api/user';
import { LoginTypeEnum } from '@/api/app';
import Header from '@/layout/Header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useAuth from '@/hooks/use-auth';
import useAppConfig from '@/hooks/use-app-config';
import useWechat from '@/hooks/use-wechat';
import useShareOpenid from '@/hooks/use-share-openid';

import { PrivacyProtocol } from './Protocol';
import { QrCodeDialog } from './QrCodeDialog';
import { LoginForm, RegisterDialog, RetrievePasswordDialog, PhoneLoginForm } from './LoginForm';

export default function Login() {
  const [protocolChecked, setProtocolChecked] = useState(false);
  const [qrCodeDialogOpen, setQrCodeDialogOpen] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [oauthId, setOauthId] = useState('');
  const [loginType, setLoginType] = useAppStore((state) => [state.loginType, state.setLoginType]);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [setUserInfo, setAccessToken] = useUserStore((state) => [state.setUserInfo, state.setAccessToken]);
  const { isWeixinBrowser, weChatLogin } = useWechat();

  const handleLogin = async () => {
    if (isWeixinBrowser) {
      weChatLogin();
      return;
    }
    const currentUrl = location.origin + location.pathname;
    const res = await userServices.getWxQrCode(LoginType.WEIXIN_WEB, currentUrl);
    setQrCodeDialogOpen(true);
    setQrCode(res.qr_code_url);
  };

  const getUserInfo = async () => {
    const code = searchParams.get('code');
    if (code) {
      setProtocolChecked(true);
      try {
        setIsLoading(true);
        const res = await userServices.getUserInfoByCode(
          isWeixinBrowser ? LoginType.WEIXIN : LoginType.WEIXIN_WEB,
          code,
          localStorage.getItem(StoreKey.ShareOpenId) || '',
        );
        if (res.oauth_id) {
          setOauthId(res.oauth_id);
          return;
        }
        setUserInfo(res.user);
        setAccessToken(res.access_token);
        setIsLoading(false);
        navigate('/chat');
      } catch {
        setSearchParams('');
      }
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  useAuth();
  useShareOpenid();
  const appConfig = useAppConfig();

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header isPlain />
      <div className="flex flex-1 items-center justify-center">
        <div className="flex w-[32rem] -translate-y-10 rounded-xl border pb-24 pt-10 shadow max-sm:w-[22rem]">
          <Tabs
            value={loginType + ''}
            className="flex w-full flex-col items-center"
            onValueChange={(val) => setLoginType(val as LoginTypeEnum)}
          >
            {Array.isArray(appConfig.login_type) && (
              <TabsList className="mb-10">
                <TabsTrigger value={LoginTypeEnum.WECHAT}>微信扫码登陆</TabsTrigger>
                <TabsTrigger value={LoginTypeEnum.PASSWORD}>账号密码登陆</TabsTrigger>
              </TabsList>
            )}
            <img src={appConfig.web_logo} className="mb-4 w-40 rounded-full" />
            <div className="text-3xl font-bold"> {appConfig.name} </div>
            <TabsContent value={LoginTypeEnum.WECHAT} className="flex w-full flex-col items-center">
              <Button className="mb-4 mt-12 w-[70%]" disabled={!protocolChecked} onClick={handleLogin}>
                {isWeixinBrowser ? '微信登陆' : '微信扫码登录'}
              </Button>
            </TabsContent>
            <TabsContent value={LoginTypeEnum.PASSWORD} className="flex w-full flex-col items-center">
              <LoginForm protocolChecked={protocolChecked}></LoginForm>
            </TabsContent>
            <TabsContent value={LoginTypeEnum.WECHAT_AND_PHONE} className="flex w-full flex-col items-center">
              {oauthId ? (
                <PhoneLoginForm oauthId={oauthId} protocolChecked={protocolChecked}></PhoneLoginForm>
              ) : (
                <Button className="mb-4 mt-12 w-[70%]" disabled={!protocolChecked} onClick={handleLogin}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isWeixinBrowser ? '微信登陆' : '微信扫码登录'}
                </Button>
              )}
            </TabsContent>
            <div className="flex items-center text-xs">
              <PrivacyProtocol
                checked={protocolChecked}
                onCheckedChange={(val) => setProtocolChecked(val as boolean)}
              />
            </div>
          </Tabs>
          {loginType === LoginTypeEnum.PASSWORD && (
            <div className="absolute bottom-3 right-3">
              <RegisterDialog>
                <Button variant={'ghost'}>注册</Button>
              </RegisterDialog>
              <RetrievePasswordDialog>
                <Button variant={'ghost'}>找回密码</Button>
              </RetrievePasswordDialog>
            </div>
          )}
        </div>
        <QrCodeDialog
          open={qrCodeDialogOpen}
          qrCode={qrCode}
          handleOpenChange={(val) => {
            setQrCodeDialogOpen(val);
          }}
        />
      </div>
    </div>
  );
}
