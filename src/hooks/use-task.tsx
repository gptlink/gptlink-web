import taskService, { TaskTypeEnums } from '@/api/task';
import toast from 'react-hot-toast';
import { StoreKey } from '@/constants';

const useTask = () => {
  // 分享成功
  async function shareCallback() {
    const type = TaskTypeEnums.SHARE;
    const unreadTaskList = await taskService.getUnreadTaskList(type);
    if (unreadTaskList && unreadTaskList.length) {
      const data = unreadTaskList[0];
      // 修改记录为已读
      await taskService.readTask(type);
      toast(() => (
        <div>
          <div className="bold text-lg">👏 今日分享已完成！</div>
          <div className="mt-4">
            {`${data.num === -1 ? `您的对话使用时长将延长${data.expired_day}天` : `您的对话次数将增加${data.num}次`}
              ，请前往使用吧`}
          </div>
        </div>
      ));
    }
  }

  async function checkTask(type: TaskTypeEnums) {
    if (!localStorage.getItem(StoreKey.AccessToken)) return;
    const { result } = await taskService.checkTask(type);
    if (!result) return;
    //查询未完成的任务
    const unreadTaskList = await taskService.getUnreadTaskList(type);
    const data = unreadTaskList[0];
    if (unreadTaskList && unreadTaskList.length) {
      await taskService.readTask(type);
      toast(() => (
        <div>
          <div className="bold text-lg">
            {type === TaskTypeEnums.REGISTER
              ? '👏 欢迎加入，尽情使用吧'
              : `👏 ${data.record_count}个好友加入，真给力！`}
          </div>
          {type === TaskTypeEnums.REGISTER ? (
            <div className="mt-4">
              {`您将有${
                data.num === -1
                  ? `${data.expired_day * data.record_count}天无限次`
                  : `${data.num * data.record_count}次`
              }机会与您的助理对话，请前往使用吧`}
            </div>
          ) : (
            <div className="mt-4">
              {`${
                data.num === -1
                  ? `+${data.expired_day * data.record_count}天对话时长`
                  : `+${data.num * data.record_count}次对话次数`
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
