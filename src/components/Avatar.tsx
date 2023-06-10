import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

const Avatar = ({ remaining = 0, className = '', nickname = '', avatar = '', showRemaining = false }) => {
  const { t } = useTranslation();

  return (
    <div className={classNames('flex items-center gap-2 text-sm', className)}>
      <img className="h-8 w-8 rounded-full" src={avatar} alt="" />
      <div>
        {nickname}
        {showRemaining && (
          <div className="text-sm text-slate-500">
            {t('valid times')}: {remaining}
          </div>
        )}
      </div>
    </div>
  );
};

export default Avatar;
