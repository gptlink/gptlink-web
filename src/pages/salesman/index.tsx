import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import classNames from 'classnames';
import { ClipboardList } from 'lucide-react';

import TaskService, { SalesmanConfigType } from '@/api/task';
import { Button } from '@/components/ui/button';
import { useUserStore, useSalesmanStore } from '@/store';
import userService from '@/api/user';

import { ListScroll, TypeEnums } from './ListScroll';
import { WithdrawalDialog } from './WithdrawalDialog';
import { WithdrawalListDialog } from './WithdrawalListDialog';

export default function Salesman() {
  const [salesmanConfig, setSalesmanConfig] = useState<SalesmanConfigType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentType, setCurrentType] = useState(TypeEnums.CHILD);
  const [setUserInfo, { identity }] = useUserStore((state) => [state.setUserInfo, state.userInfo]);
  const [statistics, getSalesmanStatistics] = useSalesmanStore((state) => [
    state.statistics,
    state.getSalesmanStatistics,
  ]);

  useEffect(() => {
    const getSalesmanConfig = async () => {
      setIsLoading(true);
      const res = await TaskService.getSalesmanConfig();
      setSalesmanConfig(res);
      setIsLoading(false);
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
            <div className="relative flex flex-col items-center rounded-lg border-2 p-6">
              <WithdrawalListDialog>
                <ClipboardList className="absolute right-6 top-6 cursor-pointer text-base " />
              </WithdrawalListDialog>
              <div className="mb-4 flex-1 items-center text-base">
                剩余可提现：<span className="font-bold">{statistics.balance}</span>
              </div>
              <WithdrawalDialog>
                <Button size={'sm'} disabled={!Number(statistics.balance)}>
                  提现
                </Button>
              </WithdrawalDialog>
            </div>

            <div className="my-4 text-center text-base font-bold">当前佣金比例：{statistics.ratio}%</div>

            <div className="grid grid-cols-2 gap-2">
              <div
                className={classNames(
                  'col-span-1 flex flex-col items-center justify-center rounded-lg py-4 text-lg cursor-pointer',
                  {
                    'border-2': currentType === TypeEnums.CHILD,
                  },
                )}
                onClick={() => setCurrentType(TypeEnums.CHILD)}
              >
                {statistics.custom_num}
                <span className="text-xs">成功邀请客户数</span>
              </div>
              <div
                className={classNames(
                  'col-span-1 flex flex-col items-center justify-center rounded-lg py-4 text-lg cursor-pointer',
                  {
                    'border-2': currentType === TypeEnums.ORDER,
                  },
                )}
                onClick={() => setCurrentType(TypeEnums.ORDER)}
              >
                {statistics.order_price}
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
