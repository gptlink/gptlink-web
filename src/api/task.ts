import request from '@/utils/request';

export enum TaskTypeEnums {
  REGISTER = 'register',
  INVITE = 'invite',
  SHARE = 'share',
  SALESMAN = 'salesman',
}

export interface TaskType {
  id: number;
  type: TaskTypeEnums;
  title: string;
  desc: string;
  is_completed: boolean;
  is_subscribe: boolean;
  model_count: 0;
}

export interface SalesmanConfigType {
  enable: boolean;
  open: boolean;
  rules: string;
}

export default {
  getTaskList(platform: number): Promise<TaskType[]> {
    return request(`task?platform=${platform}`);
  },
  checkTask(type: TaskTypeEnums): Promise<{ result: boolean }> {
    return request('task/check', { method: 'post', body: JSON.stringify({ type }) });
  },
  completionTask(type: TaskTypeEnums): Promise<{ result: boolean }> {
    return request('task/completion', { method: 'post', body: JSON.stringify({ type }) });
  },
  getUnreadTaskList(type: TaskTypeEnums): Promise<{
    type: TaskTypeEnums;
    expired_day: number;
    package_name: string;
    num: number;
    record_count: number;
  }> {
    return request(`/task/record/unread?type=${type}`);
  },
  readTask(type: TaskTypeEnums): Promise<{
    type: TaskTypeEnums;
    expired_day: string;
    package_name: string;
    num: number;
    record_count: number;
  }> {
    return request(`task/record/${type}/read`, { method: 'put' });
  },
  getSalesmanConfig(): Promise<SalesmanConfigType> {
    return request(`config/salesman`);
  },
};
