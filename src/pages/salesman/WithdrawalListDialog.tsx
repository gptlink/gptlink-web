import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';

import salesmanService, { SalesmanWithdrawalType } from '@/api/salesman';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

const StatusMap: { [key: number]: string } = {
  1: '待审核',
  2: '审核通过',
  3: '已提现',
};

export function WithdrawalListDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [list, setList] = useState<SalesmanWithdrawalType[]>([]);
  const [perPage] = useState(20);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreData = async () => {
    const data: SalesmanWithdrawalType[] = await salesmanService.getSalesmanWithdrawalList(perPage, page);
    if (data.length < perPage) {
      setHasMore(false);
    } else {
      setPage(page + 1);
    }
    setList(list.concat(data));
  };

  useEffect(() => {
    fetchMoreData();
  }, []);

  return (
    <AlertDialog open={open} onOpenChange={(val) => setOpen(val)}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex justify-between">
            提现记录
            <Button className="h-6 w-6 p-1" variant={'ghost'} onClick={() => setOpen(false)}>
              <X size={16} />
            </Button>
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="h-[60vh]">
          <InfiniteScroll
            hasMore={hasMore}
            loader={<p className="p-4 text-center text-gray-500">加载中...</p>}
            dataLength={list.length}
            endMessage={<p className="p-4 text-center text-gray-500">没有数据了～</p>}
            next={fetchMoreData}
          >
            <ul>
              {list.map((item, index) => (
                <li key={index}>
                  <div className="flex p-4 text-gray-500">
                    <div className="w-5/12">
                      <p className="truncate text-xs font-medium">提现金额：{item.price}元</p>
                      <p className="mt-2 flex items-center text-xs">
                        <span className="truncate">
                          提现状态：<span>{StatusMap[item.status]}</span>
                        </span>
                      </p>
                    </div>
                    <div className="w-7/12">
                      <div>
                        <p className="text-xs">
                          <span className="truncate">申请时间：{item.created_at}</span>
                        </p>
                        {item.status === 3 && item.serial_no ? (
                          <p className="mt-2 text-xs">
                            <span className="break-all">支付宝订单号：{item.serial_no}</span>
                          </p>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </InfiniteScroll>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
