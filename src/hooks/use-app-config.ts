import { useEffect } from 'react';

import appService from '@/api/app';
import { useAppStore } from '@/store';

const useAppConfig = () => {
  const [setAppConfig, appConfig] = useAppStore((state) => [state.setAppConfig, state.appConfig]);

  useEffect(() => {
    const getAppConfig = async () => {
      const [res, loginType] = await Promise.all([appService.getAppConfig(), appService.getLoginType()]);
      setAppConfig({ ...res, ...loginType });
      document.title = res.name;
    };

    getAppConfig();
  }, []);

  return appConfig;
};

export default useAppConfig;
