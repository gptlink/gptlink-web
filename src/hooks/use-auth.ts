import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '@/api/user';
import { useUserStore } from '@/store';

const useAuth = () => {
  const [setUserInfo] = useUserStore((state) => [state.setUserInfo]);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const res = await userService.getUserProfile();
        setUserInfo(res);
      } catch (e) {
        navigate('/login');
      }
    };

    getUserProfile();
  }, []);
};

export default useAuth;
