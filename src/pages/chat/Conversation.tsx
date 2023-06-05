import { useTranslation } from 'react-i18next';
import Avatar from '../../components/Avatar';

const ConversationList = () => {
  return <div className="w-64 p-4 border-r border-gary-600 dark:border-gray-950">{1111}</div>;
};

const RoleList = () => {
  return <div>角色</div>;
};

const Conversation = () => {
  const { t } = useTranslation();
  return (
    <div className="w-64 p-4 border-r border-gary-600 dark:border-gray-950">
      {t('new conversation')}
      <ConversationList />
      <RoleList />
      <Avatar time={100} />
    </div>
  );
};

export default Conversation;
