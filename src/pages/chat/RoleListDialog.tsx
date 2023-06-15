import { useState } from 'react';
import { X } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import SvgIcon from '@/components/SvgIcon';
import { RoleType } from '@/api/chat';
import { ScrollArea } from '@/components/ui/scroll-area';

export function RoleListDialog({
  data,
  children,
  roleSelect,
}: {
  data: RoleType[];
  children: React.ReactNode;
  roleSelect: (item: RoleType) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <AlertDialog open={open} onOpenChange={(val) => setOpen(val)}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex justify-between">
            全部角色
            <Button className="h-6 w-6 p-1" variant={'ghost'} onClick={() => setOpen(false)}>
              <X size={16} />
            </Button>
          </AlertDialogTitle>
        </AlertDialogHeader>
        <ScrollArea>
          <div className="grid max-h-80 grid-cols-3 gap-2">
            {data.map((item, index) => (
              <Button
                variant={'outline'}
                className="flex	h-fit items-center justify-start gap-1 px-2"
                key={index}
                onClick={() => {
                  roleSelect(item);
                  setOpen(false);
                }}
              >
                <SvgIcon icon={item.icon} className="shrink-0" />
                <span className="truncate" title={item.name}>
                  {item.name}
                </span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </AlertDialogContent>
    </AlertDialog>
  );
}
