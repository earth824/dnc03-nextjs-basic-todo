import 'server-only';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/dal';

export type TodoStatus = 'pending' | 'completed';

export type TodoSummary = {
  id: number;
  title: string;
  status: TodoStatus;
};

export type TodoStats = Record<TodoStatus, number>;

// The userId always comes from the session, never from the caller,
// so no one can read another user's todos by passing a different id.

export async function getTodoStats(): Promise<TodoStats> {
  const { userId } = await verifySession();

  const groups = await prisma.todo.groupBy({
    by: ['status'],
    where: { userId },
    _count: { _all: true }
  });

  const stats: TodoStats = { pending: 0, completed: 0 };
  for (const group of groups) {
    stats[group.status] = group._count._all;
  }
  return stats;
}

export async function getRecentTodos(limit = 5): Promise<TodoSummary[]> {
  const { userId } = await verifySession();

  return prisma.todo.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: { id: true, title: true, status: true }
  });
}
