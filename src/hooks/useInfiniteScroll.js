import { useState, useEffect } from 'react';

const useInfiniteScroll = (callback, ) => {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isFetching) return;
    callback();
  }, [isFetching]);

  function handleScroll() {

    if (document.documentElement.scrollHeight - (document.documentElement.scrollTop + document.documentElement.clientHeight) > 100   || isFetching) return;
    setIsFetching(true);
  }

  return [isFetching, setIsFetching];
};

export default useInfiniteScroll;