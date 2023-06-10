import { useEffect, useState } from 'react';

import { PackageType } from '@/store';
import billingService from '@/api/billing';
import SvgIcon from '@/components/SvgIcon';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Billing() {
  const [billingPackage, setBillingPackage] = useState<PackageType[]>([]);

  useEffect(() => {
    const getBillingPackage = async () => {
      const res = await billingService.getBillingPackage();
      setBillingPackage(res);
    };
    getBillingPackage();
  }, []);

  return (
    <div className="scroll-bar-none mx-auto max-w-7xl flex-1 overflow-auto px-6 py-12">
      <div className="xs:block flex flex-wrap justify-between sm:grid sm:max-w-none sm:grid-cols-2 sm:gap-6 sm:space-y-0 lg:mx-auto lg:max-w-4xl xl:mx-0 xl:max-w-none xl:grid-cols-4">
        {billingPackage.map((item, index) => (
          <div
            key={index}
            className="w-48-100 mb-4 divide-y divide-gray-200 rounded-lg border border-gray-200 shadow-sm sm:mb-0 sm:w-auto"
          >
            <div className="p-4 text-center sm:p-6">
              <h2 className="h-12 text-lg font-medium leading-6 text-gray-900">{item.name}</h2>
              <p className="mt-4 sm:mt-8">
                <span className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">{item.price}</span>
                <span className="text-base font-medium text-gray-500">元</span>
              </p>
              <div className="h-6 text-sm text-red-500">{item.identity === 2 ? '开发者专享' : ''}</div>
              <Button className="mt-2 w-full">购买</Button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-4">
        <Input placeholder="请输入兑换码" />
        <Button className="shrink-0">立即兑换</Button>
      </div>
      <h3 className="mt-6 flex items-center justify-between text-base font-medium">
        <div className="flex items-center">
          <SvgIcon icon="material-symbols:book-outline-rounded" className="mr-2" />
          充值说明
        </div>
        <Button className="shrink-0">充值记录</Button>
      </h3>
      <ul className="mt-6 space-y-4">
        <li className="flex space-x-3">1. 账户充值仅限微信在线支付方式，充值金额实时到账</li>
        <li className="flex space-x-3">2. 账户有效次数自充值日起至用完为止</li>
      </ul>
    </div>
  );
}
