import request from '@/utils/request';

export enum TaskTypeEnums {
  REGISTER = 'register',
  CHECK = 'check',
  INVITE = 'invite',
  SHARE = 'share',
  GROUP = 'group',
  FOLLOW = 'follow',
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
};
