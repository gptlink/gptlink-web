import { Loader2 } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PayInfoType } from './index';

type PayDialogProps = {
  open: boolean;
  payInfo: PayInfoType;
  handleOpenChange: (val: boolean) => void;
};

export function PayDialog({ open, payInfo, handleOpenChange }: PayDialogProps) {
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogTitle>微信扫码支付</DialogTitle>
        <DialogHeader>
          <DialogDescription asChild>
            {payInfo ? (
              <div className="pb-10">
                <div className="my-8 text-center text-4xl font-bold text-secondary-foreground">￥ {payInfo.price}</div>
                <QRCodeCanvas
                  className="m-auto"
                  style={{
                    width: '16rem',
                    height: '16rem',
                  }}
                  value={payInfo.code_url}
                />
              </div>
            ) : (
              <Loader2 className="m-auto my-32 animate-spin" />
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
