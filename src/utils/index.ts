import { twMerge } from 'tailwind-merge';
import { ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text.trim());
  } catch (error) {
    const textarea = document.createElement('textarea');
    textarea.value = text.trim();
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}
