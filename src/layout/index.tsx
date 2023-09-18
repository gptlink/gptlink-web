import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import useAuth from '@/hooks/use-auth';
import useAppConfig from '@/hooks/use-app-config';
import { useMobileScreen } from '@/hooks/use-mobile-screen';
import useWechat from '@/hooks/use-wechat';
import useTask from '@/hooks/use-task';
import useShareOpenid from '@/hooks/use-share-openid';

import { TaskTypeEnums } from '@/api/task';

import Header from './Header';
import { TitleHeader } from './TitleHeader';
import TabBar from './TabBar';

const App = () => {
  const isMobileScreen = useMobileScreen();
  const navigate = useNavigate();
  const { setWeixinShare } = useWechat();
  const { checkTask } = useTask();

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/chat');
    }
    setWeixinShare();
    checkTask(TaskTypeEnums.REGISTER);
    checkTask(TaskTypeEnums.INVITE);
  }, []);

  useAuth();
  useAppConfig();
  useShareOpenid();

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {!isMobileScreen ? <Header /> : <TitleHeader />}
      <Outlet />
      {isMobileScreen && !location.pathname.includes('salesman') && <TabBar />}
    </div>
  );
};

export default App;
