import { API_DOMAIN } from './request';
import { StoreKey } from '@/constants';

export enum StatusEnum {
  START = 'start',
  PENDING = 'pending',
  SUCCESS = 'success',
  ERROR = 'error',
}

interface StreamResponseType {
  messages: string;
  id: string;
}

type SendMessageType = {
  message: string;
  modelId?: string;
  requestId?: string;
  lastId?: string;
  onProgress: (_: StreamResponseType) => void;
  onFinish: (_: StreamResponseType) => void;
  onError: (_: string) => void;
};

export default class StreamAPI {
  private _status: string;
  constructor() {
    this._status = StatusEnum.START;
  }

  set status(status) {
    this._status = status;
  }

  get status() {
    return this._status;
  }

  abort() {
    this.status = StatusEnum.SUCCESS;
  }

  async send({ message, modelId, requestId, lastId, onProgress, onFinish, onError }: SendMessageType) {
    this.status = StatusEnum.START;

    const access_token = localStorage.getItem(StoreKey.AccessToken);

    const response = await fetch(`${API_DOMAIN}/openai/chat-process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        message,
        model_id: modelId,
        request_id: requestId,
        last_id: lastId,
      }),
    });

    if (!response.ok) {
      onError('连接失败，请重试');
      this.status = StatusEnum.ERROR;
      return;
    }

    const data = response.body;
    if (!data) {
      onError('无响应数据，请重试');
      this.status = StatusEnum.ERROR;
      return;
    }

    if (this.status === StatusEnum.START) {
      this.status = StatusEnum.PENDING;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder('utf-8');
    let done = false;

    let resChunkValue;

    while (!done && this.status === StatusEnum.PENDING) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;

      const chunkValue = decoder.decode(value);

      try {
        const res = JSON.parse(`[${chunkValue.substring(0, chunkValue.length - 1)}]`);
        if (res[0]) {
          onProgress(res[0]);
          resChunkValue = res[0];
        } else {
          console.log(chunkValue);
        }
      } catch (e) {
        const res = JSON.parse(chunkValue);
        if (res.err_code > 0) {
          onError(res.err_msg);
          return;
        }
      }
    }

    if (done || this.status === StatusEnum.SUCCESS) {
      this.status = StatusEnum.SUCCESS;
      onFinish(resChunkValue);
    }
  }
}

export const streamAPI = new StreamAPI();
