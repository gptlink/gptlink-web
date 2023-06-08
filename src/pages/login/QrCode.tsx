import { Dialog, DialogContent, DialogDescription, DialogHeader } from '@/components/ui/dialog';

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
          <DialogDescription>
            <iframe
              className="m-auto	 h-[30rem] w-full overflow-hidden py-8"
              src={qrCode}
              sandbox="allow-scripts allow-top-navigation"
            />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
