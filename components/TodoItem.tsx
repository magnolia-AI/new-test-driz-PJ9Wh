"use client";

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Trash, Edit, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Task } from '@/app/page';

interface TodoItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

const TodoItem = ({ task, onToggle, onDelete, onEdit }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleEdit = () => {
    if (isEditing) {
      onEdit(task.id, editText);
    }
    setIsEditing(!isEditing);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(task.text);
    }
  };

  return (
    <motion.div
      layout
      className={`flex items-center p-4 rounded-lg transition-colors ${
        task.completed
          ? 'bg-muted/50 text-muted-foreground'
          : 'bg-card hover:bg-muted/50'
      }`}
    >
      <Button
        variant="ghost"
        size="icon"
        className={`mr-4 rounded-full h-8 w-8 ${
          task.completed ? 'bg-primary text-primary-foreground' : 'border'
        }`}
        onClick={() => onToggle(task.id)}
      >
        {task.completed && <Check size={16} />}
      </Button>
      {isEditing ? (
        <Input
          ref={inputRef}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleEdit}
          className="flex-grow bg-transparent"
        />
      ) : (
        <span
          className={`flex-grow cursor-pointer ${
            task.completed ? 'line-through' : ''
          }`}
          onClick={() => onToggle(task.id)}
        >
          {task.text}
        </span>
      )}
      <div className="ml-4 flex gap-1">
        <Button variant="ghost" size="icon" onClick={handleEdit}>
          {isEditing ? <Save size={16} /> : <Edit size={16} />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive"
          onClick={() => onDelete(task.id)}
        >
          <Trash size={16} />
        </Button>
      </div>
    </motion.div>
  );
};

export default TodoItem;

