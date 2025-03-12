import React from 'react';
import { Spinner } from '@/shared/components/ui/Spinner';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';

interface DataWithInfiniteScrollProps<T> {
  items: T[];
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  renderItem: (item: T) => React.ReactNode;
  emptyMessage?: string;
  rootMargin?: string;
}

export function DataWithInfiniteScroll<T>({
                                            items,
                                            hasMore,
                                            isLoading,
                                            onLoadMore,
                                            renderItem,
                                            emptyMessage = "Данные не найдены",
                                            rootMargin = "500px"
                                          }: DataWithInfiniteScrollProps<T>) {

  const { targetRef } = useInfiniteScroll({
    loading: isLoading,
    hasMore,
    onLoadMore,
    rootMargin,
  });

  if (isLoading && !items.length) {
    return <Spinner className="self-center" />;
  }

  if (!isLoading && !items.length) {
    return <p>{emptyMessage}</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map(item => renderItem(item))}

      {hasMore && (
        <div ref={targetRef} className="flex justify-center p-4">
          {isLoading && <Spinner />}
        </div>
      )}
    </div>
  );
}