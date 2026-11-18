import { Metadata } from 'next';
import { Suspense } from 'react';
import RecentTodos from '@/components/dashboard/RecentTodos';
import StatCards from '@/components/dashboard/StatCards';
import {
  RecentTodosSkeleton,
  StatCardsSkeleton
} from '@/components/dashboard/Skeletons';

export const metadata: Metadata = {
  title: 'Dashboard'
};

export default function DashboardPage() {
  console.log('DASHBOARD');
  return (
    <div className="p-4 py-8 md:w-[46rem] mx-auto">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Suspense fallback={<StatCardsSkeleton />}>
            <StatCards />
          </Suspense>
        </div>
        <Suspense fallback={<RecentTodosSkeleton />}>
          <RecentTodos />
        </Suspense>
      </div>
    </div>
  );
}
