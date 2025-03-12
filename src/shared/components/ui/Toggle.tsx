import * as React from 'react';
import { cn } from '@/shared/lib/utils';

interface ToggleProps extends React.ComponentProps<'div'> {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  labelLeft?: React.ReactNode;
  labelRight?: React.ReactNode;
}

export const Toggle: React.FC<ToggleProps> = ({
                                                enabled,
                                                onChange,
                                                labelLeft,
                                                labelRight,
                                                className,
                                                ...props
                                              }) => {
  return (
    <div className={cn('flex items-center gap-2', className)} {...props}>
      {labelLeft && <span className={cn(!enabled && 'font-medium')}>{labelLeft}</span>}
      <button
        type="button"
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full',
          enabled ? 'bg-primary' : 'bg-gray-200'
        )}
        onClick={() => onChange(!enabled)}
        aria-pressed={enabled}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 transform rounded-full bg-white transition',
            enabled ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>
      {labelRight && <span className={cn(enabled && 'font-medium')}>{labelRight}</span>}
    </div>
  );
};