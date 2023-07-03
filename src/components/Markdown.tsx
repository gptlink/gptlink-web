import { useRef, ReactNode } from 'react';
import { Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import RehypeHighlight from 'rehype-highlight';
import RehypeKatex from 'rehype-katex';
import RemarkBreaks from 'remark-breaks';
import RemarkGfm from 'remark-gfm';
import RemarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';

import { Button } from './ui/button';

import { copyToClipboard } from '@/utils';

export function PreCode(props: { children: ReactNode }) {
  const ref = useRef<HTMLPreElement>(null);

  return (
    <pre ref={ref} className="group relative mt-2 overflow-auto rounded bg-primary/90 p-2 text-primary-foreground">
      <Button
        title="复制"
        variant={'secondary'}
        className="absolute right-0 mr-2 hidden h-6 w-6 rounded p-0 group-hover:flex"
        onClick={() => {
          if (ref.current) {
            const code = ref.current.innerText;
            copyToClipboard(code);
            toast.success('已复制到剪贴板');
          }
        }}
      >
        <Copy size={14} />
      </Button>
      {props.children}
    </pre>
  );
}

export function Markdown(props: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
      rehypePlugins={[rehypeRaw, RehypeKatex, [RehypeHighlight, { detect: true, ignoreMissing: true }]]}
      components={{ pre: PreCode }}
    >
      {props.content}
    </ReactMarkdown>
  );
}
