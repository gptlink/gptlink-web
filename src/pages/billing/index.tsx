import { useEffect, useState } from 'react';
import { Loader2, CheckCircle2Icon } from 'lucide-react';
import toast from 'react-hot-toast';

import { useBillingStore } from '@/store';
import billingService, { PackageType, PayInfoType, Channel, PayType } from '@/api/billing';
import SvgIcon from '@/components/SvgIcon';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

import { BillingRecordsDialog } from './BillingRecords';
import { PayDialog } from './PayDialog';

let payStatusInterval = 0;

export default function Billing() {
  const [billingPackage, setBillingPackage] = useState<PackageType[]>([]);
  const [payDialogShow, setPayDialogShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [redemptionCode, setRedemptionCode] = useState('');
  const [payInfo, setPayInfo] = useState<PayInfoType | null>(null);
  const [getCurrentBilling] = useBillingStore((state) => [state.getCurrentBilling]);

  useEffect(() => {
    const getBillingPackage = async () => {
      setIsLoading(true);
      const res = await billingService.getBillingPackage();
      setBillingPackage(res);
      setIsLoading(false);
    };
    getBillingPackage();
  }, []);

  const handleExchangeRedemptionCode = async () => {
    try {
      await billingService.exchangeRedemptionCode(redemptionCode);
      toast.success('兑换成功');
      getCurrentBilling();
    } catch (e) {
      toast.error(e as string);
    } finally {
      setRedemptionCode('');
    }
  };

  const handlePay = async (item: PackageType) => {
    const res = await billingService.orderBilling({
      package_id: item.id,
      channel: Channel.WECHAT,
      pay_type: PayType.NATIVE,
      platform: 1,
    });
    setPayDialogShow(true);

    const payInfoRes = await billingService.billingPayDetail(res.id);
    setPayInfo(payInfoRes);

    payStatusInterval = setInterval(async () => {
      const { status } = await billingService.billingDetail(payInfoRes.id);
      if (status == 2) {
        toast.success('支付成功');
        setPayDialogShow(false);
        setPayInfo(null);
        clearInterval(payStatusInterval);
      }
    }, 1500);
  };

  const handlePayDialogShow = (val: boolean) => {
    setPayDialogShow(val);
    clearInterval(payStatusInterval);
  };

  return (
    <ScrollArea>
      <div className="mx-auto max-w-7xl flex-1 overflow-auto px-6 py-12">
        {isLoading ? (
          <Loader2 className="m-auto my-16 animate-spin" />
        ) : (
          <div className="flex flex-wrap justify-between sm:grid sm:max-w-none sm:grid-cols-2 sm:gap-6 sm:space-y-0 lg:mx-auto lg:max-w-4xl xl:mx-0 xl:max-w-none xl:grid-cols-4">
            {billingPackage.map((item, index) => (
              <div key={index} className="rounded-lg border p-4 shadow">
                <p className="mb-4 border-b pb-4">
                  <span className="text-2xl font-bold tracking-tight  sm:text-4xl">{item.price}</span>
                  <span className="ml-2 text-base font-medium ">元</span>
                </p>
                <p className="mb-2 flex items-center gap-2">
                  <CheckCircle2Icon strokeWidth="3" className="text-lime-500" size={16} />
                  {item.name}
                </p>
                <p className="flex h-3 items-center gap-2">
                  {item.identity === 2 && (
                    <>
                      <CheckCircle2Icon strokeWidth="3" className="text-rose-500" size={16} />
                      开发者专享
                    </>
                  )}
                </p>
                <Button className="mt-14 flex w-full" onClick={() => handlePay(item)}>
                  购买
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex gap-4">
          <Input
            placeholder="请输入兑换码"
            value={redemptionCode}
            onChange={(e) => setRedemptionCode(e.target.value)}
          />
          <Button disabled={!redemptionCode} className="shrink-0" onClick={handleExchangeRedemptionCode}>
            立即兑换
          </Button>
        </div>
        <h3 className="mt-6 flex items-center justify-between text-base font-medium">
          <div className="flex items-center">
            <SvgIcon icon="material-symbols:book-outline-rounded" className="mr-2" />
            充值说明
          </div>
          <BillingRecordsDialog>
            <Button className="shrink-0">充值记录</Button>
          </BillingRecordsDialog>
        </h3>
        <ul className="mt-6 space-y-4">
          <li className="flex space-x-3">1. 账户充值仅限微信在线支付方式，充值金额实时到账</li>
          <li className="flex space-x-3">2. 账户有效次数自充值日起至用完为止</li>
        </ul>
      </div>

      <PayDialog open={payDialogShow} payInfo={payInfo} handleOpenChange={handlePayDialogShow} />
    </ScrollArea>
  );
}
