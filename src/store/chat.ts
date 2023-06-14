import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { StoreKey } from '@/constants';
import { streamAPI, StatusEnum } from '@/utils/stream-api';

export type ConversationType = {
  icon: string;
  uuid: string;
  title: string;
  system: string;
  modelId: string;
};

export enum RoleTypeEnum {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

export type ChatItemType = {
  text: string;
  error?: string;
  role: RoleTypeEnum;
  dateTime: string;
  messageId?: string;
  requestId?: string;
  status?: StatusEnum;
};

interface ChatState {
  isStream: boolean;
  currentConversation: ConversationType;
  conversationList: ConversationType[];
  chatDataMap: Record<string, ChatItemType[]>;
  addConversation: (title?: string, icon?: string, system?: string, modelId?: string) => void;
  switchConversation: (id: string) => void;
  clearCurrentConversation: () => void;
  editConversation: (id: string, data: Partial<ConversationType>) => void;
  delConversation: (id: string) => void;
  sendUserMessage: (message: string) => void;
  regenerateChat: (requestId?: string) => void;
  currentChatData: () => ChatItemType[];
  stopStream: () => void;
}

const DefaultConversation = {
  icon: '',
  uuid: uuidv4(),
  title: '新话题',
  system: '',
  modelId: '',
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
      addConversation(title = '新话题', icon = '', system = '', modelId = '') {
        const uuid = uuidv4();

        const newConversation = { title, uuid, icon, system, modelId };

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

        delete newChatDataMap[id];

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
        const requestId = uuidv4();

        const newChatData = [
          ...chatData,
          { text: message, role: RoleTypeEnum.USER, dateTime: new Date().toISOString(), requestId },
          {
            text: '',
            role: RoleTypeEnum.ASSISTANT,
            dateTime: new Date().toISOString(),
            requestId,
            status: StatusEnum.START,
          },
        ];

        const chatDataMap = get().chatDataMap;
        const currentConversationId = get().currentConversation.uuid;
        chatDataMap[currentConversationId] = newChatData;
        set({ chatDataMap, isStream: true });

        const lastId = chatData.filter((item) => item.role === RoleTypeEnum.ASSISTANT)?.pop()?.messageId;

        streamAPI.send({
          message: message,
          modelId: get().currentConversation.modelId,
          requestId,
          lastId,
          onProgress: (data) => {
            newChatData[newChatData.length - 1] = {
              text: data.messages,
              role: RoleTypeEnum.ASSISTANT,
              status: StatusEnum.PENDING,
              dateTime: new Date().toISOString(),
              messageId: data.id,
              requestId,
            };
            set({ chatDataMap });
          },
          onFinish: (data) => {
            newChatData[newChatData.length - 1] = {
              ...newChatData[newChatData.length - 1],
              text: data.messages,
              status: StatusEnum.SUCCESS,
            };
            set({ chatDataMap, isStream: false });
          },
          onError: (reason) => {
            newChatData[newChatData.length - 1] = {
              ...newChatData[newChatData.length - 1],
              error: reason,
              status: StatusEnum.ERROR,
            };
          },
        });
      },
      regenerateChat(requestId) {
        const chatData = get().currentChatData();
        const chatDataMap = get().chatDataMap;
        const currentConversationId = get().currentConversation.uuid;

        const userInputIndex = chatData.findIndex(
          (item) => item.role === RoleTypeEnum.USER && item.requestId === requestId,
        );
        const userInputText = chatData[userInputIndex].text;

        const lastId = chatData
          .slice(0, userInputIndex)
          .filter((item) => item.role === RoleTypeEnum.ASSISTANT)
          ?.pop()?.messageId;

        const assistantIndex = chatData.findIndex(
          (item) => item.role === RoleTypeEnum.ASSISTANT && item.requestId === requestId,
        );

        chatData[assistantIndex] = {
          ...chatData[assistantIndex],
          status: StatusEnum.START,
        };
        chatDataMap[currentConversationId] = chatData;
        set({ chatDataMap });

        streamAPI.send({
          message: userInputText,
          modelId: get().currentConversation.modelId,
          requestId,
          lastId,
          onProgress: (data) => {
            chatData[assistantIndex] = {
              text: data.messages,
              role: RoleTypeEnum.ASSISTANT,
              dateTime: new Date().toISOString(),
              messageId: data.id,
              status: StatusEnum.PENDING,
              requestId,
            };
            chatDataMap[currentConversationId] = chatData;
            set({ chatDataMap });
          },
          onFinish: (data) => {
            chatData[assistantIndex] = {
              text: data.messages,
              role: RoleTypeEnum.ASSISTANT,
              dateTime: new Date().toISOString(),
              messageId: data.id,
              status: StatusEnum.SUCCESS,
              requestId,
            };
            chatDataMap[currentConversationId] = chatData;
            set({ chatDataMap, isStream: false });
          },
          onError: (reason) => {
            chatData[chatData.length - 1] = {
              ...chatData[chatData.length - 1],
              error: reason,
              status: StatusEnum.ERROR,
            };
            set({ chatDataMap, isStream: false });
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
