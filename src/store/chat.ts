import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

import { StoreKey } from '../constants';

export type RoleType = {
  icon: string;
  name: string;
  prompt: string;
  desc: string;
};

export type ConversationType = {
  icon: string;
  uuid: string;
  title: string;
  system: string;
};

export enum RoleTypeEnum {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

export type ChatItemType = {
  text: string;
  role: RoleTypeEnum;
  dateTime: string;
};

interface ChatState {
  isStream: boolean;
  currentConversation: ConversationType;
  conversationList: ConversationType[];
  chatDataMap: Record<string, ChatItemType[]>;
  addConversation: (title?: string, icon?: string, system?: string) => void;
  switchConversation: (id: string) => void;
  clearCurrentConversation: () => void;
  delConversation: (id: string) => void;
  sendUserMessage: (message: string) => void;
  currentChatData: () => ChatItemType[];
  stopStream: () => void;
}

const DefaultConversation = {
  icon: '',
  uuid: '00001',
  title: '新话题',
  system: '',
};

const initialState = {
  isStream: false,
  currentConversation: DefaultConversation,
  conversationList: [DefaultConversation],
  chatDataMap: {},
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      ...initialState,
      addConversation(title = '新话题', icon = '', system = '') {
        const uuid = uuidv4();

        const newConversation = { title, uuid, icon, system };

        set((state) => ({
          currentConversation: newConversation,
          conversationList: [newConversation, ...state.conversationList],
          chatDataMap: {
            [uuid]: system ? [{ text: system, role: RoleTypeEnum.SYSTEM, dateTime: new Date().toISOString() }] : [],
            ...state.chatDataMap,
          },
        }));
      },
      switchConversation(id: string) {
        set((state) => ({
          currentConversation: state.conversationList.find((item) => item.uuid === id),
        }));
      },
      clearCurrentConversation() {
        const { uuid } = get().currentConversation;
        set((state) => ({
          chatDataMap: {
            ...state.chatDataMap,
            [uuid]: [],
          },
        }));
      },
      delConversation(id: string) {
        let newConversationList = get().conversationList.filter((item) => item.uuid !== id);
        if (newConversationList.length === 0) {
          newConversationList = [DefaultConversation];
        }
        const newChatDataMap = get().chatDataMap;

        delete newChatDataMap.id;

        set(() => ({
          newChatDataMap,
          conversationList: newConversationList,
        }));

        if (id === get().currentConversation.uuid) {
          set({ currentConversation: newConversationList[0] });
        }
      },
      sendUserMessage(message: string) {
        const chatData = get().currentChatData();
        const newChatData = [
          ...chatData,
          { text: message, role: RoleTypeEnum.USER, dateTime: new Date().toISOString() },
        ];
        const chatDataMap = get().chatDataMap;
        chatDataMap[get().currentConversation.uuid] = newChatData;
        set({ chatDataMap, isStream: true });
      },
      currentChatData() {
        return get().chatDataMap[get().currentConversation.uuid] || [];
      },
      stopStream() {
        set({ isStream: false });
      },
    }),
    {
      name: StoreKey.Chat,
    },
  ),
);
