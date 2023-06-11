import { Icon } from '@iconify/react';

const SvgIcon = ({ icon = '', className = '' }) => {
  return <Icon icon={icon} className={className} />;
};

export default SvgIcon;
