import { Roboto } from 'next/font/google';
import './globals.css';
import { Metadata } from 'next';

const roboto = Roboto();

export const metadata: Metadata = {
  title: {
    template: '%s | Basic Todo',
    default: 'Basic Todo'
  }
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`antialiased ${roboto.className}`}>
      <body>{children}</body>
    </html>
  );
}
