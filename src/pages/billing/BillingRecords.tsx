import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import userService, { UserPackageType } from '@/api/user';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function BillingRecordsDialog({ children }: { children: React.ReactNode }) {
  const [userPackages, setUserPackages] = useState<UserPackageType[]>([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserPackages = async () => {
      setIsLoading(true);
      const res = await userService.getUserPackages();
      setUserPackages(res);
      setIsLoading(false);
    };
    if (open) {
      getUserPackages();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogTitle>充值记录</DialogTitle>
        {isLoading ? (
          <Loader2 className="m-auto my-32 animate-spin" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>名称</TableHead>
                <TableHead>问答机会</TableHead>
                <TableHead className="text-right">日期</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {userPackages.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.package_name}</TableCell>
                  <TableCell>+{item.num}次</TableCell>
                  <TableCell className="text-right">{item.created_at}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}
