import Link from 'next/link';

type MenuItemProps = {
  href: string;
  label: string;
  active?: boolean;
};

export default function MenuItem({
  href,
  label,
  active = false
}: MenuItemProps) {
  return (
    <Link href={href} className={active ? 'text-blue-500' : ''}>
      {label}
    </Link>
  );
}
