import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { MoonIcon, Sun, Laptop, Languages, Github } from 'lucide-react';

import { useAppStore, ThemeModeType, LanguagesType, useUserStore } from '@/store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const ThemeMode = () => {
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
        <Button variant="ghost" className="h-9 w-9 p-0">
          {getIcon(theme, 18)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={'end'} className="w-32">
        {[ThemeModeType.LIGHT, ThemeModeType.DARK, ThemeModeType.SYSTEM].map((item) => (
          <DropdownMenuItem className="flex items-center gap-2" key={item} onClick={() => switchTheme(item)}>
            {getIcon(item)} {t(item)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const SystemLanguages = () => {
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
        <Button variant="ghost" className="h-9 w-9 p-0">
          <Languages size={18} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={'end'}>
        <DropdownMenuRadioGroup value={language} onValueChange={(val) => switchLanguage(val as LanguagesType)}>
          {[LanguagesType.ZH, LanguagesType.EN].map((item) => (
            <DropdownMenuRadioItem className="flex items-center gap-2" value={item} key={item}>
              {t(item)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const UserDropDown = () => {
  const navigate = useNavigate();
  const [appConfig] = useAppStore((state) => [state.appConfig]);
  const [{ nickname, avatar }, signOut] = useUserStore((state) => [state.userInfo, state.signOut]);
  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-0 px-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatar || appConfig.user_logo} alt={nickname} />
            <AvatarFallback>{nickname.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <p className="ml-2">{nickname}</p>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={'end'}>
        <DropdownMenuItem className="flex items-center gap-2" onClick={() => navigate('/user')}>
          个人中心
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2" onClick={() => handleSignOut()}>
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default function Header({ isPlain = false }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [appConfig] = useAppStore((state) => [state.appConfig]);

  const handleNavToChat = () => {
    navigate('/chat');
  };

  const location = useLocation();

  const navList = [
    {
      path: 'user',
      name: t('user center'),
    },
    {
      path: 'billing',
      name: t('billing center'),
    },
  ];

  return (
    <div className="flex items-center justify-between border-b px-4 py-3">
      <div className="flex items-center">
        <button className="flex items-center gap-2 text-lg font-semibold" onClick={() => handleNavToChat()}>
          <img src={appConfig.web_logo} className="h-10 w-10 rounded-full" />
          {appConfig.name}
        </button>
        {!isPlain && (
          <>
            <Separator className="mx-4 h-6" orientation="vertical" />
            {navList.map((item, index) => (
              <Link to={item.path} key={index}>
                <Button className="mr-1" variant={location.pathname.includes(item.path) ? 'default' : 'ghost'}>
                  {item.name}
                </Button>
              </Link>
            ))}
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Link to="https://github.com/gptlink/gptlink-web" target="_blank">
          <Button variant="ghost" className="p-0 px-2">
            <Github size={18} />
          </Button>
        </Link>
        <SystemLanguages />
        <ThemeMode />
        {!isPlain && <UserDropDown />}
      </div>
    </div>
  );
}
