import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LogOutIcon, MessageSquare, Edit2Icon, Trash2 } from 'lucide-react';

import { RoleType, useBillingStore, useUserStore } from '@/store';
import chatService from '@/api/chat';

import Avatar from '@/components/Avatar';
import SvgIcon from '@/components/SvgIcon';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const ConversationList = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Button className="m-4 shrink-0 leading-8">+ {t('new conversation')}</Button>

      <ScrollArea>
        <div className="flex w-64 flex-1 flex-col gap-4 overflow-auto px-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <Button
              variant={'outline'}
              className="flex gap-2"
              key={index}
              title="对话一对话一对话一对话一对话一对话一对话一对话一对话一对话一"
            >
              <MessageSquare size={14}></MessageSquare>
              <span className="flex-1 truncate">对话一对话一对话一对话一对话一对话一对话一对话一对话一对话一</span>
              <Edit2Icon size={14}></Edit2Icon>
              <Trash2 size={14}></Trash2>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

const RoleList = ({ data }: { data: RoleType[] }) => {
  const { t } = useTranslation();
  return (
    <div className="flex h-64 flex-col gap-4">
      <div className="text-center leading-8">—— {t('role')} ——</div>
      <ScrollArea>
        <div className="grid grid-cols-2 gap-2 px-4 last:overflow-auto">
          {data.map((item, index) => (
            <Button variant={'outline'} className="flex	h-fit items-center justify-start gap-1 px-2" key={index}>
              <SvgIcon icon={item.icon} className="shrink-0" />
              <span className="truncate" title={item.name}>
                {item.name}
              </span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

const Conversation = () => {
  const [roleList, setRoleList] = useState([]);
  const [remaining] = useBillingStore((state) => [state.remaining()]);
  const [{ nickname, avatar }] = useUserStore((state) => [state.userInfo]);

  useEffect(() => {
    const getRoleList = async () => {
      const res = await chatService.getRoleList();
      setRoleList(res);
    };
    getRoleList();
  }, []);

  return (
    <aside className="flex w-64 shrink-0 flex-col gap-4 overflow-hidden border-r text-xs dark:border-gray-950">
      <ConversationList />
      <RoleList data={roleList} />
      <div className="flex items-center justify-between border-t p-4">
        <Avatar showRemaining remaining={remaining} avatar={avatar} nickname={nickname} />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button>
                <LogOutIcon />
              </button>
            </TooltipTrigger>
            <TooltipContent className="bg-primary text-primary-foreground">
              <p>退出登录</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </aside>
  );
};

export default Conversation;
