import { SendIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { Loader2, PauseOctagon } from 'lucide-react';

import { useChatStore } from '@/store';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

import { ChatItem } from './ChatItem';

const Footer = () => {
  const [userInput, setUserInput] = useState('');
  const [sendUserMessage, isStream, clearCurrentConversation, stopStream] = useChatStore((state) => [
    state.sendUserMessage,
    state.isStream,
    state.clearCurrentConversation,
    state.stopStream,
  ]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.code === 'Enter' && !e.shiftKey) {
      sendUserMessage(userInput);
      setUserInput('');
    }
  };

  return (
    <footer className="flex items-center gap-4 p-4">
      <Button variant={'ghost'} className="h-9 w-9 shrink-0 rounded-full p-0" disabled={isStream}>
        <Trash2Icon size={16} onClick={() => clearCurrentConversation()} />
      </Button>
      <div className="relative flex-1">
        {isStream && (
          <div className="absolute left-0 z-10 flex w-full justify-center">
            <Button variant="destructive" onClick={() => stopStream()}>
              <PauseOctagon></PauseOctagon>
            </Button>
          </div>
        )}
        <Input
          className={isStream ? 'blur-sm' : ''}
          onKeyDown={handleKeyDown}
          disabled={isStream}
          value={userInput}
          placeholder="来说点什么...（Shift + Enter = 换行）"
          onChange={(val) => setUserInput(val.target.value)}
        />
      </div>
      <Button disabled={isStream || !userInput}>
        {!isStream ? (
          <SendIcon
            onClick={() => {
              sendUserMessage(userInput);
              setUserInput('');
            }}
          />
        ) : (
          <Loader2 className="m-auto my-32 animate-spin" />
        )}
      </Button>
    </footer>
  );
};

const ChatBody = () => {
  const [currentChatData] = useChatStore((state) => [state.currentChatData()]);

  return (
    <ScrollArea className="flex-1">
      <main className="m-auto w-full max-w-screen-xl overflow-auto p-4">
        {currentChatData.length === 0 && <div className="mt-2 w-full text-center">开始提问吧～</div>}
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
