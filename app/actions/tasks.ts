'use server';

import db from '@/lib/db';
import { tasks, type Task } from '@/lib/schema';
import { revalidatePath } from 'next/cache';
import { asc, eq } from 'drizzle-orm';

export async function getTasks(): Promise<Task[]> {
  return await db.select().from(tasks).orderBy(asc(tasks.position));
}

export async function addTask(text: string): Promise<void> {
  const allTasks = await getTasks();
  const newPosition = allTasks.length > 0 ? Math.max(...allTasks.map(t => t.position)) + 1 : 0;

  await db.insert(tasks).values({
    text,
    position: newPosition,
  });
  revalidatePath('/');
}

export async function toggleTask(id: number): Promise<void> {
  const task = await db.select().from(tasks).where(eq(tasks.id, id));
  if (task.length > 0) {
    await db.update(tasks).set({ completed: !task[0].completed }).where(eq(tasks.id, id));
    revalidatePath('/');
  }
}

export async function editTask(id: number, text: string): Promise<void> {
  await db.update(tasks).set({ text }).where(eq(tasks.id, id));
  revalidatePath('/');
}

export async function deleteTask(id: number): Promise<void> {
  await db.delete(tasks).where(eq(tasks.id, id));
  revalidatePath('/');
}

export async function reorderTasks(reorderedTasks: Task[]): Promise<void> {
    for (let i = 0; i < reorderedTasks.length; i++) {
        await db.update(tasks).set({ position: i }).where(eq(tasks.id, reorderedTasks[i].id));
    }
  revalidatePath('/');
}

