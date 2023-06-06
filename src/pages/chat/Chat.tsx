import classNames from 'classnames';

const Footer = () => {
  return (
    <footer className="p-4 shadow flex gap-4 items-center">
      <div>删除</div>
      <input
        className="flex-1 h-10 p-4 leading-8 border rounded"
        type="text"
        placeholder="来说点什么...（Shift + Enter = 换行）"
      />
      <div>发送</div>
    </footer>
  );
};

const ChatItem = ({ role }: { role: string }) => {
  return (
    <div
      className={classNames('w-full p-3 rounded h-fit flex gap-4 items-start', {
        'justify-end': role === 'user',
      })}
    >
      <img
        className="w-10 rounded-full"
        src={
          role === 'user'
            ? 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKE7KHyLv1ZiaocNz6x1PWaMeOv40nyF6whYibYjlTLNEiaFvbr7taMe4JicrtA8wBZVSs9bzGAgVoxDw/132'
            : 'https://cdn.cblink.net/aiyaaa/ai-yaaa-logo.png'
        }
        alt=""
      />
      <div
        className={classNames('flex flex-col items-start', {
          'items-end': role === 'user',
        })}
      >
        <p className="text-xs">6/6/2023, 9:06:18 AM</p>
        <div className="mt-2">
          <div className="p-3 bg-[#f4f6f8] dark:bg-[#1e1e20] rounded-md">123123</div>
        </div>
      </div>
    </div>
  );
};

const ChatBody = () => {
  return (
    <main className="flex-1 p-4">
      <div className="w-fll">
        {Array.from({ length: 4 }).map((_, index) => (
          <ChatItem key={index} role={index % 2 === 0 ? 'user' : 'assistant'} />
        ))}
      </div>
    </main>
  );
};

const Chat = () => {
  return (
    <div className="flex flex-col w-full h-full">
      <ChatBody />
      <Footer />
    </div>
  );
};

export default Chat;
