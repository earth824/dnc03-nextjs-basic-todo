import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home'
};

export default function Home() {
  console.log('HOME');
  return <div>Home Page</div>;
}
