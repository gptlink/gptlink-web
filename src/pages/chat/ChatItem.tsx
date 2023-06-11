import classNames from 'classnames';
import { RefreshCcwIcon, CopyIcon } from 'lucide-react';
import dayjs from 'dayjs';

import { useUserStore, RoleTypeEnum, ChatItemType } from '@/store';
import { Markdown } from '@/components/Markdown';

export const ChatItem = ({ data }: { data: ChatItemType }) => {
  const [userInfo] = useUserStore((state) => [state.userInfo]);

  return (
    <div
      className={classNames('p-3 rounded h-fit flex gap-4 items-start w-full flex-1 mb-6', {
        'flex-row-reverse': data.role === RoleTypeEnum.USER,
      })}
    >
      <img
        className="w-10 rounded-full"
        src={data.role === 'user' ? userInfo.avatar : 'https://cdn.cblink.net/aiyaaa/ai-yaaa-logo.png'}
      />

      <div
        className={classNames('flex-1 items-start flex flex-col overflow-hidden', {
          'items-end': data.role === RoleTypeEnum.USER,
        })}
      >
        <p className="text-xs text-neutral-400">{dayjs(data.dateTime).format('YYYY-MM-DD HH:MM:ss')}</p>
        <div
          className={classNames('max-w-full flex mt-2 items-end gap-1', {
            'flex-row-reverse': data.role === RoleTypeEnum.USER,
          })}
        >
          <div
            className={classNames('flex-1 p-3 rounded-md break-words overflow-hidden dark:border', {
              'bg-primary text-primary-foreground hover:bg-primary/90': data.role === RoleTypeEnum.USER,
              'bg-secondary text-secondary-foreground hover:bg-secondary/80': [
                RoleTypeEnum.ASSISTANT,
                RoleTypeEnum.SYSTEM,
              ].includes(data.role),
            })}
          >
            <Markdown content={data.text} />
          </div>
          <div className="shrink-0 pb-1 text-sm">
            {[RoleTypeEnum.ASSISTANT, RoleTypeEnum.SYSTEM].includes(data.role) && (
              <RefreshCcwIcon className="mb-1 hover:cursor-pointer" size={12} />
            )}
            <CopyIcon className="hover:cursor-pointer" size={12} />
          </div>
        </div>
      </div>
    </div>
  );
};
