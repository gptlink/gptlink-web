import Chat from './Chat';
import Conversation from './Conversation';

export default function Home() {
  return (
    <div className="border border-gary-600 dark:border-gray-950 rounded flex-1 flex">
      <Conversation />
      <Chat />
    </div>
  );
}
