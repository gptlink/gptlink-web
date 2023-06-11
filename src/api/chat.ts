import request from '@/utils/request';

export interface RoleType {
  icon: string;
  name: string;
  prompt: string;
  desc: string;
}

export default {
  getRoleList(): Promise<RoleType[]> {
    return request(`chat-gpt-model?platform=1&is_all=true`);
  },
};
