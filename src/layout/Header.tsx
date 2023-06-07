import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MoonIcon, Sun, Laptop, Languages } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Avatar from '../components/Avatar';
import { ThemeModeType, LanguagesType } from '../constants';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Button } from '../components/ui/button';

const ThemeMode = () => {
  const { t } = useTranslation();
  const [themeMode, setThemeMode] = useState(ThemeModeType.SYSTEM);

  const switchDarkMode = (mode: ThemeModeType) => {
    const systemMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (mode === ThemeModeType.DARK || (mode === ThemeModeType.SYSTEM && systemMode)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme-mode', mode);
    setThemeMode(mode);
  };

  const getIcon = (item: ThemeModeType, size = 14) => {
    const iconMap = {
      [ThemeModeType.LIGHT]: <Sun size={size} />,
      [ThemeModeType.DARK]: <MoonIcon size={size} />,
      [ThemeModeType.SYSTEM]: <Laptop size={size} />,
    };
    return iconMap[item];
  };

  useEffect(() => {
    const mode = localStorage.getItem('theme-mode');
    switchDarkMode((mode as ThemeModeType) || ThemeModeType.SYSTEM);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-8 h-8 p-0 hover:bg-accent hover:text-accent-foreground">{getIcon(themeMode, 18)}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={'end'} className="w-20 bg-white">
        {[ThemeModeType.LIGHT, ThemeModeType.DARK, ThemeModeType.SYSTEM].map((item) => (
          <DropdownMenuItem className="flex items-center gap-2" key={item} onClick={() => switchDarkMode(item)}>
            {getIcon(item)} {t(item)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const SystemLanguages = () => {
  const { t, i18n } = useTranslation();
  const [languageMode, setLanguageMode] = useState(LanguagesType.ZH);

  const switchLanguageMode = (mode: LanguagesType) => {
    localStorage.setItem('language-mode', mode);
    i18n.changeLanguage(mode);
    setLanguageMode(mode);
  };

  useEffect(() => {
    const mode = localStorage.getItem('language-mode');
    switchLanguageMode((mode as LanguagesType) || LanguagesType.ZH);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={'sm'}>
          <Languages />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={'end'} className=" bg-white">
        {[LanguagesType.ZH, LanguagesType.EN].map((item) => (
          <DropdownMenuCheckboxItem
            className="flex items-center gap-2"
            checked={languageMode === item}
            onClick={() => switchLanguageMode(item)}
            key={item}
          >
            {t(item)}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const UserDropDown = () => {
  const navigate = useNavigate();
  const signOut = () => {
    navigate('/login');
  };

  const navToUser = () => {
    navigate('/user');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div>
          <Avatar />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={'end'} className="bg-white">
        <DropdownMenuItem className="flex items-center gap-2" onClick={() => navToUser()}>
          个人中心
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2" onClick={() => signOut()}>
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default function Header() {
  const navigate = useNavigate();

  const handleNavToChat = () => {
    navigate('/chat');
  };
  return (
    <div className="px-2 py-3 flex justify-between items-center gap-4">
      <button className="flex gap-4 items-center text-lg font-semibold" onClick={() => handleNavToChat()}>
        <img src="https://cdn.cblink.net/aiyaaa/ai-yaaa-logo.png" className="w-8 rounded-full " />
        GPT Link Web
      </button>

      <div className="flex gap-4 items-center">
        <SystemLanguages />
        <ThemeMode />
        <UserDropDown />
      </div>
    </div>
  );
}
