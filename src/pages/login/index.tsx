import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import { LoginType } from '@/constants';
import { useUserStore, LoginTypeEnum, useAppStore } from '@/store';
import userServices from '@/api/user';
import Header from '@/layout/Header';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import IconSvg from '@/components/Icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useAuth from '@/hooks/use-auth';

import { PrivacyProtocol } from './Protocol';
import { QrCodeDialog } from './QrCodeDialog';
import { LoginForm, RegisterDialog, RetrievePasswordDialog } from './LoginForm';

export default function Login() {
  const [protocolChecked, setProtocolChecked] = useState(false);
  const [qrCodeDialogOpen, setQrCodeDialogOpen] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [loginType, setLoginType] = useAppStore((state) => [state.loginType, state.setLoginType]);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [setUserInfo, setAccessToken] = useUserStore((state) => [state.setUserInfo, state.setAccessToken]);

  const handleLogin = async () => {
    const currentUrl = location.origin + location.pathname;
    const res = await userServices.getWxQrCode(LoginType.WEIXIN_WEB, currentUrl);
    setQrCodeDialogOpen(true);
    setQrCode(res.qr_code_url);
  };

  const getUserInfo = async () => {
    const code = searchParams.get('code');
    if (code) {
      try {
        const res = await userServices.getUserInfoByCode(LoginType.WEIXIN_WEB, code);
        setUserInfo(res.user);
        setAccessToken(res.access_token);
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
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header isPlain />
      <div className="flex flex-1 items-center justify-center">
        <div className="flex w-[32rem] -translate-y-10 rounded-xl border pb-24 pt-10 shadow">
          <Tabs
            value={loginType}
            className="flex w-full flex-col items-center"
            onValueChange={(val) => setLoginType(val as LoginTypeEnum)}
          >
            <TabsList>
              <TabsTrigger value={LoginTypeEnum.QRCODE}>微信扫码登陆</TabsTrigger>
              <TabsTrigger value={LoginTypeEnum.PASSWORD}>账号密码登陆</TabsTrigger>
            </TabsList>

            <IconSvg className="mb-4 w-40 rounded-full" />
            <div className="text-3xl font-bold"> GPTLink Web </div>

            <TabsContent value="qrcode" className="flex w-full flex-col items-center">
              <Button className="mb-4 mt-12 w-[70%]" disabled={!protocolChecked} onClick={handleLogin}>
                微信扫码登录
              </Button>
            </TabsContent>

            <TabsContent value="password" className="flex w-full flex-col items-center">
              <LoginForm protocolChecked={protocolChecked}></LoginForm>
            </TabsContent>

            <div className="flex items-center text-xs">
              <Checkbox
                checked={protocolChecked}
                id="terms"
                className="mr-2"
                onCheckedChange={(val) => setProtocolChecked(val as boolean)}
              />
              我已阅读并同意
              <PrivacyProtocol>
                <span className="text-blue-600">《隐私协议》</span>
              </PrivacyProtocol>
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
