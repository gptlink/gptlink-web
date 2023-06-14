import { useRef, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import poster from '@/assets/poster.png';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { copyToClipboard } from '@/utils';
import { toast } from 'react-hot-toast';
import { toJpeg } from 'html-to-image';

type ShareDialogProps = {
  open: boolean;
  shareUrl: string;
  handleOpenChange: (val: boolean) => void;
};

export function ShareDialog({ open, shareUrl, handleOpenChange }: ShareDialogProps) {
  const canvasRef = useRef<HTMLImageElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);

  const drawImage = async (element: HTMLElement) => {
    const dataUrl = await toJpeg(element, { style: { opacity: '1' } });
    if (!canvasRef.current) return;
    canvasRef.current.src = dataUrl;
  };

  useEffect(() => {
    setTimeout(() => {
      if (!posterRef.current) return;
      drawImage(posterRef.current);
    }, 1000);
  }, []);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[25rem]">
        <DialogTitle>分享</DialogTitle>
        <DialogHeader>
          <DialogDescription asChild>
            <div>
              <div className="mb-2 flex">
                <Input value={shareUrl} readOnly></Input>
                <Button
                  className="ml-2 shrink-0"
                  onClick={() => {
                    copyToClipboard(shareUrl);
                    toast.success('复制成功');
                  }}
                >
                  复制链接
                </Button>
              </div>
              <div className="relative">
                <img ref={canvasRef} src="" className="absolute left-0 top-0 w-full" />
                <div ref={posterRef}>
                  <img src={poster} className="w-full" />
                  <QRCodeCanvas
                    className="absolute bottom-1 left-[50%] m-auto -translate-x-1/2"
                    style={{
                      width: '3.5rem',
                      height: '3.5rem',
                    }}
                    value={shareUrl}
                  />
                </div>
              </div>
              <p className="mt-4 text-center">保存上方图片，分享你专属海报给朋友</p>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
