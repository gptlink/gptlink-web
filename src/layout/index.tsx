import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import useAuth from '@/hooks/use-auth';

import Header from './Header';

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/chat');
    }
  }, []);

  useAuth();

  return (
    <div className="flex h-screen flex-col ">
      <Header />
      <Outlet />
    </div>
  );
};

export default App;
