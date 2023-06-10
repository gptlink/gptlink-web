import classNames from 'classnames';
import { RefreshCcwIcon, CopyIcon } from 'lucide-react';
import { useUserStore } from '@/store';

export const ChatItem = ({ role }: { role: string }) => {
  const [userInfo] = useUserStore((state) => [state.userInfo]);

  return (
    <div
      className={classNames('p-3 rounded h-fit flex gap-4 items-start w-full flex-1 mb-6', {
        'flex-row-reverse': role === 'user',
      })}
    >
      <img
        className="w-10 rounded-full"
        src={role === 'user' ? userInfo.avatar : 'https://cdn.cblink.net/aiyaaa/ai-yaaa-logo.png'}
        alt=""
      />
      <div
        className={classNames('flex-1 items-start flex flex-col overflow-hidden', {
          'items-end': role === 'user',
        })}
      >
        <p className="text-xs text-neutral-400">6/6/2023, 9:06:18 AM</p>
        <div
          className={classNames('max-w-full flex mt-2 items-end gap-1', {
            'flex-row-reverse': role === 'user',
          })}
        >
          <div
            className={classNames('flex-1 p-3 rounded-md break-words overflow-hidden', {
              'bg-primary text-primary-foreground': role === 'user',
              'bg-secondary text-secondary-foreground': role === 'assistant',
            })}
          >
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
          </div>
          <div className="shrink-0 text-sm">
            {role === 'assistant' && <RefreshCcwIcon className="mb-1 hover:cursor-pointer" size={12} />}
            <CopyIcon className="hover:cursor-pointer" size={12} />
          </div>
        </div>
      </div>
    </div>
  );
};
