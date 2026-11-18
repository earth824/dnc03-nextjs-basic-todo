import { cookies } from 'next/headers';

export default async function LoginPage() {
  await cookies();

  return <div>LoginPage</div>;
}
