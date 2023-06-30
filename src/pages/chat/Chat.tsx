import { useState, useRef, useEffect } from 'react';
import { Loader2, PauseOctagon, SendIcon, Trash2Icon, DownloadIcon } from 'lucide-react';

import { useChatStore } from '@/store';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import IconSvg from '@/components/Icon';
import { Checkbox } from '@/components/ui/checkbox';
import MessageExporter from './MessageExporter';

import { ChatItem } from './ChatItem';
import classNames from 'classnames';

let scrollIntoViewTimeId = -1;
const Footer = () => {
  const [userInput, setUserInput] = useState('');
  const [isDownload, setIsDownload] = useState(false);
  const [sendUserMessage, isStream, clearCurrentConversation, stopStream, currentChatData] = useChatStore((state) => [
    state.sendUserMessage,
    state.isStream,
    state.clearCurrentConversation,
    state.stopStream,
    state.currentChatData(),
  ]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.code === 'Enter' && !e.shiftKey && userInput.replace(/\n/g, '')) {
      handleSendUserMessage();
    }
  };

  const handleSendUserMessage = async () => {
    sendUserMessage(userInput);
    setUserInput('');
    setTimeout(() => {
      textAreaRef.current?.focus();
    }, 1000);
  };

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

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
          <div className="flex gap-1">
            <Button
              variant={'ghost'}
              className="mb-1 h-9 w-9 shrink-0 rounded-full p-0"
              disabled={isStream}
              onClick={() => {
                if (confirm('你确定要清除所有的消息吗？')) {
                  clearCurrentConversation();
                  setUserInput('');
                }
              }}
            >
              <Trash2Icon size={16} />
            </Button>
            <Button
              variant={'ghost'}
              className="mb-1 h-9 w-9 shrink-0 rounded-full p-0"
              disabled={isStream}
              onClick={() => {
                setIsDownload(true);
              }}
            >
              <DownloadIcon size={16} />
            </Button>
          </div>
          <div className="relative flex-1">
            {isStream && (
              <div className="absolute left-0 z-10 flex w-full justify-center">
                <Button variant="destructive" onClick={() => stopStream()}>
                  <PauseOctagon></PauseOctagon>
                </Button>
              </div>
            )}
            <Textarea
              ref={textAreaRef}
              className={classNames('h-10 max-h-[7rem] min-h-[40px] w-full flex-1 resize-none scroll-bar-none', {
                'blur-sm': isStream,
              })}
              onKeyDown={handleKeyDown}
              disabled={isStream}
              value={userInput}
              placeholder="来说点什么...（Shift + Enter = 换行）"
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
            <Checkbox id="terms" className="mr-2" />
            全选
          </div>
          <MessageExporter messages={currentChatData} />
          <Button
            variant={'destructive'}
            onClick={() => {
              setIsDownload(false);
            }}
          >
            取消
          </Button>
        </>
      )}
    </footer>
  );
};

const ChatBody = () => {
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
    <ScrollArea className="flex-1">
      <main className="m-auto w-full max-w-screen-xl overflow-auto p-4" ref={bottom}>
        {currentChatData.length === 0 && (
          <div className="m-auto mt-2 w-fit text-center text-secondary-foreground">
            <IconSvg className="mr-1 inline-block w-10" />
            开始提问吧～
          </div>
        )}
        {currentChatData.map((item, index) => (
          <ChatItem key={index} data={item} />
        ))}
      </main>
    </ScrollArea>
  );
};

const Chat = () => {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <ChatBody />
      <Footer />
    </div>
  );
};

export default Chat;
