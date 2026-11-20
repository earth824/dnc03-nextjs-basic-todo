import Image from 'next/image';
import Link from 'next/link';
import LogoutButton from './LogoutButton';
import Menu from './Menu';

export default function Header() {
  return (
    <header className="flex justify-between items-center px-10 py-6 shadow">
      {/* Logo */}
      <Link href="/">
        <Image src="/logo.png" alt="brand" width={32} height={32} />
      </Link>
      <div className="flex items-center gap-6">
        {/* Menu */}
        <Menu />
        {/* Logout (rightmost) */}
        <LogoutButton />
      </div>
    </header>
  );
}
