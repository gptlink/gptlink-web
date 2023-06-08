import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { useUserStore } from '@/store';

const Avatar = ({ time, className }: { time?: number; className?: string }) => {
  const { t } = useTranslation();
  const [nickName, avatar] = useUserStore((state) => [state.nickName, state.avatar]);

  return (
    <div className={classNames('flex items-center gap-2 text-sm', className)}>
      <img className="h-8 w-8 rounded-full" src={avatar} alt="" />
      <div>
        {nickName}
        {time && (
          <div className="text-sm text-slate-500">
            {t('valid times')}: {time}
          </div>
        )}
      </div>
    </div>
  );
};

export default Avatar;
