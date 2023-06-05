import { useTranslation } from 'react-i18next';
import Avatar from '../../components/Avatar';

const ConversationList = () => {
  const { t } = useTranslation();
  return (
    <div className="flex-1 flex flex-col">
      <button className="border m-4 leading-8 rounded border-dashed hover:border-gray-950 text-sm">
        + {t('new conversation')}
      </button>
      <div className="flex flex-1 flex-col gap-4 overflow-auto px-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            className="w-full text-center border p-3 rounded h-fit hover:bg-neutral-100 hover:cursor-pointer"
            key={index}
          >
            周报
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
      <div className="flex flex-1 flex-wrap gap-4 overflow-auto px-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            className="w-24 text-center border p-3 rounded h-fit hover:bg-neutral-100 hover:cursor-pointer"
            key={index}
          >
            周报
          </div>
        ))}
      </div>
    </div>
  );
};

const Conversation = () => {
  return (
    <aside className="w-64 border-r border-gary-600 dark:border-gray-950 flex flex-col gap-4 text-xs">
      <ConversationList />
      <RoleList />
      <Avatar className="p-4 border-t" time={100} />
    </aside>
  );
};

export default Conversation;
