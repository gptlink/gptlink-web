import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2Icon, UserPlus2 } from 'lucide-react';

import TaskService, { TaskType, TaskTypeEnums } from '@/api/task';
import { useUserStore, useBillingStore } from '@/store';
import { Button } from '@/components/ui/button';

const TypeActionMap = {
  [TaskTypeEnums.INVITE]: {
    button: '立即邀请',
    icon: <UserPlus2 />,
    completed: '已邀请',
  },
  [TaskTypeEnums.SHARE]: {
    button: '立即分享',
    icon: <Share2Icon />,
    completed: '立即分享',
  },
};

export default function User() {
  const [taskList, setTaskList] = useState<TaskType[]>([]);
  const [userInfo] = useUserStore((state) => [state.userInfo]);
  const [remaining] = useBillingStore((state) => [state.remaining()]);
  const navigate = useNavigate();

  useEffect(() => {
    const getTaskList = async () => {
      const res = await TaskService.getTaskList(1);
      setTaskList(res.filter((val) => val.type !== TaskTypeEnums.REGISTER));
    };
    getTaskList();
  }, []);

  const getTypeActionButton = (type: TaskTypeEnums) => {
    return TypeActionMap[type as Exclude<TaskTypeEnums, TaskTypeEnums.REGISTER>];
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-[32rem] -translate-y-3 rounded-xl border p-10 shadow-xl">
        <div className="flex max-w-5xl items-center gap-4 text-secondary-foreground">
          <img className="h-12 w-12 rounded-full" src={userInfo.avatar} />
          <h1 className="truncate text-2xl font-bold">{userInfo.nickname}</h1>
        </div>

        <div className="mt-4 flex items-center rounded-lg border-2 p-3">
          <div className="flex-1 items-center text-base font-bold">
            {remaining > 0 ? `🎉 有效次数：${remaining}次` : '可用余额不足'}
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
                  <Button variant={'secondary'} size={'sm'}>
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
    </div>
  );
}
