import Chat from './Chat';
import Conversation from './Conversation';

export default function Home() {
  return (
    <div className="border-gary-600 flex flex-1 overflow-hidden rounded border dark:border-gray-950">
      <Conversation />
      <Chat />
    </div>
  );
}
