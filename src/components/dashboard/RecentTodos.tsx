import { connection } from 'next/server';
import { getRecentTodos, type TodoStatus } from '@/data/todo';

const STATUS_LABEL: Record<TodoStatus, string> = {
  pending: 'Pending',
  completed: 'Completed'
};

export default async function RecentTodos() {
  await connection();

  const todos = await getRecentTodos(5);

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="bg-white px-6">
        {todos.length === 0 ? (
          <p className="py-4 text-center text-gray-500">No todos yet</p>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className="flex justify-between items-center py-4"
            >
              <span>{todo.title}</span>
              <span>{STATUS_LABEL[todo.status]}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
