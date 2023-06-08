import Cookies from 'js-cookie';
import { StoreKey } from '@/constants';
export const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;

const request = async (url: string, options: RequestInit = {}) => {
  const access_token = localStorage.getItem(StoreKey.ACCESS_TOKEN);

  options.headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${access_token}`,
  };

  try {
    const response = await fetch(`${API_DOMAIN}/${url}`, options);
    if (response.status === 204) {
      return response.text();
    }

    if (response.status >= 200 && response.status <= 300) {
      const data = await response.json();
      if (data.err_code > 0) {
        throw data.err_msg;
      }
      return data.data;
    }

    if (response.status === 401) {
      const res = response.json();
      Cookies.remove('auth.token');
      throw res;
    }

    if (response.status > 401) {
      const res = response.json();
      throw res;
    }
  } catch {
    throw { result: '网络错误', status: 500 };
  }
};

export default request;
