import { useTranslation } from 'react-i18next';
import { LogOutIcon, MessageSquare, Edit2Icon, Trash2 } from 'lucide-react';

import Avatar from '../../components/Avatar';
import SvgIcon from '../../components/SvgIcon';

const ConversationList = () => {
  const { t } = useTranslation();
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <button className="shrink-0 border m-4 leading-8 rounded border-dashed hover:border-gray-950 text-sm">
        + {t('new conversation')}
      </button>
      <div className="flex flex-1 flex-col overflow-auto gap-4 px-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            className="w-full border p-3 rounded h-fit hover:bg-neutral-100 hover:cursor-pointer flex items-center gap-2"
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
    <div className="h-64 flex flex-col gap-4">
      <div className="text-center leading-8">—— {t('role')} ——</div>
      <div className="grid gap-4 grid-cols-2 last:overflow-auto px-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            className="flex items-center gap-1 text-center border p-3 rounded h-fit hover:bg-neutral-100 hover:cursor-pointer text-sm"
            key={index}
          >
            <SvgIcon icon="mdi:book-account-outline" className="text-base flex-shrink-0" />
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
    <aside className="w-64 border-r border-gary-600 dark:border-gray-950 flex flex-col gap-4 text-xs flex-shrink-0 overflow-hidden">
      <ConversationList />
      <RoleList />
      <div className="flex items-center justify-between p-4 border-t">
        <Avatar time={100} />
        <button>
          <LogOutIcon />
        </button>
      </div>
    </aside>
  );
};

export default Conversation;
