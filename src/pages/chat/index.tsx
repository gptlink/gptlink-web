import Chat from './Chat';
import Conversation from './Conversation';

export default function Home() {
  return (
    <div className="border-gary-600 m-4 flex flex-1 overflow-hidden rounded-xl border dark:border-gray-950">
      <Conversation />
      <Chat />
    </div>
  );
}
