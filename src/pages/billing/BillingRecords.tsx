import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import userService, { UserPackageType } from '@/api/user';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type BillingRecordsDialogProps = {
  open: boolean;
  handleOpenChange: (val: boolean) => void;
};

export function BillingRecordsDialog({ open, handleOpenChange }: BillingRecordsDialogProps) {
  const [userPackages, setUserPackages] = useState<UserPackageType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true);
      const res = await userService.getUserPackages();
      setUserPackages(res);
      setIsLoading(false);
    };
    if (open) {
      getUser();
    }
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogTitle>充值记录</DialogTitle>
        <DialogHeader>
          <DialogDescription asChild>
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
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
