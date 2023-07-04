import { useEffect } from 'react';
import { MessageSquare, User, CreditCard, MoreHorizontal, Github } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

import classNames from 'classnames';

import { useAppStore } from '@/store';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

import { ThemeMode } from './Header';

const TabBar = () => {
  const navList = [
    {
      path: '/chat',
      icon: <MessageSquare size={20} />,
    },
    {
      path: 'user',
      icon: <User size={20} />,
    },
    {
      path: 'billing',
      icon: <CreditCard size={20} />,
    },
  ];
  const navigate = useNavigate();

  const [theme, setTheme] = useAppStore((state) => [state.theme, state.setTheme]);

  useEffect(() => {
    setTheme(theme);
  }, []);

  return (
    <div className="flex items-center justify-between border-t px-20 py-4 text-center">
      {navList.map((item, index) => (
        <div
          className={classNames('flex flex-col items-center gap-2 rounded-xl p-4', {
            'bg-secondary': location.pathname.includes(item.path),
          })}
          onClick={() => navigate(item.path)}
          key={index}
        >
          {item.icon}
        </div>
      ))}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-9 w-9 p-0">
            <MoreHorizontal size={18} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align={'start'}>
          <DropdownMenuItem className="flex items-center gap-2 pr-3">
            <ThemeMode />
            <Link to="https://github.com/gptlink/gptlink-web" target="_blank">
              <Button variant="ghost" className="p-0 px-2">
                <Github size={18} />
              </Button>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TabBar;
