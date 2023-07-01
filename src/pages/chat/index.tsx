import Chat from './Chat';
import Conversation from './Conversation';
import { useMobileScreen } from '@/hooks/use-mobile-screen';

export default function Home() {
  const isMobileScreen = useMobileScreen();

  return (
    <div className="flex flex-1 overflow-hidden">
      {!isMobileScreen && <Conversation />}
      <Chat />
    </div>
  );
}
