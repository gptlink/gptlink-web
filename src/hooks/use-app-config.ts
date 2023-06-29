import { useEffect } from 'react';
import { isEmpty } from 'lodash-es';

import appService from '@/api/app';
import { useAppStore } from '@/store';

const useAppConfig = () => {
  const [setAppConfig, appConfig] = useAppStore((state) => [state.setAppConfig, state.appConfig]);

  useEffect(() => {
    const getAppConfig = async () => {
      if (!isEmpty(appConfig)) return;
      const res = await appService.getAppConfig();
      setAppConfig(res);
    };

    getAppConfig();
  }, []);

  return appConfig;
};

export default useAppConfig;
