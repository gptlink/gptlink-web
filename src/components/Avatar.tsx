import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

const Avatar = ({ time, className }: { time?: number; className: string }) => {
  const { t } = useTranslation();
  return (
    <div className={classNames('flex items-center gap-2 text-sm', className)}>
      <img
        className="w-8 h-8 rounded-full"
        src="https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIm0q06mdqTumC0zFkOCRUAPRWSeId450ViaEAgvYKDHUvGFq33WZPdgGbRgY28PBAic8OOxpcHtOAg/132"
        alt=""
      />
      <div>
        PengYYY
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
