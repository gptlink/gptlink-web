import { ChatItem } from './ChatItem';
import { SendIcon, Trash2Icon } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="flex items-center gap-4 p-4">
      <button>
        <Trash2Icon />
      </button>
      <input
        className="h-10 flex-1 rounded border p-4 leading-8"
        type="text"
        placeholder="来说点什么...（Shift + Enter = 换行）"
      />
      <button>
        <SendIcon />
      </button>
    </footer>
  );
};

const ChatBody = () => {
  return (
    <main className="scrollbar-track-red-100 scroll-bar-none m-auto w-full max-w-screen-xl flex-1 overflow-auto p-4">
      {Array.from({ length: 10 }).map((_, index) => (
        <ChatItem key={index} role={index % 2 === 0 ? 'user' : 'assistant'} />
      ))}
    </main>
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
