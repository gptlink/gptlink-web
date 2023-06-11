import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const FormSchema = z.object({
  company_name: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  name: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  mobile: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  email: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
});

type DeveloperApplyDialogProps = {
  open: boolean;
  handleOpenChange: (val: boolean) => void;
};

enum DeveloperTypeEnums {
  PERSONAL = 1,
  ENTERPRISE = 2,
}

export function DeveloperApplyDialog({ open, handleOpenChange }: DeveloperApplyDialogProps) {
  const [type, setType] = useState(DeveloperTypeEnums.ENTERPRISE);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = () => {
    return false;
  };

  const getFormList = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{type === DeveloperTypeEnums.ENTERPRISE ? '企业开发者申请' : '个人开发者申请'}</CardTitle>
          <CardDescription>填写企业名称、联系人、手机号、邮箱即可申请成为企业开发者</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
              {type === DeveloperTypeEnums.ENTERPRISE && (
                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>企业名称</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>联系人</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>手机号</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>邮箱</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="mt-4 w-full" type="submit">
                下一步
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogTitle>申请成为开发者</DialogTitle>
        <DialogHeader>
          <DialogDescription asChild>
            <Tabs value={type} onValueChange={(val: number) => setType(val)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value={DeveloperTypeEnums.ENTERPRISE}>企业</TabsTrigger>
                <TabsTrigger value={DeveloperTypeEnums.PERSONAL}>个人</TabsTrigger>
              </TabsList>
              <TabsContent value={DeveloperTypeEnums.ENTERPRISE}>{getFormList()}</TabsContent>
              <TabsContent value={DeveloperTypeEnums.PERSONAL}>{getFormList()}</TabsContent>
            </Tabs>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
