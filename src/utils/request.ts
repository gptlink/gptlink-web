import Cookies from 'js-cookie';

export const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;

const request = async (url: string, options: RequestInit = {}) => {
  const token = Cookies.get('auth.token');
  options.headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await fetch(`${API_DOMAIN}/api/${url}`, options);
    if (response.status === 204) {
      return response.text();
    }

    if (response.status >= 200 && response.status <= 300) {
      return response.json();
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
