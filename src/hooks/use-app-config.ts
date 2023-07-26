import { useEffect } from 'react';

import appService from '@/api/app';
import { useAppStore } from '@/store';

const useAppConfig = () => {
  const [setAppConfig, appConfig] = useAppStore((state) => [state.setAppConfig, state.appConfig]);

  useEffect(() => {
    const getAppConfig = async () => {
      const [appConfig, loginType, paymentConfig] = await Promise.all([
        appService.getAppConfig(),
        appService.getLoginType(),
        appService.getPaymentConfig(),
      ]);
      setAppConfig({ ...appConfig, ...loginType, ...paymentConfig });
      document.title = appConfig.name;
    };

    getAppConfig();
  }, []);

  return appConfig;
};

export default useAppConfig;
