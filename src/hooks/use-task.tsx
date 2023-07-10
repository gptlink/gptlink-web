import toast from 'react-hot-toast';
import { isEmpty } from 'lodash-es';

import taskService, { TaskTypeEnums } from '@/api/task';
import { useUserStore } from '@/store';
import { useBillingStore } from '@/store';

const useTask = () => {
  const [isLogin] = useUserStore((state) => [state.isLogin()]);
  const [getCurrentBilling] = useBillingStore((state) => [state.getCurrentBilling]);

  // 分享成功
  async function shareCallback() {
    const type = TaskTypeEnums.SHARE;
    const { result } = await taskService.completionTask(type);
    if (!result) return;
    const unreadTask = await taskService.getUnreadTaskList(type);
    if (!isEmpty(unreadTask)) {
      // 修改记录为已读
      await taskService.readTask(type);
      getCurrentBilling();
      toast(() => (
        <div>
          <div className="bold text-lg">👏 今日分享已完成！</div>
          <div className="mt-4">
            {`${
              unreadTask.num === -1
                ? `您的对话使用时长将延长${unreadTask.expired_day}天`
                : `您的对话次数将增加${unreadTask.num}次`
            }
                ，请前往使用吧`}
          </div>
        </div>
      ));
    }
  }

  async function checkTask(type: TaskTypeEnums) {
    if (!isLogin) return;
    const { result } = await taskService.checkTask(type);
    if (!result) return;
    //查询未完成的任务
    const unreadTask = await taskService.getUnreadTaskList(type);
    if (!isEmpty(unreadTask)) {
      await taskService.readTask(type);
      getCurrentBilling();
      toast(() => (
        <div>
          <div className="bold text-lg">
            {type === TaskTypeEnums.REGISTER
              ? '👏 欢迎加入，尽情使用吧'
              : `👏 ${unreadTask.record_count}个好友加入，真给力！`}
          </div>
          {type === TaskTypeEnums.REGISTER ? (
            <div className="mt-4">
              {`您将有${
                unreadTask.num === -1
                  ? `${unreadTask.expired_day * unreadTask.record_count}天无限次`
                  : `${unreadTask.num * unreadTask.record_count}次`
              }机会与您的助理对话，请前往使用吧`}
            </div>
          ) : (
            <div className="mt-4">
              {`${
                unreadTask.num === -1
                  ? `+${unreadTask.expired_day * unreadTask.record_count}天对话时长`
                  : `+${unreadTask.num * unreadTask.record_count}次对话次数`
              }`}
            </div>
          )}
        </div>
      ));
    }
  }

  return {
    shareCallback,
    checkTask,
  };
};

export default useTask;
