import React, { useState, useEffect } from 'react';
import { Toggle } from '@/shared/components/ui/Toggle';
import { DataWithPagination } from './DataWithPagination';
import { DataWithInfiniteScroll } from './DataWithInfiniteScroll';
import { useDataFetching } from '@/shared/hooks/useDataFetching';

interface PageInfo {
  endCursor: string | null;
  hasNextPage: boolean;
}

interface DataListControllerProps<T> {
  fetchFunction: (params: { first: number; after: string | null }) => Promise<{
    items: T[];
    pageInfo: PageInfo;
    totalCount: number;
  }>;
  pageSize: number;
  renderItem: (item: T) => React.ReactNode;
  emptyMessage?: string;
  allowToggle?: boolean;
  defaultMode?: 'pagination' | 'infiniteScroll';
}

export function DataListController<T>({
                                        fetchFunction,
                                        pageSize,
                                        renderItem,
                                        emptyMessage = "Данные не найдены",
                                        allowToggle = true,
                                        defaultMode = 'pagination'
                                      }: DataListControllerProps<T>) {
  const [useInfinite, setUseInfinite] = useState(defaultMode === 'infiniteScroll');
  const [currentPage, setCurrentPage] = useState(1);

  const {
    isLoading,
    totalCount,
    pageInfo,
    pagesCache,
    allItems,
    fetchPage,
    loadMore,
    setAllItems
  } = useDataFetching<T>({ fetchFunction, pageSize });

  useEffect(() => {
    fetchPage(1).then(({ items }) => {
      if (useInfinite) {
        setAllItems(items);
      }
    });
  }, []);

  const loadAllPreviousPages = async (targetPage: number) => {
    const allLoadedItems: T[] = [];

    for (let i = 1; i <= targetPage; i++) {
      if (pagesCache[i]) {
        allLoadedItems.push(...pagesCache[i]);
      } else {
        const { items } = await fetchPage(i);
        allLoadedItems.push(...items);
      }
    }

    return allLoadedItems;
  };

  const handleToggleChange = async (value: boolean) => {
    setUseInfinite(value);

    if (value) {
      const items = await loadAllPreviousPages(currentPage);
      setAllItems(items);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      {allowToggle && (
        <Toggle
          enabled={useInfinite}
          onChange={handleToggleChange}
          labelLeft="Пагинация"
          labelRight="Бесконечный скролл"
          className="self-end"
        />
      )}

      {useInfinite ? (
        <DataWithInfiniteScroll
          items={allItems}
          hasMore={pageInfo.hasNextPage}
          isLoading={isLoading}
          onLoadMore={loadMore}
          renderItem={renderItem}
          emptyMessage={emptyMessage}
        />
      ) : (
        <DataWithPagination
          totalCount={totalCount}
          pageSize={pageSize}
          fetchPage={fetchPage}
          isLoading={isLoading}
          pagesCache={pagesCache}
          renderItem={renderItem}
          emptyMessage={emptyMessage}
          onPageChange={handlePageChange}
          currentPage={currentPage}
        />
      )}
    </div>
  );
}