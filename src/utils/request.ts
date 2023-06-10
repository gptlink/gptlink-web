import { StoreKey } from '@/constants';
export const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;

const request = async (url: string, options: RequestInit = {}) => {
  const access_token = localStorage.getItem(StoreKey.AccessToken);

  options.headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${access_token}`,
  };

  const response = await fetch(`${API_DOMAIN}/${url}`, options);

  if (response.status >= 200 && response.status <= 300) {
    const data = await response.json();
    if (data.err_code > 0) {
      throw data.err_msg;
    }
    return data.data;
  }
};

export default request;
