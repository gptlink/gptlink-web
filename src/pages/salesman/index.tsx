import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import classNames from 'classnames';

import TaskService, { SalesmanConfigType } from '@/api/task';
import salesmanService, { SalesmanStatisticsType } from '@/api/salesman';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store';
import userService from '@/api/user';

import { ListScroll, TypeEnums } from './ListScroll';

export default function Salesman() {
  const [salesmanConfig, setSalesmanConfig] = useState<SalesmanConfigType | null>(null);
  const [salesmanStatistics, setSalesmanStatistics] = useState<SalesmanStatisticsType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentType, setCurrentType] = useState(TypeEnums.CHILD);
  const [setUserInfo, { identity }] = useUserStore((state) => [state.setUserInfo, state.userInfo]);

  useEffect(() => {
    const getSalesmanConfig = async () => {
      setIsLoading(true);
      const res = await TaskService.getSalesmanConfig();
      setSalesmanConfig(res);
      setIsLoading(false);
    };

    const getSalesmanStatistics = async () => {
      const res = await salesmanService.getSalesmanStatistics();
      setSalesmanStatistics(res);
    };

    getSalesmanConfig();
    getSalesmanStatistics();
  }, []);

  // 成为分销员
  const handleBecomeSalesman = async () => {
    await userService.becomeSalesman();
    toast.success('申请分销员成功');
    const res = await userService.getUserProfile();
    setUserInfo(res);
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      <div
        className={classNames('mx-auto max-w-7xl overflow-auto py-6', {
          flex: identity === 2,
        })}
      >
        {isLoading ? (
          <Loader2 className="m-auto my-16 animate-spin" />
        ) : identity === 1 ? (
          <div className="px-6">
            <div dangerouslySetInnerHTML={{ __html: salesmanConfig?.rules || '' }}></div>
            {salesmanConfig?.enable && salesmanConfig?.open && (
              <Button className="mx-auto my-8 flex" onClick={() => handleBecomeSalesman()}>
                申请成为分销员
              </Button>
            )}
          </div>
        ) : (
          <div className="mx-auto flex w-[32rem] -translate-y-3 flex-col rounded-xl border p-10 max-sm:w-[22rem] max-sm:p-5">
            <div className="flex flex-col items-center rounded-lg border-2 p-6">
              {/* mb-4 */}
              <div className="flex-1 items-center text-base">
                剩余可提现：<span className="font-bold">{salesmanStatistics?.balance || '0.00'}</span>
              </div>
              {/* <Button size={'sm'}>提现</Button> */}
            </div>

            <div className="my-4 text-center text-base font-bold">当前佣金比例：{salesmanStatistics?.ratio || 0}%</div>

            <div className="grid grid-cols-2 gap-2">
              <div
                className={classNames(
                  'col-span-1 flex flex-col items-center justify-center bg-gray-100 py-4 text-lg cursor-pointer',
                  {
                    'border-2': currentType === TypeEnums.CHILD,
                  },
                )}
                onClick={() => setCurrentType(TypeEnums.CHILD)}
              >
                {salesmanStatistics?.custom_num}
                <span className="text-xs">成功邀请客户数</span>
              </div>
              <div
                className={classNames(
                  'col-span-1 flex flex-col items-center justify-center bg-gray-100 py-4 text-lg cursor-pointer',
                  {
                    'border-2': currentType === TypeEnums.ORDER,
                  },
                )}
                onClick={() => setCurrentType(TypeEnums.ORDER)}
              >
                {salesmanStatistics?.order_price}
                <span className="text-xs">获得总佣金（元）</span>
              </div>
            </div>

            <div className="mt-4 flex-1 overflow-hidden">
              <ListScroll
                style={{ display: currentType === TypeEnums.CHILD ? 'block' : 'none' }}
                type={TypeEnums.CHILD}
              />
              <ListScroll
                style={{ display: currentType === TypeEnums.ORDER ? 'block' : 'none' }}
                type={TypeEnums.ORDER}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
