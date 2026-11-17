import Header from '@/components/layout/Header';

export default function CommonLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}
