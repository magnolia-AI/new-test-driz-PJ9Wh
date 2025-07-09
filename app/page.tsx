"use client";

import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Plus, X } from 'lucide-react';
import TodoList from '@/components/TodoList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import useLocalStorage from '@/hooks/useLocalStorage';

export type Task = {
  id: string;
  text: string;
  completed: boolean;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
};

export default function Home() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [newTaskText, setNewTaskText] = useState('');
  const [filter, setFilter] = useState('all');
  const [isMounted, setIsMounted] = useState(false);
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme, isMounted]);

  const addTask = () => {
    if (newTaskText.trim()) {
      setTasks([
        ...tasks,
        { id: Date.now().toString(), text: newTaskText, completed: false },
      ]);
      setNewTaskText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const editTask = (id: string, newText: string) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, text: newText } : task))
    );
  };

  const reorderTasks = (startIndex: number, endIndex: number) => {
    const result = Array.from(tasks);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setTasks(result);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const completedCount = tasks.filter((task) => task.completed).length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (!isMounted) {
    return null; // or a loading spinner
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
        <main className="container mx-auto max-w-2xl p-4">
          <header className="flex items-center justify-between py-8">
            <h1 className="text-5xl font-bold tracking-tighter">
              Magnolia Todos
            </h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={theme}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === 'light' ? <Moon /> : <Sun />}
                </motion.div>
              </AnimatePresence>
            </Button>
          </header>

          <div className="relative mb-6">
            <Input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a new task..."
              className="pr-12 text-lg"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2"
              onClick={addTask}
            >
              <Plus />
            </Button>
          </div>

          <div className="mb-6 flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'secondary' : 'ghost'}
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button
                variant={filter === 'active' ? 'secondary' : 'ghost'}
                onClick={() => setFilter('active')}
              >
                Active
              </Button>
              <Button
                variant={filter === 'completed' ? 'secondary' : 'ghost'}
                onClick={() => setFilter('completed')}
              >
                Completed
              </Button>
            </div>
            <Badge variant="outline" className="text-sm">
              {completedCount} / {totalCount} completed
            </Badge>
          </div>

          <div className="mb-4 h-1 w-full rounded-full bg-muted">
            <motion.div
              className="h-1 rounded-full bg-primary"
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <AnimatePresence>
            {filteredTasks.length > 0 ? (
              <TodoList
                tasks={filteredTasks}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onEdit={editTask}
                onReorder={reorderTasks}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="py-16 text-center text-muted-foreground"
              >
                <p>
                  {filter === 'completed'
                    ? 'No completed tasks yet.'
                    : 'You are all caught up!'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
        <footer className="py-8 text-center text-muted-foreground">
          <p>Drag and drop to reorder tasks.</p>
        </footer>
      </div>
    </DndProvider>
  );
}



