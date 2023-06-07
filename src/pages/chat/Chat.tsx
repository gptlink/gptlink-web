import { ChatItem } from './ChatItem';
import { SendIcon, Trash2Icon } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="p-4 flex gap-4 items-center">
      <button>
        <Trash2Icon />
      </button>
      <input
        className="flex-1 h-10 p-4 leading-8 border rounded"
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
    <main className="flex-1 overflow-auto scrollbar-track-red-100 w-full max-w-screen-xl m-auto p-4 scroll-bar-none">
      {Array.from({ length: 10 }).map((_, index) => (
        <ChatItem key={index} role={index % 2 === 0 ? 'user' : 'assistant'} />
      ))}
    </main>
  );
};

const Chat = () => {
  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <ChatBody />
      <Footer />
    </div>
  );
};

export default Chat;
