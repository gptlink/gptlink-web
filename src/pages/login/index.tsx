import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';
import { PrivacyProtocol, UseProtocol } from './Protocol';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [protocolChecked, setProtocolChecked] = useState(false);

  const navigate = useNavigate();
  const handleLogin = () => {
    navigate('/chat');
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-l from-blue-400 to-emerald-400 ">
      <div className="md:w-4/12 w-4/6 m-auto flex pb-20 pt-10 flex-col bg-white items-center shadow rounded-xl">
        <img src="https://cdn.cblink.net/aiyaaa/ai-yaaa-logo.png" className="w-36 mb-4 rounded-full" />
        <div className="mt-4"> 人 . 机 . 对话 </div>
        <Button className="mt-12 mb-4 w-[50%]" variant={'outline'} disabled={!protocolChecked} onClick={handleLogin}>
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
          和
          <UseProtocol>
            <span className="text-blue-600">《使用协议》</span>
          </UseProtocol>
        </div>
      </div>
    </div>
  );
}
