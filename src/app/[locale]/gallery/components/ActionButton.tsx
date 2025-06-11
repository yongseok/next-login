import { Button } from '@/components/ui/button';

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
      variant='secondary'
      size='sm'
      className='w-8 h-8 rounded-full hover:cursor-pointer opacity-80 hover:opacity-100 transition-opacity'
      onClick={onClick || undefined}
      disabled={disabled}
      {...props}
    >
      {children}
    </Button>
  );
}
