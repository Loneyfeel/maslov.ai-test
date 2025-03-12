import { cn } from '@/shared/lib/utils';
import { usePagination } from '@/shared/hooks/usePagination';

interface PaginationProps {
  onPageChange: (page: number) => void;
  totalCount: number;
  siblingCount?: number;
  currentPage: number;
  pageSize: number;
  className?: string;
}

export const Pagination = ({
                             onPageChange,
                             totalCount,
                             siblingCount = 1,
                             currentPage,
                             pageSize,
                             className,
                           }: PaginationProps) => {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  const lastPage = paginationRange[paginationRange.length - 1];

  return (
    <ul
      className={cn('flex gap-1 items-center justify-center mt-4', className)}
    >
      <li>
        <button
          className={cn(
            'px-3 py-1 rounded-md',
            'border border-input',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'hover:bg-accent hover:text-accent-foreground'
          )}
          onClick={onPrevious}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          &lt;
        </button>
      </li>
      {paginationRange.map((pageNumber, i) => {
        if (pageNumber === 'DOTS') {
          return (
            <li key={`dots-${i}`} className="px-2">
              &#8230;
            </li>
          );
        }

        return (
          <li key={`page-${pageNumber}`}>
            <button
              className={cn(
                'px-3 py-1 rounded-md',
                'border border-input',
                'hover:bg-accent hover:text-accent-foreground',
                pageNumber === currentPage && 'bg-primary text-primary-foreground border-primary'
              )}
              onClick={() => onPageChange(pageNumber as number)}
              aria-label={`Page ${pageNumber}`}
              aria-current={pageNumber === currentPage ? 'page' : undefined}
            >
              {pageNumber}
            </button>
          </li>
        );
      })}
      <li>
        <button
          className={cn(
            'px-3 py-1 rounded-md',
            'border border-input',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'hover:bg-accent hover:text-accent-foreground'
          )}
          onClick={onNext}
          disabled={currentPage === lastPage}
          aria-label="Next page"
        >
          &gt;
        </button>
      </li>
    </ul>
  );
};