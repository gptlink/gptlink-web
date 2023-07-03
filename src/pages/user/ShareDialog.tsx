import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { toast } from 'react-hot-toast';
import { toJpeg } from 'html-to-image';
import { saveAs } from 'file-saver';
import { Loader2 } from 'lucide-react';

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
import { useCopyToClipboard } from 'usehooks-ts';
import { useMobileScreen } from '@/hooks/use-mobile-screen';
import useTask from '@/hooks/use-task';
import appService from '@/api/app';

type ShareDialogProps = {
  open: boolean;
  shareUrl: string;
  handleOpenChange: (val: boolean) => void;
};

export function ShareDialog({ open, shareUrl, handleOpenChange }: ShareDialogProps) {
  const posterRef = useRef<HTMLDivElement>(null);
  const [, copy] = useCopyToClipboard();
  const isMobileScreen = useMobileScreen();
  const [dataUrl, setDataUrl] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [loading, setIsLoading] = useState(false);
  const { shareCallback } = useTask();

  const drawImage = async (element: HTMLElement) => {
    const res = await toJpeg(element, { style: { opacity: '1' } });
    setDataUrl(res);
  };

  useEffect(() => {
    const handleDrewPoster = async () => {
      setIsLoading(true);
      const res = await appService.getShareConfig();
      setPosterUrl(res.share_img);
      setTimeout(() => {
        if (!posterRef.current) return;
        drawImage(posterRef.current);
        setIsLoading(false);
      }, 16);
    };
    if (open) {
      handleDrewPoster();
    }
  }, [open]);

  return (
    <>
      {open &&
        createPortal(
          <div ref={posterRef} className="relative w-[25rem]">
            <img src={posterUrl || poster} className="w-full" />
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
      <AlertDialog
        open={open}
        onOpenChange={(val) => {
          if (!val) {
            shareCallback();
          }
          handleOpenChange(val);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>分享海报</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="w-full overflow-hidden">
            <div className="mb-2 flex overflow-hidden">
              <Input value={shareUrl} readOnly></Input>
              <Button
                className="ml-2 shrink-0"
                onClick={() => {
                  try {
                    copy(shareUrl);
                    toast.success('复制成功');
                  } catch {
                    toast.error('复制失败');
                  }
                }}
              >
                复制链接
              </Button>
            </div>
            <ScrollArea>
              <div className="h-[35rem] max-sm:h-[25rem]">
                {loading ? (
                  <div className="p-48">
                    <Loader2 className="m-auto animate-spin" />
                  </div>
                ) : (
                  <img src={dataUrl} className="w-full" alt="" />
                )}
              </div>
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
