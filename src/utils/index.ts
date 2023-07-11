import { twMerge } from 'tailwind-merge';
import { ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function copyToClipboard(text: string, targetDom?: Element | null) {
  try {
    await navigator.clipboard.writeText(text.trim());
  } catch (error) {
    const textarea = document.createElement('textarea');
    textarea.value = text.trim();
    document.body.appendChild(textarea);
    if (targetDom) {
      targetDom.appendChild(textarea);
    } else {
      document.body.appendChild(textarea);
    }
    textarea.select();
    document.execCommand('copy');

    if (targetDom) {
      targetDom.removeChild(textarea);
    } else {
      document.body.removeChild(textarea);
    }
  }
}
