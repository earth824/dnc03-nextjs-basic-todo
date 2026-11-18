import Image from 'next/image';
import Link from 'next/link';
import Menu from './Menu';

export default function Header() {
  return (
    <header className="flex justify-between items-center px-10 py-6 shadow">
      {/* Logo */}
      <Link href="/">
        <Image src="/logo.png" alt="brand" width={32} height={32} />
      </Link>
      {/* Menu */}
      <Menu />
    </header>
  );
}
