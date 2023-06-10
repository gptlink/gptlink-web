import request from '@/utils/request';

export default {
  getTaskList<resType>(platform: number) {
    return request(`task?platform=${platform}`) as resType;
  },
};
