import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { toJpeg } from 'html-to-image';
import { DownloadIcon } from 'lucide-react';

import { ChatItemType } from '@/store';
import { Button } from '@/components/ui/button';
import { saveAs } from 'file-saver';
import { ChatItem } from './ChatItem';

const MessageExporter = ({ messages }: { messages: ChatItemType[] }) => {
  const canvasRef = useRef<HTMLImageElement>(null);
  const messagesRef = useRef<HTMLImageElement>(null);
  const drawImage = async () => {
    if (!messagesRef.current) return;
    const dataUrl = await toJpeg(messagesRef.current, { style: { opacity: '1' } });
    console.log(dataUrl);
    saveAs(dataUrl, '聊天记录');
    if (!canvasRef.current) return;
    canvasRef.current.src = dataUrl;
  };

  return (
    <>
      {createPortal(
        <div ref={messagesRef} className="opacity-0">
          {messages.map((item, index) => (
            <ChatItem key={index} data={item} />
          ))}
        </div>,
        document.body,
      )}
      <Button
        variant={'ghost'}
        className="flex w-28 gap-2"
        onClick={() => {
          drawImage();
        }}
      >
        <DownloadIcon size={16} /> 生成图片
      </Button>
    </>
  );
};
export default MessageExporter;
