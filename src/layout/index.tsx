import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import useAuth from '@/hooks/use-auth';
import useAppConfig from '@/hooks/use-app-config';
import { useMobileScreen } from '@/hooks/use-mobile-screen';
import { useAppStore } from '@/store';

import Header from './Header';
import { TitleHeader } from './TitleHeader';
import TabBar from './TabBar';

const App = () => {
  const isMobileScreen = useMobileScreen();
  const navigate = useNavigate();
  const [theme, setTheme] = useAppStore((state) => [state.theme, state.setTheme]);

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/chat');
    }
    setTheme(theme);
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
