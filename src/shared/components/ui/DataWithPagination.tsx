import React, { useState, useEffect } from 'react';
import { Pagination } from '@/shared/components/ui/Pagination';
import { Spinner } from '@/shared/components/ui/Spinner';

interface DataWithPaginationProps<T> {
  totalCount: number;
  pageSize: number;
  fetchPage: (pageNumber: number) => Promise<{ items: T[], loadedFromCache: boolean }>;
  isLoading: boolean;
  pagesCache: Record<number, T[]>;
  renderItem: (item: T) => React.ReactNode;
  emptyMessage?: string;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export function DataWithPagination<T>({
                                        totalCount,
                                        pageSize,
                                        fetchPage,
                                        isLoading,
                                        pagesCache,
                                        renderItem,
                                        emptyMessage = "Данные не найдены",
                                        currentPage: externalCurrentPage,
                                        onPageChange
                                      }: DataWithPaginationProps<T>) {
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [displayItems, setDisplayItems] = useState<T[]>([]);
  const [pageLoading, setPageLoading] = useState(false);

  const currentPage = externalCurrentPage !== undefined ? externalCurrentPage : internalCurrentPage;

  useEffect(() => {
    const loadPageData = async () => {
      if (pagesCache[currentPage]) {
        setDisplayItems(pagesCache[currentPage]);
      } else {
        setPageLoading(true);
        const { items } = await fetchPage(currentPage);
        setDisplayItems(items);
        setPageLoading(false);
      }
    };

    loadPageData();
  }, [currentPage, pagesCache, fetchPage]);

  const handlePageChange = (page: number) => {
    if (page === currentPage) return;
    console.log(`Переход на страницу ${page}`);

    if (onPageChange) {
      onPageChange(page);
    } else {
      setInternalCurrentPage(page);
    }
  };

  const showMainLoadingSpinner = (isLoading || pageLoading) && !displayItems.length;

  const showPageLoadingSpinner = pageLoading && displayItems.length > 0;

  if (showMainLoadingSpinner) {
    return <Spinner className="self-center" />;
  }

  if (!isLoading && !pageLoading && !displayItems.length) {
    return <p>{emptyMessage}</p>;
  }

  return (
    <div className="flex flex-col gap-3 relative">
      {showPageLoadingSpinner && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
          <Spinner />
        </div>
      )}

      <div className="flex flex-col gap-3">
        {displayItems.map(item => renderItem(item))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
    </div>
  );
}