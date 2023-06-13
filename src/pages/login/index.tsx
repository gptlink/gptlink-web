import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import { LoginType } from '@/constants';
import { useUserStore } from '@/store';
import userServices from '@/api/user';
import Header from '@/layout/Header';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import IconSvg from '@/components/Icon';
import useAuth from '@/hooks/use-auth';

import { PrivacyProtocol } from './Protocol';
import { QrCode } from './QrCode';

export default function Login() {
  const [protocolChecked, setProtocolChecked] = useState(false);
  const [open, setOpen] = useState(false);
  const [qrCode, setQrCode] = useState('');

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [setUserInfo, setAccessToken] = useUserStore((state) => [state.setUserInfo, state.setAccessToken]);

  const handleLogin = async () => {
    const currentUrl = location.origin + location.pathname;
    const res = await userServices.getWxQrCode(LoginType.WEIXIN_WEB, currentUrl);
    setOpen(true);
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
        <div className="flex w-[32rem] -translate-y-10 flex-col items-center rounded-xl border pb-20 pt-10 shadow">
          <IconSvg className="mb-4 w-40 rounded-full" />
          <div className="mt-4 text-3xl font-bold"> GPTLink Web </div>
          <Button className="mb-4 mt-12 w-[60%]" disabled={!protocolChecked} onClick={handleLogin}>
            微信扫码登录
          </Button>
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
        </div>
        <QrCode
          open={open}
          qrCode={qrCode}
          handleOpenChange={(val) => {
            setOpen(val);
          }}
        />
      </div>
    </div>
  );
}
