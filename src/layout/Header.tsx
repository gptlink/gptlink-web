import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { MoonIcon, Sun, Laptop, Languages } from 'lucide-react';

import { useAppStore, ThemeModeType, LanguagesType, useUserStore } from '@/store';
import Avatar from '@/components/Avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
        <Button variant="ghost" className="h-9 w-9 p-0">
          {getIcon(theme, 18)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={'end'} className="w-30">
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
  const [{ nickname, avatar }, signOut] = useUserStore((state) => [state.userInfo, state.signOut]);
  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" className="p-0 px-2">
          <Avatar avatar={avatar} nickname={nickname} />
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

export default function Header() {
  const navigate = useNavigate();

  const handleNavToChat = () => {
    navigate('/chat');
  };
  return (
    <div className="flex items-center justify-between border-b px-4 py-3">
      <div className="flex items-center">
        <button className="flex items-center gap-4 text-lg font-semibold" onClick={() => handleNavToChat()}>
          <img src="https://cdn.cblink.net/aiyaaa/ai-yaaa-logo.png" className="w-8 rounded-full" />
          GPT Link Web
        </button>
        <div className="mx-4 h-6 w-[1px] bg-slate-300"></div>
        <Button variant={'ghost'}>
          <Link to={'user'}>个人中心</Link>
        </Button>
        <Button variant={'ghost'}>
          <Link to={'billing'}>充值中心</Link>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <SystemLanguages />
        <ThemeMode />
        <UserDropDown />
      </div>
    </div>
  );
}
