import { twMerge } from 'tailwind-merge';
import { ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function copyToClipboard(text: string) {
  // try {
  //   await navigator.clipboard.writeText(text.trim());
  // } catch (err) {

  // }
  const textarea = document.createElement('textarea');
  textarea.id = '111';
  document.body.appendChild(textarea);
  // 隐藏此输入框
  textarea.style.position = 'fixed';
  textarea.style.clip = 'rect(0 0 0 0)';
  textarea.style.top = '10px';
  // 赋值
  textarea.value = text;
  // 选中
  textarea.select();
  // 复制
  const res = document.execCommand('copy', false);
  console.log(res);
  // 移除输入框
  // document.body.removeChild(textarea);
}
