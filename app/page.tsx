import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TodoList } from '@/components/TodoList';
import { getTasks, addTask } from '@/app/actions/tasks';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default async function Home() {
  const tasks = await getTasks();

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto p-4">
          <header className="flex justify-between items-center py-4">
            <h1 className="text-4xl font-bold">Todo App</h1>
          </header>
          <main>
            <form
              action={async (formData: FormData) => {
                'use server';
                const text = formData.get('task') as string;
                if (text) {
                  await addTask(text);
                }
              }}
              className="flex gap-2 mb-4"
            >
              <Input name="task" placeholder="Add a new task" />
              <Button type="submit">Add Task</Button>
            </form>
            <TodoList initialTasks={tasks} />
          </main>
        </div>
      </div>
    </DndProvider>
  );
}

