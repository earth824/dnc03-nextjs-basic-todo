import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, TodoStatus } from '../src/generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
});

const SALT_ROUNDS = 10;

const USERS: {
  email: string;
  password: string;
  todos: { title: string; status: TodoStatus }[];
}[] = [
  {
    email: 'john@example.com',
    password: 'password123',
    todos: [
      { title: 'Design Database', status: 'completed' },
      { title: 'Mock Data', status: 'completed' },
      { title: 'Explore new project', status: 'completed' },
      { title: 'Build dashboard page', status: 'pending' },
      { title: 'Relax', status: 'pending' }
    ]
  },
  {
    email: 'jane@example.com',
    password: 'password123',
    todos: [
      { title: 'Write API docs', status: 'completed' },
      { title: 'Review pull requests', status: 'pending' },
      { title: 'Plan sprint', status: 'pending' },
      { title: 'Buy groceries', status: 'pending' }
    ]
  }
];

async function main() {
  // Wipe ALL data and reset auto-increment ids back to 1
  await prisma.$executeRaw`TRUNCATE TABLE "todos", "users" RESTART IDENTITY CASCADE`;

  for (const { email, password, todos } of USERS) {
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: { email, password: hashed }
    });

    // create one by one so ids and createdAt follow the list order
    for (const todo of todos) {
      await prisma.todo.create({ data: { ...todo, userId: user.id } });
    }

    console.log(`Seeded ${email} with ${todos.length} todos`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
