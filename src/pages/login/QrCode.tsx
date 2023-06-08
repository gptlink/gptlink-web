import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type QrCodeProps = {
  open: boolean;
  qrCode: string;
  handleOpenChange: (val: boolean) => void;
};

export function QrCode({ open, qrCode, handleOpenChange }: QrCodeProps) {
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>隐私协议</DialogTitle>
          <DialogDescription className="h-3/4">
            <iframe className="m-auto h-96 overflow-hidden" src={qrCode} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
