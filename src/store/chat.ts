import { create } from 'zustand';
import chatService from '@/api/chat';

export type RoleType = {
  icon: string;
  name: string;
  prompt: string;
  desc: string;
};

interface chatState {
  roleList: RoleType[];
  getRoleList: () => void;
}

const initDat = {
  roleList: [],
};

export const useChatStore = create<chatState>()((set) => ({
  ...initDat,
  getRoleList: async () => {
    const res = await chatService.getRoleList();
    set({ roleList: res });
  },
}));
