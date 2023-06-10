import { SendIcon, Trash2Icon } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

import { ChatItem } from './ChatItem';

const Footer = () => {
  return (
    <footer className="flex items-center gap-4 p-4">
      <Button variant={'ghost'} className="h-9 w-9 shrink-0 rounded-full p-0">
        <Trash2Icon size={16} />
      </Button>
      <Input placeholder="来说点什么...（Shift + Enter = 换行）" />
      <Button>
        <SendIcon />
      </Button>
    </footer>
  );
};

const ChatBody = () => {
  return (
    <ScrollArea>
      <main className="m-auto w-full max-w-screen-xl flex-1 overflow-auto p-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <ChatItem key={index} role={index % 2 === 0 ? 'user' : 'assistant'} />
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
