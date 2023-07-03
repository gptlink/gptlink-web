import { useState, useRef, useEffect, useMemo } from 'react';
import { Loader2, PauseOctagon, SendIcon, Trash2Icon, DownloadIcon, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { StoreKey } from '@/constants';
import { useChatStore, useUserStore } from '@/store';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import IconSvg from '@/components/Icon';
import { Checkbox } from '@/components/ui/checkbox';
import { useMobileScreen } from '@/hooks/use-mobile-screen';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import MessageExporter from './MessageExporter';
import { ChatItem } from './ChatItem';
import classNames from 'classnames';

let scrollIntoViewTimeId = -1;

const Footer = ({
  isDownload = false,
  selectedMessagesIDs,
  onIsDownloadChange,
  onSelectMessagesIds,
}: {
  isDownload: boolean;
  selectedMessagesIDs: string[];
  onIsDownloadChange: (val: boolean) => void;
  onSelectMessagesIds: (ids: string[]) => void;
}) => {
  const [userInput, setUserInput] = useState('');
  const [sendUserMessage, isStream, clearCurrentConversation, stopStream, currentChatData] = useChatStore((state) => [
    state.sendUserMessage,
    state.isStream,
    state.clearCurrentConversation,
    state.stopStream,
    state.currentChatData(),
  ]);
  const [{ openid }] = useUserStore((state) => [state.userInfo]);
  const isMobileScreen = useMobileScreen();
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.code === 'Enter' && !e.shiftKey && userInput.replace(/\n/g, '')) {
      handleSendUserMessage();
    }
  };
  const navigator = useNavigate();

  const handleSendUserMessage = async () => {
    if (!localStorage.getItem(StoreKey.AccessToken)) {
      toast.error('请登录');
      return navigator('/login');
    }
    sendUserMessage(userInput);
    setUserInput('');
    setTimeout(() => {
      textAreaRef.current?.focus();
    }, 1000);
  };

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const exportMessages = useMemo(() => {
    return currentChatData.filter((item) => {
      return selectedMessagesIDs.includes(item.id);
    });
  }, [onSelectMessagesIds]);

  const allMessagesIds = useMemo(() => {
    return currentChatData.map((item) => item.id);
  }, [currentChatData]);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = '0px';
      const scrollHeight = textAreaRef.current.scrollHeight;
      textAreaRef.current.style.height = scrollHeight + 4 + 'px';
    }
  }, [textAreaRef, userInput]);

  return (
    <footer
      className={classNames('flex items-end gap-4 p-4', {
        'border-t items-center justify-between': isDownload,
      })}
    >
      {!isDownload ? (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 w-9 p-0">
                <MoreHorizontal size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align={'end'}>
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={() => {
                  if (confirm('你确定要清除所有的消息吗？')) {
                    clearCurrentConversation();
                    setUserInput('');
                  }
                }}
              >
                <Trash2Icon size={16} /> 清空消息
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={() => {
                  onIsDownloadChange(true);
                }}
              >
                <DownloadIcon size={16} />
                对话海报
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="relative flex-1">
            {isStream && (
              <div className="absolute left-0 z-10 flex w-full justify-center">
                <Button variant="destructive" onClick={() => stopStream()}>
                  <PauseOctagon />
                </Button>
              </div>
            )}
            <Textarea
              ref={textAreaRef}
              className={classNames('h-10 max-h-[7rem] min-h-[20px] w-full flex-1 resize-none scroll-bar-none', {
                'blur-sm': isStream,
              })}
              onKeyDown={handleKeyDown}
              disabled={isStream}
              value={userInput}
              placeholder={isMobileScreen ? '来说点什么...' : '来说点什么...（Shift + Enter = 换行）'}
              onChange={(val) => setUserInput(val.target.value)}
            />
          </div>
          <Button
            disabled={isStream || !userInput.replace(/\n/g, '')}
            onClick={() => {
              handleSendUserMessage();
            }}
          >
            {!isStream ? <SendIcon /> : <Loader2 className="m-auto my-32 animate-spin" />}
          </Button>
        </>
      ) : (
        <>
          <div className="flex items-center">
            <Checkbox
              checked={selectedMessagesIDs.length === allMessagesIds.length}
              className="mr-2"
              onCheckedChange={(val) => {
                if (val) {
                  onSelectMessagesIds(allMessagesIds);
                } else {
                  onSelectMessagesIds([]);
                }
              }}
            />
            全选
          </div>
          <MessageExporter messages={exportMessages} shareUrl={location.origin + `/chat?shareOpenId=${openid}`} />
          <Button
            variant={'destructive'}
            onClick={() => {
              onIsDownloadChange(false);
            }}
          >
            取消
          </Button>
        </>
      )}
    </footer>
  );
};

const ChatBody = ({
  isDownload,
  selectedMessagesIDs,
  onSelectMessagesIds,
}: {
  isDownload: boolean;
  selectedMessagesIDs: string[];
  onSelectMessagesIds: (ids: string[]) => void;
}) => {
  const [isStream, currentChatData] = useChatStore((state) => [state.isStream, state.currentChatData()]);

  const bottom = useRef<HTMLDivElement>(null);

  const scrollLastMessageIntoView = (behavior: ScrollBehavior = 'smooth') => {
    if (!bottom.current) return;
    bottom.current.scrollIntoView({ behavior, block: 'end' });
  };

  useEffect(() => {
    scrollLastMessageIntoView('auto');
  }, []);

  useEffect(() => {
    if (isStream) {
      scrollLastMessageIntoView();
      scrollIntoViewTimeId = setInterval(() => {
        scrollLastMessageIntoView();
      }, 1000);
    } else {
      clearInterval(scrollIntoViewTimeId);
    }
  }, [isStream]);

  return (
    <div className="scroll-bar-none flex-1 overflow-y-auto overflow-x-hidden">
      <main className="m-auto w-full max-w-screen-xl overflow-auto p-4" ref={bottom}>
        {currentChatData.length === 0 && (
          <div className="m-auto mt-2 w-fit text-center text-secondary-foreground">
            <IconSvg className="mr-1 inline-block w-10" />
            开始提问吧～
          </div>
        )}
        {currentChatData.map((item, index) => (
          <ChatItem
            key={index}
            data={item}
            isCheckedMode={isDownload}
            isChecked={selectedMessagesIDs.includes(item.id || '')}
            onCheckedChange={(val) => {
              if (val) {
                onSelectMessagesIds(selectedMessagesIDs.concat(item.id));
              } else {
                onSelectMessagesIds(selectedMessagesIDs.filter((id) => id !== item.id));
              }
            }}
          />
        ))}
      </main>
    </div>
  );
};

const Chat = () => {
  const [isDownload, setIsDownload] = useState(false);
  const [selectedMessagesIDs, setSelectedMessagesIDs] = useState<string[]>([]);

  useEffect(() => {
    if (!isDownload) {
      setSelectedMessagesIDs([]);
    }
  }, [isDownload]);
  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <ChatBody
        isDownload={isDownload}
        selectedMessagesIDs={selectedMessagesIDs}
        onSelectMessagesIds={(ids: string[]) => setSelectedMessagesIDs(ids)}
      />
      <Footer
        selectedMessagesIDs={selectedMessagesIDs}
        isDownload={isDownload}
        onIsDownloadChange={(val) => setIsDownload(val)}
        onSelectMessagesIds={(ids: string[]) => setSelectedMessagesIDs(ids)}
      />
    </div>
  );
};

export default Chat;
