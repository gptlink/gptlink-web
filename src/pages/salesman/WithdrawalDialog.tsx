import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';

import { useSalesmanStore } from '@/store';
import salesmanService from '@/api/salesman';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';

export function WithdrawalDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [statistics, getSalesmanStatistics] = useSalesmanStore((state) => [
    state.statistics,
    state.getSalesmanStatistics,
  ]);
  const formSchema = z.object({
    price: z.string().refine(
      (val) => {
        return !(!Number(val) || Number(val) > Number(statistics.balance) || Number(val) * 1 < 0.1);
      },
      {
        message: '错误的提现金额',
      },
    ),
    channel: z.string().min(1, {
      message: '请选择提现方式',
    }),
    account: z.string().refine((val) => /^(?:(?:\+|00)86)?1\d{10}$/.test(val), {
      message: '错误的手机号码',
    }),
    name: z.string().min(2, {
      message: '错误的收款人姓名',
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      channel: 'alipay',
      price: '',
      account: '',
      name: '',
    },
  });

  useEffect(() => {
    const getSalesmanWithdrawalLast = async () => {
      const { config } = await salesmanService.getSalesmanWithdrawalLast();
      form.setValue('account', config.account || '');
      form.setValue('name', config.name || '');
    };

    if (open) {
      getSalesmanWithdrawalLast();
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { account, channel, name, price } = values;
      await salesmanService.withdrawal({
        price,
        channel,
        config: {
          account,
          name,
        },
      });
      toast.success('申请成功');
      getSalesmanStatistics();
      setOpen(false);
    } catch (e) {
      toast.error(e as string);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(val) => setOpen(val)}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex justify-between">
            提现申请
            <Button className="h-6 w-6 p-1" variant={'ghost'} onClick={() => setOpen(false)}>
              <X size={16} />
            </Button>
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mb-4 space-y-3">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel className="w-[6rem] shrink-0">提现金额</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入提现金额，最少0.1元" type="number" {...field} />
                      </FormControl>
                    </div>
                    <FormDescription className="pl-[6rem]">剩余可提现：{statistics.balance}</FormDescription>
                    <FormMessage className="pl-[6rem]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="channel"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel className="w-[6rem] shrink-0">提现方式</FormLabel>
                      <FormControl>
                        <RadioGroup {...field}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="alipay" id="r1" />
                            <Label htmlFor="r1">支付宝</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </div>
                    <FormMessage className="pl-[6rem]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="account"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel className="w-[6rem] shrink-0">支付宝手机号</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入支付宝手机号" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage className="pl-[6rem]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel className="w-[6rem] shrink-0">收款人姓名</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入收款人姓名" {...field} />
                      </FormControl>
                    </div>
                    <FormDescription className="pl-[6rem]">请与支付宝账号保持一致</FormDescription>
                    <FormMessage className="pl-[6rem]" />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                申请提现
              </Button>
            </form>
          </Form>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
