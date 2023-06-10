import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LogOutIcon, MessageSquare, Edit2Icon, Trash2 } from 'lucide-react';

import { RoleType, useBillingStore, useUserStore } from '@/store';
import chatService from '@/api/chat';

import Avatar from '@/components/Avatar';
import SvgIcon from '@/components/SvgIcon';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ConversationList = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <button className="m-4 shrink-0 rounded border border-dashed text-sm leading-8 hover:border-gray-950">
        + {t('new conversation')}
      </button>
      <div className="flex flex-1 flex-col gap-4 overflow-auto px-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            className="flex h-fit w-full items-center gap-2 rounded border p-3 hover:cursor-pointer hover:bg-neutral-100"
            key={index}
            title="对话一对话一对话一对话一对话一对话一对话一对话一对话一对话一"
          >
            <MessageSquare size={14}></MessageSquare>
            <span className="flex-1 truncate">对话一对话一对话一对话一对话一对话一对话一对话一对话一对话一</span>
            <Edit2Icon size={14}></Edit2Icon>
            <Trash2 size={14}></Trash2>
          </div>
        ))}
      </div>
    </div>
  );
};

const RoleList = ({ data }: { data: RoleType[] }) => {
  const { t } = useTranslation();
  return (
    <div className="flex h-64 flex-col gap-4">
      <div className="text-center leading-8">—— {t('role')} ——</div>
      <div className="grid grid-cols-2 gap-4 px-4 last:overflow-auto">
        {data.map((item, index) => (
          <div
            className="flex h-fit items-center gap-1 rounded border p-3 text-center hover:cursor-pointer hover:bg-neutral-100"
            key={index}
          >
            <SvgIcon icon={item.icon} className="shrink-0" />
            <span className="truncate" title={item.name}>
              {item.name}
            </span>
          </div>
        ))}
      </div>
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
            <TooltipContent className="bg-black text-white">
              <p>退出登录</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </aside>
  );
};

export default Conversation;
