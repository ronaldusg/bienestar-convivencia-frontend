import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

export const SectionHeader = ({
  title,
  subtitle,
  actions,
  className,
}: SectionHeaderProps) => {
  return (
    <div className={cn('flex items-start justify-between mb-6', className)}>
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
};
