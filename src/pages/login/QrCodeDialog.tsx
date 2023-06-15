import { Dialog, DialogContent } from '@/components/ui/dialog';

type QrCodeDialogProps = {
  open: boolean;
  qrCode: string;
  handleOpenChange: (val: boolean) => void;
};

export function QrCodeDialog({ open, qrCode, handleOpenChange }: QrCodeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <iframe
          className="m-auto	 h-[30rem] w-full overflow-hidden py-8"
          src={qrCode}
          sandbox="allow-scripts allow-top-navigation"
        />
      </DialogContent>
    </Dialog>
  );
}
