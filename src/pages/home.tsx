import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();
  return (
    <div className="p-10 bg-yellow-400">
      <h1>{t('welcome')}</h1>
    </div>
  );
}
