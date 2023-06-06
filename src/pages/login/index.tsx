import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';
import { PrivacyProtocol, UseProtocol } from './Protocol';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate('/chat/1');
  };
  return (
    <>
      <div className="h-screen flex items-center ">
        <div className="md:w-4/12 w-4/6 m-auto flex pb-20 flex-col items-center">
          <img src="https://cdn.cblink.net/aiyaaa/ai-yaaa-logo.png" className="w-36 mb-4 rounded-full" />
          <div className="mt-4"> 人 . 机 . 对话 </div>
          <Button className="mt-12 mb-4 w-full" variant={'outline'} onClick={handleLogin}>
            微信扫码登录
          </Button>
          <div className="flex items-center text-xs">
            <Checkbox id="terms" className="mr-2" /> 我已阅读并同意
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
    </>
  );
}
