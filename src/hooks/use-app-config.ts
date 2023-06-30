import { useEffect } from 'react';

import appService from '@/api/app';
import { useAppStore } from '@/store';

const useAppConfig = () => {
  const [setAppConfig, appConfig] = useAppStore((state) => [state.setAppConfig, state.appConfig]);

  useEffect(() => {
    const getAppConfig = async () => {
      const res = await appService.getAppConfig();
      setAppConfig(res);
    };

    getAppConfig();
  }, []);

  return appConfig;
};

export default useAppConfig;
