import { useMemo, useState } from 'react';
import { AlignJustify } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useChatStore } from '@/store';

import Conversation from '../pages/chat/Conversation';

export const TitleHeader = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [currentConversation] = useChatStore((state) => [state.currentConversation]);
  const title = useMemo(() => {
    if (location.pathname.includes('user')) {
      return t('user center');
    }
    if (location.pathname.includes('billing')) {
      return t('billing center');
    }
    return currentConversation.title;
  }, [currentConversation, location.pathname]);

  return (
    <div className="border-b py-4 text-center">
      <Sheet open={open} onOpenChange={(val) => setOpen(val)}>
        <SheetTrigger className="absolute left-4">
          <AlignJustify></AlignJustify>
        </SheetTrigger>
        <SheetContent className="w-auto p-0" position="left" showClose={false}>
          <Conversation onChange={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      {title}
    </div>
  );
};
