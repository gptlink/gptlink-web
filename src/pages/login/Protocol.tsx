import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function PrivacyProtocol({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>隐私协议</DialogTitle>
          <DialogDescription className="h-96 overflow-auto">隐私协议</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
