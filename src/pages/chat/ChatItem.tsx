import classNames from 'classnames';
import { RefreshCcwIcon, CopyIcon, Loader2 } from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import { useUserStore, useChatStore, RoleTypeEnum, ChatItemType, useAppStore } from '@/store';
import { copyToClipboard } from '@/utils';
import { StatusEnum } from '@/utils/stream-api';
import { Markdown } from '@/components/Markdown';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const ChatItem = ({
  data,
  isCheckedMode = false,
  isChecked = false,
  isDownload = false,
  onCheckedChange,
}: {
  data: ChatItemType;
  isCheckedMode?: boolean;
  isChecked?: boolean;
  isDownload?: boolean;
  onCheckedChange?: (val: boolean) => void;
}) => {
  const [{ nickname, avatar }] = useUserStore((state) => [state.userInfo]);
  const [regenerateChat] = useChatStore((state) => [state.regenerateChat]);
  const [appConfig] = useAppStore((state) => [state.appConfig]);

  const handleCopy = () => {
    copyToClipboard(data.text);
    toast.success('已复制到剪贴板');
  };

  const renderContent = () => {
    if (data.status === StatusEnum.START) {
      return <Loader2 className="animate-spin" size={24} />;
    } else if (data.status === StatusEnum.ERROR) {
      return data.error;
    } else {
      return <Markdown content={data.text} />;
    }
  };

  return (
    <div className="flex">
      {isCheckedMode && (
        <Checkbox checked={isChecked} className="ml-2 mt-4" onCheckedChange={onCheckedChange}></Checkbox>
      )}
      <div
        className={classNames('p-3 rounded h-fit flex gap-4 items-start w-full flex-1 mb-6 last-of-type:mb-0', {
          'flex-row-reverse': data.role === RoleTypeEnum.USER,
        })}
      >
        {data.role === RoleTypeEnum.USER ? (
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatar || appConfig.user_logo} alt={nickname} />
            <AvatarFallback>{nickname.slice(0, 1)?.toUpperCase()}</AvatarFallback>
          </Avatar>
        ) : (
          <Avatar className="h-10 w-10">
            <AvatarImage src={appConfig.web_logo} />
          </Avatar>
        )}
        <div
          className={classNames('flex-1 items-start flex flex-col overflow-hidden', {
            'items-end': data.role === RoleTypeEnum.USER,
          })}
        >
          <p className="text-xs text-neutral-400">{dayjs(data.dateTime).format('YYYY-MM-DD HH:mm:ss')}</p>
          <div
            className={classNames('max-w-full flex mt-2 items-end gap-2', {
              'flex-row-reverse': data.role === RoleTypeEnum.USER,
            })}
          >
            <div
              className={classNames('flex-1 p-3 rounded-md break-words overflow-hidden border', {
                'bg-primary text-primary-foreground hover:bg-primary/90': data.role === RoleTypeEnum.USER,
                'bg-secondary text-secondary-foreground hover:bg-secondary/80 markdown-table':
                  [RoleTypeEnum.ASSISTANT, RoleTypeEnum.SYSTEM].includes(data.role) && data.status !== StatusEnum.ERROR,
                'bg-destructive text-destructive-foreground': data.status === StatusEnum.ERROR,
              })}
            >
              {renderContent()}
            </div>
            <div className="shrink-0 pb-1 text-sm">
              {!isDownload && (
                <>
                  {[RoleTypeEnum.ASSISTANT].includes(data.role) && (
                    <RefreshCcwIcon
                      className="mb-1 hover:cursor-pointer"
                      size={12}
                      onClick={() => regenerateChat(data.requestId)}
                    />
                  )}
                  <CopyIcon className="hover:cursor-pointer" size={12} onClick={handleCopy} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
