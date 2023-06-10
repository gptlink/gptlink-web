import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { StoreKey } from '../constants';

export type ChatType = {
  icon: string;
  name: string;
  prompt: string;
  desc: string;
};

export type RoleType = {
  icon: string;
  name: string;
  prompt: string;
  desc: string;
};

interface ChatState {
  chatList: ChatType[];
}

const initialState = {
  chatList: [],
};

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      ...initialState,
      setChat(chatList: ChatType[]) {
        set({ chatList });
      },
    }),
    {
      name: StoreKey.Config,
    },
  ),
);
