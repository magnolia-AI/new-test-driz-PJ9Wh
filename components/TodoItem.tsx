'use client';

import { useState, useTransition } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Edit, Save } from 'lucide-react';
import { type Task } from '@/lib/schema';
import { toggleTask, editTask, deleteTask } from '@/app/actions/tasks';

interface TodoItemProps {
  task: Task;
}

export function TodoItem({ task }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      await editTask(task.id, editText);
      setIsEditing(false);
    });
  };

  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-card">
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => startTransition(() => toggleTask(task.id))}
        disabled={isPending}
      />
      {isEditing ? (
        <Input
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="flex-grow"
          disabled={isPending}
        />
      ) : (
        <span className={`flex-grow ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
          {task.text}
        </span>
      )}
      {isEditing ? (
        <Button onClick={handleSave} size="icon" variant="ghost" disabled={isPending}>
          <Save className="h-4 w-4" />
        </Button>
      ) : (
        <Button onClick={() => setIsEditing(true)} size="icon" variant="ghost" disabled={isPending}>
          <Edit className="h-4 w-4" />
        </Button>
      )}
      <Button
        onClick={() => startTransition(() => deleteTask(task.id))}
        size="icon"
        variant="ghost"
        className="text-destructive"
        disabled={isPending}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

