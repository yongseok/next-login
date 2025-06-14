import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ActionButton({
  children,
  onClick,
  disabled,
  props,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  props?: React.ComponentProps<typeof Button>;
}) {
  return (
    <Button
      variant='default'
      size='sm'
      className={cn(
        'w-8 h-8 bg-card text-card-foreground border-border hover:bg-accent hover:text-accent-foreground rounded-full hover:cursor-pointer opacity-80 hover:opacity-100 transition-opacity',
        props?.className
      )}
      onClick={onClick || undefined}
      disabled={disabled}

      {...props}
    >
      {children}
    </Button>
  );
}
