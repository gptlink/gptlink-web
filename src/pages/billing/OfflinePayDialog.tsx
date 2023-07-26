import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

type PayDialogProps = {
  open: boolean;
  payInfo: string;
  handleOpenChange: (val: boolean) => void;
};

export function OfflinePayDialog({ open, payInfo, handleOpenChange }: PayDialogProps) {
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogTitle>线下支付</DialogTitle>
        <div
          className="my-8 text-center text-4xl font-bold text-secondary-foreground"
          dangerouslySetInnerHTML={{ __html: payInfo }}
        ></div>
      </DialogContent>
    </Dialog>
  );
}
