import { Loader2 } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

import { PayInfoType } from '@/api/billing';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

type PayDialogProps = {
  open: boolean;
  payInfo: PayInfoType | null;
  handleOpenChange: (val: boolean) => void;
};

export function PayDialog({ open, payInfo, handleOpenChange }: PayDialogProps) {
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogTitle>微信扫码支付</DialogTitle>
        {payInfo ? (
          <div className="pb-10">
            <div className="my-8 text-center text-4xl font-bold text-secondary-foreground">￥ {payInfo.price}</div>
            <QRCodeCanvas
              className="m-auto"
              style={{
                width: '16rem',
                height: '16rem',
              }}
              value={payInfo.data.code_url}
            />
          </div>
        ) : (
          <Loader2 className="m-auto my-32 animate-spin" />
        )}
      </DialogContent>
    </Dialog>
  );
}
