import Chat from './Chat';
import Conversation from './Conversation';

export default function Home() {
  return (
    <div className="m-4 flex flex-1 overflow-hidden rounded-xl border ">
      <Conversation />
      <Chat />
    </div>
  );
}
