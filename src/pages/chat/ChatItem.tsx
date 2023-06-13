import classNames from 'classnames';
import { RefreshCcwIcon, CopyIcon } from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import { useUserStore, RoleTypeEnum, ChatItemType } from '@/store';
import { copyToClipboard } from '@/utils';
import { Markdown } from '@/components/Markdown';
import IconSvg from '@/components/Icon';

export const ChatItem = ({ data }: { data: ChatItemType }) => {
  const [userInfo] = useUserStore((state) => [state.userInfo]);

  const handleCopy = () => {
    copyToClipboard(data.text);
    toast.success('已复制到剪贴板');
  };

  return (
    <div
      className={classNames('p-3 rounded h-fit flex gap-4 items-start w-full flex-1 mb-6 last-of-type:mb-0', {
        'flex-row-reverse': data.role === RoleTypeEnum.USER,
      })}
    >
      {data.role === RoleTypeEnum.USER ? (
        <img className="h-10 w-10 rounded-full border" src={userInfo.avatar} />
      ) : (
        <IconSvg className="h-10 w-10 rounded-full border p-1.5" />
      )}
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
            <CopyIcon className="hover:cursor-pointer" size={12} onClick={handleCopy} />
          </div>
        </div>
      </div>
    </div>
  );
};
