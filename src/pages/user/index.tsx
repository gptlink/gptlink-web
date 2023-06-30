import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2Icon, UserPlus2 } from 'lucide-react';

import TaskService, { TaskType, TaskTypeEnums } from '@/api/task';
import { useUserStore, useBillingStore, useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { ShareDialog } from './ShareDialog';
import { toast } from 'react-hot-toast';

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
};

export default function User() {
  const [taskList, setTaskList] = useState<TaskType[]>([]);
  const [shareDialogShow, setShareDialogShow] = useState(false);
  const [{ avatar, nickname, openid }] = useUserStore((state) => [state.userInfo]);
  const [currentBill, remaining, getCurrentBilling] = useBillingStore((state) => [
    state.currentBill,
    state.remaining(),
    state.getCurrentBilling,
  ]);
  const [appConfig] = useAppStore((state) => [state.appConfig]);
  const navigate = useNavigate();

  useEffect(() => {
    const getTaskList = async () => {
      const res = await TaskService.getTaskList(1);
      setTaskList(res.filter((val) => val.type !== TaskTypeEnums.REGISTER));
    };
    getTaskList();
    getCurrentBilling();
  }, []);

  const getTypeActionButton = (type: TaskTypeEnums) => {
    return TypeActionMap[type as Exclude<TaskTypeEnums, TaskTypeEnums.REGISTER>];
  };

  const handleClick = async (item: TaskType) => {
    try {
      await TaskService.completionTask(item.type);
      toast.success('任务完成');
    } catch (e) {
      toast.error(e as string);
    }

    setShareDialogShow(true);
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-[32rem] -translate-y-3 rounded-xl border p-10 shadow-xl">
        <div className="flex max-w-5xl items-center gap-4 text-secondary-foreground">
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatar || appConfig.user_logo} alt={nickname} />
            <AvatarFallback>{nickname.slice(0, 1)?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <h1 className="truncate text-3xl font-bold">{nickname}</h1>
        </div>

        <div className="mt-4 flex items-center rounded-lg border-2 p-3">
          <div className="flex-1 items-center text-base font-bold">
            {remaining > 0 || remaining === -1
              ? `🎉 有效次数：${remaining === -1 ? '无限' : remaining}次`
              : '☹️ 可用余额不足'}
            {currentBill?.expired_at && remaining === -1 && (
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
                  <Button variant={'secondary'} size={'sm'} onClick={() => handleClick(item)}>
                    {item.is_completed
                      ? getTypeActionButton(item.type).completed
                      : getTypeActionButton(item.type).button}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ShareDialog
        open={shareDialogShow}
        shareUrl={location.origin + `/chat?shareOpenId=${openid}`}
        handleOpenChange={(val) => setShareDialogShow(val)}
      />
    </div>
  );
}
