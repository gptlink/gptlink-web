import { useTranslation } from 'react-i18next';
import { MoonIcon, Sun, Laptop, Languages } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useAppStore, ThemeModeType, LanguagesType } from '@/store';
import Avatar from '@/components/Avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect } from 'react';

const ThemeMode = () => {
  const { t } = useTranslation();
  const [theme, setTheme] = useAppStore((state) => [state.theme, state.setTheme]);

  const switchTheme = (mode: ThemeModeType) => {
    const systemMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (mode === ThemeModeType.DARK || (mode === ThemeModeType.SYSTEM && systemMode)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setTheme(mode);
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
    switchTheme(theme);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0">{getIcon(theme, 18)}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={'end'} className="w-20 bg-white">
        {[ThemeModeType.LIGHT, ThemeModeType.DARK, ThemeModeType.SYSTEM].map((item) => (
          <DropdownMenuItem className="flex items-center gap-2" key={item} onClick={() => switchTheme(item)}>
            {getIcon(item)} {t(item)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const SystemLanguages = () => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useAppStore((state) => [state.language, state.setLanguage]);

  const switchLanguage = (mode: LanguagesType) => {
    localStorage.setItem('language-mode', mode);
    i18n.changeLanguage(mode);
    setLanguage(mode);
  };

  useEffect(() => {
    switchLanguage(language);
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
            checked={language === item}
            onClick={() => switchLanguage(item)}
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
    <div className="flex items-center justify-between gap-4 px-2 py-3">
      <button className="flex items-center gap-4 text-lg font-semibold" onClick={() => handleNavToChat()}>
        <img src="https://cdn.cblink.net/aiyaaa/ai-yaaa-logo.png" className="w-8 rounded-full " />
        GPT Link Web
      </button>

      <div className="flex items-center gap-4">
        <SystemLanguages />
        <ThemeMode />
        <UserDropDown />
      </div>
    </div>
  );
}
