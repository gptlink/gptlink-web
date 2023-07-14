import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { omit } from 'lodash-es';
import { useNavigate } from 'react-router-dom';

import userService from '@/api/user';
import { useUserStore, useAppStore } from '@/store';
import useMobileCode from '@/hooks/use-mobile-code';
import { StoreKey } from '@/constants';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const baseForm = {
  nickname: z.string().min(2, {
    message: '请输入用户名',
  }),
  password: z.string().min(2, {
    message: '请输入密码.',
  }),
};

export function LoginForm({ protocolChecked = false }) {
  const [setUserInfo, setAccessToken] = useUserStore((state) => [state.setUserInfo, state.setAccessToken]);
  const navigate = useNavigate();
  const formSchema = z.object({
    ...baseForm,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickname: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { user, access_token } = await userService.login(values);
      setUserInfo(user);
      setAccessToken(access_token);
      navigate('/chat');
    } catch (e) {
      toast.error(e as string);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mb-4 w-[70%] space-y-3">
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center">
                <FormLabel className="w-[3.5rem] shrink-0">用户名</FormLabel>
                <FormControl>
                  <Input placeholder="请输入用户名" {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center">
                <FormLabel className="w-[3.5rem] shrink-0">密码</FormLabel>
                <FormControl>
                  <Input placeholder="请输入密码" type="password" {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={!protocolChecked} className="w-full">
          登陆
        </Button>
      </form>
    </Form>
  );
}

export function PhoneLoginForm({ oauthId = '', protocolChecked = false }) {
  const { time, handleGetCode } = useMobileCode();
  const [setUserInfo, setAccessToken] = useUserStore((state) => [state.setUserInfo, state.setAccessToken]);
  const navigate = useNavigate();
  const formSchema = z.object({
    mobile: z.string().refine((val) => /^(?:(?:\+|00)86)?1\d{10}$/.test(val), {
      message: '错误的手机号码.',
    }),
    code: z.string().min(2, {
      message: '请输入验证码.',
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mobile: '',
      code: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { user, access_token } = await userService.phoneLogin({
        ...values,
        oauth_id: oauthId,
        share_openid: localStorage.getItem(StoreKey.ShareOpenId) || '',
      });
      setUserInfo(user);
      setAccessToken(access_token);
      navigate('/chat');
    } catch (e) {
      toast.error(e as string);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mb-4 w-[70%] space-y-3">
        <FormField
          control={form.control}
          name="mobile"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center">
                <FormLabel className="w-[3.5rem] shrink-0">手机号</FormLabel>
                <FormControl>
                  <Input placeholder="请输入手机号" {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center">
                <FormLabel className="w-[3.5rem] shrink-0">验证码</FormLabel>
                <FormControl>
                  <Input placeholder="请输入密码" type="password" {...field} />
                </FormControl>
                <Button
                  type="button"
                  className="ml-2 shrink-0"
                  disabled={time > 0}
                  onClick={() => handleGetCode(form.getValues('mobile'))}
                >
                  {time > 0 ? `${time}s` : '获取验证码'}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={!protocolChecked} className="w-full">
          登陆
        </Button>
      </form>
    </Form>
  );
}

export function RegisterDialog({ children }: { children: React.ReactNode }) {
  const [setUserInfo, setAccessToken] = useUserStore((state) => [state.setUserInfo, state.setAccessToken]);
  const navigate = useNavigate();
  const { time, handleGetCode } = useMobileCode();
  const [appConfig] = useAppStore((state) => [state.appConfig]);
  const formSchema = z.object({
    mobile: z.string().refine((val) => /^(?:(?:\+|00)86)?1\d{10}$/.test(val), {
      message: '错误的手机号码.',
    }),
    repassword: z.string().min(2, {
      message: '请输入密码.',
    }),
    code: appConfig.mobile_verify
      ? z.string().min(2, {
          message: '请输入验证码.',
        })
      : z.string(),
    ...baseForm,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickname: '',
      password: '',
      mobile: '',
      repassword: '',
      code: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.password !== values.repassword) {
      toast.error('两次输入的密码不一致');
      return;
    }
    try {
      const { user, access_token } = await userService.register({
        ...omit(values, ['repassword']),
        share_openid: localStorage.getItem(StoreKey.ShareOpenId) || '',
        code: appConfig.mobile_verify ? values.code : '',
      });
      setUserInfo(user);
      setAccessToken(access_token);
      navigate('/chat');
    } catch (e) {
      toast.error(e as string);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogTitle>注册</DialogTitle>
        <DialogHeader>
          <DialogDescription asChild>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="nickname"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel className="w-[4rem] shrink-0">用户名</FormLabel>
                        <FormControl>
                          <Input placeholder="请输入用户名" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel className="w-[4rem] shrink-0">手机号码</FormLabel>
                        <FormControl>
                          <Input placeholder="请输入手机号码" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {appConfig.mobile_verify && (
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <FormLabel className="w-[4rem] shrink-0">验证码</FormLabel>
                          <FormControl>
                            <Input placeholder="请输入密码" type="password" {...field} />
                          </FormControl>
                          <Button
                            type="button"
                            className="ml-2 shrink-0"
                            disabled={time > 0}
                            onClick={() => handleGetCode(form.getValues('mobile'))}
                          >
                            {time > 0 ? `${time}s` : '获取验证码'}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel className="w-[4rem] shrink-0">密码</FormLabel>
                        <FormControl>
                          <Input placeholder="请输入密码" type="password" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="repassword"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel className="w-[4rem] shrink-0">确认密码</FormLabel>
                        <FormControl>
                          <Input placeholder="请再次输入密码" type="password" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  登陆
                </Button>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export function RetrievePasswordDialog({ children }: { children: React.ReactNode }) {
  enum VerifyTypeEnum {
    OldPassword = '1',
    Mobile = '2',
  }

  const [verifyType, setVerifyType] = useState(VerifyTypeEnum.OldPassword);
  const { time, handleGetCode } = useMobileCode();
  const [appConfig] = useAppStore((state) => [state.appConfig]);

  const formSchema = useMemo(() => {
    return z.object({
      nickname: z.string().min(2, {
        message: '请输入用户名.',
      }),
      password: z.string().min(2, {
        message: '请输入密码.',
      }),
      repassword: z.string().min(2, {
        message: '请输入密码.',
      }),
      code: appConfig.mobile_verify
        ? z.string().min(2, {
            message: '请输入验证码.',
          })
        : z.string(),
      verify:
        verifyType === VerifyTypeEnum.OldPassword
          ? z.string().min(2, { message: '请输入密码.' })
          : z.string().refine((val) => /^(?:(?:\+|00)86)?1\d{10}$/.test(val), { message: '错误的手机号码.' }),
    });
  }, [verifyType]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickname: '',
      password: '',
      repassword: '',
      verify: '',
      code: '',
    },
  });

  useEffect(() => {
    form.setValue('verify', '');
  }, [verifyType]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await userService.resetPassword({
        ...values,
        mobile: verifyType === VerifyTypeEnum.Mobile ? values.verify : '',
        reenteredPassword: verifyType === VerifyTypeEnum.OldPassword ? values.verify : '',
        verify_type: Number(verifyType),
        code: appConfig.mobile_verify ? values.code : '',
      });
      toast.success('密码修改成功');
    } catch (e) {
      toast.error(e as string);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogTitle>找回密码</DialogTitle>
        <RadioGroup value={verifyType} onValueChange={(val) => setVerifyType(val as VerifyTypeEnum)} className="flex">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={VerifyTypeEnum.OldPassword} id="r1" />
            <Label htmlFor="r1">旧密码验证</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={VerifyTypeEnum.Mobile} id="r2" />
            <Label htmlFor="r2">手机号验证</Label>
          </div>
        </RadioGroup>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel className="w-[4rem] shrink-0">用户名</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入用户名" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="verify"
              render={({ field }) => {
                return verifyType === VerifyTypeEnum.OldPassword ? (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel className="w-[4rem] shrink-0">原密码</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入原密码" type="password" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                ) : (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel className="w-[4rem] shrink-0">手机号码</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入手机号码" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            {verifyType === VerifyTypeEnum.Mobile && appConfig.mobile_verify && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel className="w-[4rem] shrink-0">验证码</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入密码" type="password" {...field} />
                      </FormControl>
                      <Button
                        type="button"
                        className="ml-2 shrink-0"
                        disabled={time > 0}
                        onClick={() => handleGetCode(form.getValues('verify'))}
                      >
                        {time > 0 ? `${time} s` : '获取验证码'}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel className="w-[4rem] shrink-0">密码</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入密码" type="password" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="repassword"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel className="w-[4rem] shrink-0">确认密码</FormLabel>
                    <FormControl>
                      <Input placeholder="请再次输入密码" type="password" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              修改密码
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
