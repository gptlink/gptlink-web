import request from './request';
export const statusEnum = {
  pending: 'pending',
  start: 'start',
  work: 'work',
  completed: 'completed',
  abort: 'abort',
};

type SendMessageType = {
  systemMessage: string;
  prompt: string;
  message: string;
  model_id: string;
  request_id: string;
  onProgress: (_: string) => void;
  onFinish: (_: string) => void;
  onError: (_: string) => void;
};

export default class StreamOpenAi extends EventTarget {
  private _status: string;
  constructor() {
    super();
    this._status = statusEnum.pending;
  }

  set status(status) {
    this._status = status;
    this.dispatchEvent(new CustomEvent('status', { detail: status }));
  }

  get status() {
    return this._status;
  }

  abort() {
    this.status = statusEnum.abort;
  }

  async send({ message, model_id, request_id, onProgress, onFinish, onError }: SendMessageType) {
    this.status = statusEnum.start;

    const response = await request('/openai/chat-process', {
      method: 'POST',
      body: JSON.stringify({
        message,
        model_id,
        request_id,
      }),
    });

    if (!response.ok) {
      onError(`${response.status}:请求过于频繁，请稍等一分钟再试`);
      this.status = statusEnum.pending;
      return;
    }

    const data = response.body;
    if (!data) {
      onError(`${response.status}:没有响应数据，请重试`);
      this.status = statusEnum.pending;
      return;
    }

    if (this.status === statusEnum.start) {
      this.status = statusEnum.work;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder('utf-8');
    let done = false;

    let resChunkValue = '';

    while (!done && this.status === statusEnum.work) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;

      const chunkValue = decoder.decode(value);

      try {
        resChunkValue += chunkValue;
        onProgress(resChunkValue);
      } catch {
        console.log(123);
      }
    }

    if (done) {
      this.status = statusEnum.completed;
      onFinish(resChunkValue);
    }
  }
}
