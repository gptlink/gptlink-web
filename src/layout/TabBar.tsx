import { MessageSquare, User, CreditCard, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { SystemLanguages, ThemeMode } from './Header';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

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
          <DropdownMenuItem className="flex items-center gap-2">
            <SystemLanguages />
            <ThemeMode />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TabBar;
