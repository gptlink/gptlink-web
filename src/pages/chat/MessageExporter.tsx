import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { toJpeg } from 'html-to-image';
import { DownloadIcon } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

import { ChatItemType } from '@/store';
import { Button } from '@/components/ui/button';
import { saveAs } from 'file-saver';
import { ChatItem } from './ChatItem';

const MessageExporter = ({ messages, shareUrl }: { messages: ChatItemType[]; shareUrl: string }) => {
  const canvasRef = useRef<HTMLImageElement>(null);
  const messagesRef = useRef<HTMLImageElement>(null);
  const drawImage = async () => {
    if (!messagesRef.current) return;
    const dataUrl = await toJpeg(messagesRef.current, { style: { opacity: '1' } });
    saveAs(dataUrl, '聊天记录');
    if (!canvasRef.current) return;
    canvasRef.current.src = dataUrl;
  };

  return (
    <>
      {createPortal(
        <div ref={messagesRef} className="bg-background p-8">
          {messages.map((item, index) => (
            <ChatItem key={index} data={item} isDownload />
          ))}
          <div className="m-auto mt-10 flex flex-col items-center gap-2">
            <QRCodeCanvas
              style={{
                width: '8rem',
                height: '8rem',
              }}
              value={shareUrl}
            />
            <div>扫一扫，马上体验</div>
          </div>
        </div>,
        document.body,
      )}
      <Button
        disabled={messages.length === 0}
        variant={'ghost'}
        className="flex w-32 gap-2"
        onClick={() => {
          drawImage();
        }}
      >
        <DownloadIcon size={20} /> 生成图片
      </Button>
    </>
  );
};
export default MessageExporter;
