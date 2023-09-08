import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2Icon, UserPlus2, JapaneseYenIcon } from 'lucide-react';

import TaskService, { TaskType, TaskTypeEnums } from '@/api/task';
import { useUserStore, useBillingStore, useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useMobileScreen } from '@/hooks/use-mobile-screen';

import { ShareDialog } from './ShareDialog';

const TypeActionMap = {
  [TaskTypeEnums.INVITE]: {
    button: '立即邀请',
    icon: <UserPlus2 />,
    completed: '立即邀请',
  },
  [TaskTypeEnums.SHARE]: {
    button: '立即分享',
    icon: <Share2Icon />,
    completed: '立即分享',
  },
  [TaskTypeEnums.SALESMAN]: {
    button: '成为分销员',
    icon: <JapaneseYenIcon />,
    completed: '立即前往',
  },
};

export default function User() {
  const [taskList, setTaskList] = useState<TaskType[]>([]);
  const [shareDialogShow, setShareDialogShow] = useState(false);
  const [activeType, setActiveType] = useState<TaskTypeEnums>();
  const [{ avatar, nickname, openid, identity }, signOut] = useUserStore((state) => [state.userInfo, state.signOut]);
  const [currentBill, remaining, getCurrentBilling] = useBillingStore((state) => [
    state.currentBill,
    state.remaining(),
    state.getCurrentBilling,
  ]);
  const [appConfig] = useAppStore((state) => [state.appConfig]);
  const navigate = useNavigate();
  const isMobileScreen = useMobileScreen();

  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  useEffect(() => {
    const getTaskList = async () => {
      const salesman = await getSalesmanConfig();
      const res = await TaskService.getTaskList(1);
      const list: TaskType[] = [...(salesman || []), ...res];
      setTaskList(list.filter((val) => val.type !== TaskTypeEnums.REGISTER));
    };
    // 获取分销配置
    const getSalesmanConfig = async (): Promise<TaskType[] | null> => {
      const { open, enable } = await TaskService.getSalesmanConfig();
      return (enable && open) || (!open && identity === 2)
        ? [
            {
              id: 0,
              type: TaskTypeEnums.SALESMAN,
              title: '分销赚钱',
              desc: '邀请好友，赚取佣金',
              is_completed: identity === 2,
              is_subscribe: true,
              model_count: 0,
            },
          ]
        : null;
    };
    getTaskList();
    getCurrentBilling();
  }, []);

  const getTypeActionButton = (type: TaskTypeEnums) => {
    return TypeActionMap[type as Exclude<TaskTypeEnums, TaskTypeEnums.REGISTER>];
  };

  const handleDialogClick = async (type: TaskTypeEnums) => {
    setShareDialogShow(true);
    setActiveType(type);
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-[32rem] -translate-y-3 rounded-xl border p-10 shadow-xl max-sm:w-[22rem] max-sm:p-5">
        <div className="flex max-w-5xl items-center gap-4 text-secondary-foreground">
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatar || appConfig.user_logo} alt={nickname} />
            <AvatarFallback>{nickname.slice(0, 1)?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <h1 className="truncate text-3xl font-bold">{nickname}</h1>
        </div>

        <div className="mt-4 flex items-center rounded-lg border-2 p-3">
          <div className="flex-1 items-center text-base font-bold">
            {remaining > 0 || currentBill?.num === -1
              ? `🎉 有效次数：${currentBill?.num === -1 ? '无限' : remaining}次`
              : '☹️ 可用余额不足'}
            {/* 时长类型的，num 为 -1 */}
            {currentBill?.expired_at && currentBill.num === -1 && (
              <div className="mt-1">{`⏰ 有效期至：${currentBill.expired_at}`}</div>
            )}
          </div>
          <Button size={'sm'} onClick={() => navigate('/billing')}>
            去充值
          </Button>
        </div>

        <div className="mt-4">
          <div className="text-base font-semibold">任务列表</div>
          <div className="mt-4 flex flex-col gap-2">
            {taskList.map((item, index) => (
              <div key={index} className="rounded-lg bg-primary p-3 text-primary-foreground">
                <div className="flex items-center gap-4">
                  {getTypeActionButton(item.type).icon}
                  <div className="flex-1">
                    <div className="flex-1 truncate text-base font-medium">{item.title}</div>
                    <p className="mt-1 truncate text-xs">{item.desc}</p>
                  </div>
                  <Button
                    variant={'secondary'}
                    size={'sm'}
                    onClick={() =>
                      item.type === TaskTypeEnums.SALESMAN ? navigate('/salesman') : handleDialogClick(item.type)
                    }
                  >
                    {item.is_completed
                      ? getTypeActionButton(item.type).completed
                      : getTypeActionButton(item.type).button}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {isMobileScreen && (
          <Button variant={'destructive'} className="mt-10 w-full" onClick={() => handleSignOut()}>
            退出登陆
          </Button>
        )}
      </div>
      <ShareDialog
        open={shareDialogShow}
        type={activeType}
        shareUrl={location.origin + `/chat?shareOpenId=${openid}`}
        handleOpenChange={(val) => setShareDialogShow(val)}
      />
    </div>
  );
}
