import request from '@/utils/request';

export enum TaskTypeEnums {
  REGISTER = 'register',
  INVITE = 'invite',
  SHARE = 'share',
}

export interface TaskType {
  type: TaskTypeEnums;
  title: string;
  desc: string;
  is_completed: boolean;
  is_subscribe: boolean;
  model_count: 0;
}

export default {
  getTaskList(platform: number): Promise<TaskType[]> {
    return request(`task?platform=${platform}`);
  },
  completionTask(type: TaskTypeEnums): Promise<void> {
    return request('task/completion', { method: 'post', body: JSON.stringify({ type }) });
  },
};
