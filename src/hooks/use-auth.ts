import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import userService from '@/api/user';
import { useUserStore } from '@/store';

const useAuth = () => {
  const [setUserInfo, signOut] = useUserStore((state) => [state.setUserInfo, state.signOut]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const res = await userService.getUserProfile();
        setUserInfo(res);
        if (location.pathname === '/login') {
          navigate('/chat');
        }
      } catch (e) {
        navigate('/login');
        signOut();
      }
    };

    getUserProfile();
  }, []);
};

export default useAuth;
