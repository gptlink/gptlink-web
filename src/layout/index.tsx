import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useBillingStore } from '@/store';
import useAuth from '@/hooks/useAuth';

import Header from './Header';

const App = () => {
  const [getCurrentBilling] = useBillingStore((state) => [state.getCurrentBilling]);
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/chat');
    }
    getCurrentBilling();
  }, []);

  useAuth();

  return (
    <div className="flex h-screen flex-col bg-white text-sm dark:bg-gray-900 dark:text-slate-100">
      <Header />
      <Outlet />
    </div>
  );
};

export default App;
