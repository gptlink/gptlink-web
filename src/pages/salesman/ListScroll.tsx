import { useState, useEffect, CSSProperties } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import salesmanService, { SalesmanChildType, SalesmanOrderType } from '@/api/salesman';

export enum TypeEnums {
  ORDER = 'order',
  CHILD = 'child',
}

type ListScrollProps = {
  type: TypeEnums;
  style?: CSSProperties;
};

export function ListScroll({ type, style }: ListScrollProps) {
  const [list, setList] = useState<SalesmanChildType[]>([]);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [perPage] = useState(20);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreData = async () => {
    let res: SalesmanChildType[] = [];
    if (type === TypeEnums.CHILD) {
      res = await salesmanService.getSalesmanChildList(perPage, page);
    } else if (type === TypeEnums.ORDER) {
      const data = await salesmanService.getSalesmanOrderList(perPage, page);
      res = data.map((val: SalesmanOrderType) => {
        return {
          nickname: val.custom.nickname,
          order_price: val.price,
          created_at: val.created_at,
          order_num: 0,
        };
      });
    }
    if (res.length < perPage) {
      setHasMore(false);
    } else {
      setPage(page + 1);
    }
    setList(list.concat(res));
  };

  useEffect(() => {
    const listScrollRef = document.querySelector('.list-scroll');
    setScrollHeight(listScrollRef?.clientHeight || 0);

    fetchMoreData();
  }, []);

  return (
    <div className="list-scroll h-full" style={style}>
      {scrollHeight ? (
        <InfiniteScroll
          hasMore={hasMore}
          loader={<p className="p-4 text-center text-gray-500">加载中...</p>}
          dataLength={list.length}
          height={scrollHeight}
          endMessage={<p className="p-4 text-center text-gray-500">没有数据了～</p>}
          next={fetchMoreData}
        >
          <ul>
            {list.map((item, index) => (
              <li key={index}>
                <div className="flex p-4 text-gray-500">
                  <div className="w-5/12">
                    <p className="truncate text-xs font-medium">{item.nickname}</p>
                    <p className="mt-2 flex items-center text-xs">
                      <span className="truncate">
                        {type === TypeEnums.CHILD ? '贡献佣金' : '获得佣金'}：
                        <span className="text-gray-900">{item.order_price}</span>
                      </span>
                    </p>
                  </div>
                  <div className="w-7/12">
                    <div>
                      <p className="text-xs">
                        <span className="truncate">关联时间：{item.created_at}</span>
                      </p>
                      {type === TypeEnums.CHILD && (
                        <p className="mt-2 flex items-center text-xs">
                          <span className="truncate">
                            贡献订单数：<span className="text-gray-900">{item.order_num}</span>
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </InfiniteScroll>
      ) : (
        <></>
      )}
    </div>
  );
}
