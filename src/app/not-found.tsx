import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex items-center justify-center flex-col min-h-screen gap-4">
      <h1 className="text-7xl text-blue-500 font-extrabold">404</h1>
      <h2 className="text-3xl font-medium">Page not found</h2>
      <p className="text-gray-500">
        Sorry, we couldn&apos;t find the page you&apos;re looking for.
      </p>
      <Link href="/">Go Home</Link>
    </main>
  );
}
