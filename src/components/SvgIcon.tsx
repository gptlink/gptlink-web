import { Icon } from '@iconify/react';

const SvgIcon = ({ icon, className }: { icon: string; className: string }) => {
  return <Icon icon={icon} className={className} />;
};

export default SvgIcon;
