import 'server-only';
import { prisma } from '@/lib/prisma';

export type TodoStatus = 'pending' | 'completed';

export type TodoSummary = {
  id: number;
  title: string;
  status: TodoStatus;
};

export type TodoStats = Record<TodoStatus, number>;

export async function getTodoStats(): Promise<TodoStats> {
  const groups = await prisma.todo.groupBy({
    by: ['status'],
    _count: { _all: true }
  });

  const stats: TodoStats = { pending: 0, completed: 0 };
  for (const group of groups) {
    stats[group.status] = group._count._all;
  }
  return stats;
}

export async function getRecentTodos(limit = 5): Promise<TodoSummary[]> {
  return prisma.todo.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: { id: true, title: true, status: true }
  });
}
