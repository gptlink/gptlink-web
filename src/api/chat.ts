import request from '@/utils/request';

export default {
  getRoleList() {
    return request(`chat-gpt-model?platform=1&is_all=true`);
  },
};
