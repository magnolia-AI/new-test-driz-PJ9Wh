'use client';
import React from 'react';


import { useState, useCallback } from 'react';
import { useDrop, useDrag, DropTargetMonitor } from 'react-dnd';
import { TodoItem } from './TodoItem';
import { type Task } from '@/lib/schema';
import { reorderTasks } from '@/app/actions/tasks';

interface TodoListProps {
  initialTasks: Task[];
}

export function TodoList({ initialTasks }: TodoListProps) {
  const [tasks, setTasks] = useState(initialTasks);

  const moveTask = useCallback((dragIndex: number, hoverIndex: number) => {
    setTasks((prevTasks) => {
      const newTasks = [...prevTasks];
      const [draggedItem] = newTasks.splice(dragIndex, 1);
      newTasks.splice(hoverIndex, 0, draggedItem);
      return newTasks;
    });
  }, []);

  const handleDrop = async () => {
    await reorderTasks(tasks);
  };

  return (
    <div className="space-y-2">
      {tasks.map((task, index) => (
        <DraggableTodoItem
          key={task.id}
          index={index}
          task={task}
          moveTask={moveTask}
          onDrop={handleDrop}
        />
      ))}
    </div>
  );
}

interface DraggableTodoItemProps {
  task: Task;
  index: number;
  moveTask: (dragIndex: number, hoverIndex: number) => void;
  onDrop: () => void;
}

function DraggableTodoItem({ task, index, moveTask, onDrop }: DraggableTodoItemProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: 'task',
    hover(item: { index: number }, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveTask(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    drop: onDrop,
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'task',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="transition-opacity"
    >
      <TodoItem task={task} />
    </div>
  );
}

