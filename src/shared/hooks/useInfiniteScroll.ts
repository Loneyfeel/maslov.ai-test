import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
  threshold?: number;
}

export const useInfiniteScroll = ({
                                    loading,
                                    hasMore,
                                    onLoadMore,
                                    rootMargin = '300px',
                                    threshold = 0.1,
                                  }: UseInfiniteScrollOptions) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(loading);
  const hasCalledRef = useRef(false);

  useEffect(() => {
    isLoadingRef.current = loading;
    if (!loading) {
      hasCalledRef.current = false;
    }
  }, [loading]);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;

    if (
      entry?.isIntersecting &&
      hasMore &&
      !isLoadingRef.current &&
      !hasCalledRef.current
    ) {
      hasCalledRef.current = true;
      onLoadMore();
    }
  }, [hasMore, onLoadMore]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin,
      threshold,
    };

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(handleObserver, options);

    const currentTarget = targetRef.current;
    if (currentTarget) {
      observerRef.current.observe(currentTarget);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver, rootMargin, threshold]);

  return { targetRef };
};