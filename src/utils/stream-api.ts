import { API_DOMAIN } from './request';
import { StoreKey } from '@/constants';
import { isEmpty } from 'lodash-es';

export enum StatusEnum {
  START = 'start',
  PENDING = 'pending',
  SUCCESS = 'success',
  ERROR = 'error',
  ABORT = 'abort',
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
    this.status = StatusEnum.ABORT;
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
        const dataList = chunkValue.split('\n\ndata :');
        const chunk = dataList[dataList.length - 2] || dataList[dataList.length - 1];
        if (chunk) {
          resChunkValue = JSON.parse(chunk);
          if (resChunkValue.err_code > 0) {
            onError(resChunkValue.err_msg);
            return;
          }
          onProgress(resChunkValue);
        }
      } catch (e) {
        const res = JSON.parse(chunkValue);
        if (res.err_code > 0) {
          onError(res.err_msg);
          return;
        }
      }
    }
    if (this.status === StatusEnum.ABORT) {
      this.status = StatusEnum.SUCCESS;
      resChunkValue.messages = resChunkValue.messages + '\n[您中断了回答，若继续请刷新重试！]';
      onFinish(resChunkValue);
    }

    if (done || this.status === StatusEnum.SUCCESS) {
      this.status = StatusEnum.SUCCESS;
      if (isEmpty(resChunkValue)) {
        onError('无响应数据，请重试');
      } else {
        onFinish(resChunkValue);
      }
    }
  }
}

export const streamAPI = new StreamAPI();
