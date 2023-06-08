import { redirect } from 'react-router-dom';
import userServices from '@/api/user';

export const authLoader = async () => {
  try {
    await userServices.getUserProfile();
    return null;
  } catch {
    return redirect('/login');
  }
};
