import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import useAuth from '@/hooks/use-auth';
import useAppConfig from '@/hooks/use-app-config';
import { useMobileScreen } from '@/hooks/use-mobile-screen';

import Header from './Header';
import { TitleHeader } from './TitleHeader';
import TabBar from './TabBar';

const App = () => {
  const isMobileScreen = useMobileScreen();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/chat');
    }
  }, []);

  useAuth();
  useAppConfig();

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {!isMobileScreen ? <Header /> : <TitleHeader />}
      <Outlet />
      {isMobileScreen && <TabBar />}
    </div>
  );
};

export default App;
