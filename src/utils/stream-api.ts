import { API_DOMAIN } from './request';
import { StoreKey } from '@/constants';

export enum statusEnum {
  START = 'start',
  PENDING = 'pending',
  COMPLETED = 'completed',
  ABORT = 'abort',
}

type SendMessageType = {
  message: string;
  model_id?: string;
  request_id?: string;
  onProgress: (_: string) => void;
  onFinish: (_: string) => void;
  onError: (_: string) => void;
};

export default class StreamAPI {
  private _status: string;
  constructor() {
    this._status = statusEnum.ABORT;
  }

  set status(status) {
    this._status = status;
  }

  get status() {
    return this._status;
  }

  abort() {
    this.status = statusEnum.ABORT;
  }

  async send({ message, model_id, request_id, onProgress, onFinish, onError }: SendMessageType) {
    this.status = statusEnum.START;

    const access_token = localStorage.getItem(StoreKey.AccessToken);

    const response = await fetch(`${API_DOMAIN}/openai/chat-process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        message,
        model_id,
        request_id,
      }),
    });

    if (!response.ok) {
      onError(`${response.status}:请求过于频繁，请稍等一分钟再试`);
      this.status = statusEnum.ABORT;
      return;
    }

    const data = response.body;
    if (!data) {
      onError(`${response.status}:没有响应数据，请重试`);
      this.status = statusEnum.ABORT;
      return;
    }

    if (this.status === statusEnum.START) {
      this.status = statusEnum.PENDING;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder('utf-8');
    let done = false;

    let resChunkValue = '';

    while (!done && this.status === statusEnum.PENDING) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;

      const chunkValue = decoder.decode(value);

      resChunkValue = chunkValue;

      try {
        const res = JSON.parse(`[${chunkValue.substring(0, chunkValue.length - 1)}]`);
        onProgress(res[0].messages);
      } catch (e) {
        console.log(e);
      }
    }

    if (done) {
      this.status = statusEnum.COMPLETED;
      onFinish(resChunkValue);
    }
  }
}

export const streamAPI = new StreamAPI();
