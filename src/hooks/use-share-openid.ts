import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { StoreKey } from '@/constants';

const useShareOpenid = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const shareOpenId = searchParams.get('shareOpenId');
    if (shareOpenId) {
      localStorage.setItem(StoreKey.ShareOpenId, shareOpenId);
      setSearchParams('');
    }
  }, []);
};
export default useShareOpenid;
