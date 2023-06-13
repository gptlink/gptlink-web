import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { StoreKey } from '@/constants';
import { streamAPI } from '../utils/stream-api';

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
  editConversation: (id: string, data: Partial<ConversationType>) => void;
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
      editConversation(id: string, data: Partial<ConversationType>) {
        const newConversationList = get().conversationList.map((item) => {
          if (item.uuid == id) {
            return {
              ...item,
              ...data,
            };
          } else {
            return item;
          }
        });

        set(() => ({
          conversationList: newConversationList,
        }));
      },
      delConversation(id: string) {
        let newConversationList = get().conversationList.filter((item) => item.uuid !== id);
        if (newConversationList.length === 0) {
          newConversationList = [DefaultConversation];
        }
        const newChatDataMap = get().chatDataMap;

        newChatDataMap[id] = [];

        set(() => ({
          chatDataMap: newChatDataMap,
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
        const currentConversationId = get().currentConversation.uuid;
        chatDataMap[currentConversationId] = newChatData;

        set({ chatDataMap, isStream: true });

        streamAPI.send({
          message: message,
          onProgress: (data) => {
            chatDataMap[currentConversationId] = [
              ...newChatData,
              { text: data, role: RoleTypeEnum.ASSISTANT, dateTime: new Date().toISOString() },
            ];
            set({ chatDataMap });
          },
          onFinish: () => {
            set({ isStream: false });
          },
          onError: () => {
            console.log(123);
          },
        });
      },
      currentChatData() {
        return get().chatDataMap[get().currentConversation.uuid] || [];
      },
      stopStream() {
        streamAPI.abort();
        set({ isStream: false });
      },
    }),
    {
      name: StoreKey.Chat,
    },
  ),
);
