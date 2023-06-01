import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { ThemeMode } from '../constants';

export default function Header() {
  const { t, i18n } = useTranslation();

  const switchDarkMode = (mode: ThemeMode) => {
    const systemMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (mode === ThemeMode.DARK || (mode === ThemeMode.AUTO && systemMode)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="px-10 py-5 flex justify-between gap-4">
      <div className="flex gap-4">
        <Link to="/">{t('home page')}</Link>
        <Link to="/user">{t('user page')}</Link>
      </div>

      <div className="flex gap-4">
        {i18n.language === 'zh' && <button onClick={() => i18n.changeLanguage('en')}>{t('change to en')}</button>}
        {i18n.language === 'en' && <button onClick={() => i18n.changeLanguage('zh')}>{t('change to zh')}</button>}
        <button onClick={() => switchDarkMode(ThemeMode.DARK)}>{t('dark mode')}</button>
        <button onClick={() => switchDarkMode(ThemeMode.LIGHT)}>{t('light mode')}</button>
        <button onClick={() => switchDarkMode(ThemeMode.AUTO)}>{t('system mode')}</button>
      </div>
    </div>
  );
}
