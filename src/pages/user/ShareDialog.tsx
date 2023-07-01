import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { toast } from 'react-hot-toast';
import { toJpeg } from 'html-to-image';
import { saveAs } from 'file-saver';
import { ScrollArea } from '@/components/ui/scroll-area';

import poster from '@/assets/poster.png';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { copyToClipboard } from '@/utils';
import { useMobileScreen } from '@/hooks/use-mobile-screen';

type ShareDialogProps = {
  open: boolean;
  shareUrl: string;
  handleOpenChange: (val: boolean) => void;
};

export function ShareDialog({ open, shareUrl, handleOpenChange }: ShareDialogProps) {
  const posterRef = useRef<HTMLDivElement>(null);
  const isMobileScreen = useMobileScreen();
  const [dataUrl, setDataUrl] = useState('');

  const drawImage = async (element: HTMLElement) => {
    console.log(element);
    const res = await toJpeg(element, { style: { opacity: '1' } });
    setDataUrl(res);
  };

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        if (!posterRef.current) return;
        drawImage(posterRef.current);
      }, 300);
    }
  }, [open]);

  return (
    <>
      {open &&
        createPortal(
          <div ref={posterRef} className="relative w-[25rem]">
            <img src={poster} className="w-full" />
            <QRCodeCanvas
              className="absolute bottom-2 left-[50%] m-auto -translate-x-1/2"
              style={{
                width: '3.5rem',
                height: '3.5rem',
              }}
              value={shareUrl}
            />
          </div>,
          document.body,
        )}
      <AlertDialog open={open} onOpenChange={handleOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>分享海报</AlertDialogTitle>
          </AlertDialogHeader>
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
            <ScrollArea>
              <AlertDialogDescription className="h-[35rem]">
                <img src={dataUrl} className="w-full" alt="" />
              </AlertDialogDescription>
            </ScrollArea>

            <AlertDialogDescription className="mt-2 text-center">
              {isMobileScreen && '长按'}保存上方图片，分享你专属海报给朋友
            </AlertDialogDescription>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            {!isMobileScreen && (
              <AlertDialogAction
                onClick={() => {
                  saveAs(dataUrl, '分享海报.jpg');
                }}
              >
                下载
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
