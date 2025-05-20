import { Menu } from 'lucide-react';
import { Button } from './ui/button';

export function UserButton() {
  return (
    <Button variant='outline' size='icon'>
      <Menu />
    </Button>
  );
}
