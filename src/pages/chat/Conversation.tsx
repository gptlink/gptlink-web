import { useTranslation } from 'react-i18next';
import { LogOutIcon, MessageSquare, Edit2Icon, Trash2 } from 'lucide-react';

import Avatar from '../../components/Avatar';
import SvgIcon from '../../components/SvgIcon';

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

const RoleList = () => {
  const { t } = useTranslation();
  return (
    <div className="flex h-64 flex-col gap-4">
      <div className="text-center leading-8">—— {t('role')} ——</div>
      <div className="grid grid-cols-2 gap-4 px-4 last:overflow-auto">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            className="flex h-fit items-center gap-1 rounded border p-3 text-center text-sm hover:cursor-pointer hover:bg-neutral-100"
            key={index}
          >
            <SvgIcon icon="mdi:book-account-outline" className="shrink-0 text-base" />
            <span className="truncate" title="周报周报周报周报周报">
              周报周报周报周报周报
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Conversation = () => {
  return (
    <aside className="flex w-64 shrink-0 flex-col gap-4 overflow-hidden border-r text-xs dark:border-gray-950">
      <ConversationList />
      <RoleList />
      <div className="flex items-center justify-between border-t p-4">
        <Avatar time={100} />
        <button>
          <LogOutIcon />
        </button>
      </div>
    </aside>
  );
};

export default Conversation;
