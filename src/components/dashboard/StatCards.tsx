import { connection } from 'next/server';
import { getTodoStats } from '@/data/todo';

export default async function StatCards() {
  await connection();
  console.log('STATCARD');

  const { completed, pending } = await getTodoStats();

  return (
    <>
      <StatCard title="Completed" value={completed} />
      <StatCard title="Pending" value={pending} />
    </>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h2>{title}</h2>
      <p className="text-center bg-white text-3xl rounded-lg mt-4 py-8">
        {value}
      </p>
    </div>
  );
}
