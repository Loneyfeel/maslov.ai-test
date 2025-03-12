import { useState, useRef, useCallback } from 'react';

interface FetchParams {
  first: number;
  after: string | null;
}

interface PageInfo {
  endCursor: string | null;
  hasNextPage: boolean;
}

interface UseFetchingOptions<T> {
  fetchFunction: (params: FetchParams) => Promise<{
    items: T[];
    pageInfo: PageInfo;
    totalCount: number;
  }>;
  pageSize: number;
}

export function useDataFetching<T>({ fetchFunction, pageSize }: UseFetchingOptions<T>) {
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [pageInfo, setPageInfo] = useState<PageInfo>({ endCursor: null, hasNextPage: false });

  const [pagesCache, setPagesCache] = useState<Record<number, T[]>>({});
  const [cursorCache, setCursorCache] = useState<Record<number, string | null>>({ 0: null });

  const [allItems, setAllItems] = useState<T[]>([]);
  const fetchingRef = useRef(false);

  const fetchPage = useCallback(async (pageNumber: number) => {
    if (pagesCache[pageNumber]) {
      return { items: pagesCache[pageNumber], loadedFromCache: true };
    }

    setIsLoading(true);

    try {
      let closestCachedPage = 0;
      let closestCursor = null;

      for (let i = pageNumber - 1; i >= 0; i--) {
        if (cursorCache[i] !== undefined) {
          closestCachedPage = i;
          closestCursor = cursorCache[i];
          break;
        }
      }

      if (closestCachedPage === 0 && pageNumber > 1) {
        if (!pagesCache[1]) {
          const firstPageResult = await fetchFunction({
            first: pageSize,
            after: null
          });

          setPagesCache(prev => ({ ...prev, [1]: firstPageResult.items }));
          setCursorCache(prev => ({
            ...prev,
            [1]: firstPageResult.pageInfo.endCursor
          }));

          setTotalCount(firstPageResult.totalCount);

          closestCachedPage = 1;
          closestCursor = firstPageResult.pageInfo.endCursor;
        } else {
          closestCachedPage = 1;
          closestCursor = cursorCache[1];
        }
      }

      let currentCursor = closestCursor;
      let resultItems: T[] = [];

      for (let i = closestCachedPage + 1; i <= pageNumber; i++) {
        if (pagesCache[i]) {
          currentCursor = cursorCache[i];
          continue;
        }

        const result = await fetchFunction({
          first: pageSize,
          after: currentCursor
        });

        setPagesCache(prev => ({ ...prev, [i]: result.items }));
        setCursorCache(prev => ({
          ...prev,
          [i]: result.pageInfo.endCursor
        }));

        setTotalCount(result.totalCount);
        setPageInfo(result.pageInfo);

        if (i === pageNumber) {
          resultItems = result.items;
        }

        currentCursor = result.pageInfo.endCursor;
      }

      if (resultItems.length > 0) {
        return { items: resultItems, loadedFromCache: false };
      }

      if (pagesCache[pageNumber]) {
        return { items: pagesCache[pageNumber], loadedFromCache: true };
      }

      const result = await fetchFunction({
        first: pageSize,
        after: cursorCache[pageNumber - 1] || null
      });

      setPagesCache(prev => ({ ...prev, [pageNumber]: result.items }));
      setCursorCache(prev => ({
        ...prev,
        [pageNumber]: result.pageInfo.endCursor
      }));

      setTotalCount(result.totalCount);
      setPageInfo(result.pageInfo);

      return { items: result.items, loadedFromCache: false };
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
      return { items: [], loadedFromCache: false };
    } finally {
      setIsLoading(false);
    }
  }, [fetchFunction, pageSize, pagesCache, cursorCache]);

  const loadMore = useCallback(async () => {
    if (isLoading || !pageInfo.hasNextPage || fetchingRef.current) {
      return;
    }

    fetchingRef.current = true;
    setIsLoading(true);

    try {
      const nextPage = Math.ceil(allItems.length / pageSize) + 1;
      const cursor = cursorCache[nextPage - 1] || pageInfo.endCursor;

      const result = await fetchFunction({
        first: pageSize,
        after: cursor
      });

      setPageInfo(result.pageInfo);

      const newItems = result.items;

      const existingIds = new Set(allItems.map((item: any) => item.id));
      const uniqueNewItems = newItems.filter((item: any) => !existingIds.has(item.id));

      if (uniqueNewItems.length > 0) {
        setAllItems(prev => [...prev, ...uniqueNewItems]);
      }

      setPagesCache(prev => ({ ...prev, [nextPage]: uniqueNewItems }));
      setCursorCache(prev => ({
        ...prev,
        [nextPage]: result.pageInfo.endCursor
      }));

    } catch (error) {
      console.error('Ошибка при загрузке дополнительных данных:', error);
    } finally {
      setIsLoading(false);
      fetchingRef.current = false;
    }
  }, [isLoading, pageInfo, allItems, pageSize, cursorCache, fetchFunction]);

  const resetData = useCallback(() => {
    setAllItems([]);
    setPagesCache({});
    setCursorCache({ 0: null });
    setPageInfo({ endCursor: null, hasNextPage: false });
    fetchingRef.current = false;
  }, []);

  return {
    isLoading,
    totalCount,
    pageInfo,
    pagesCache,
    cursorCache,
    allItems,
    fetchPage,
    loadMore,
    resetData,
    setAllItems
  };
}