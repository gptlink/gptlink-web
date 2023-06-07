import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';

export function PrivacyProtocol({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>隐私协议</DialogTitle>
          <DialogDescription className="max-h-96 overflow-auto">
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export function UseProtocol({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>使用协议</DialogTitle>
          <DialogDescription className="max-h-96 overflow-auto">
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
            内容 <br />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
