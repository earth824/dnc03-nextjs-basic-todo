'use client';

import { usePathname } from 'next/navigation';
import MenuItem from './MenuItem';

const MENU_LIST = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/todo', label: 'Todo' }
];

export default function Menu() {
  const pathname = usePathname();

  return (
    <nav className="space-x-4">
      {MENU_LIST.map((el) => (
        <MenuItem
          key={el.label}
          href={el.href}
          label={el.label}
          active={pathname === el.href}
        />
      ))}
    </nav>
  );
}
