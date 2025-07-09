"use client";

import { useDrop, useDrag } from 'react-dnd';
import { motion } from 'framer-motion';
import TodoItem from './TodoItem';
import { Task } from '@/app/page';
import { useRef } from 'react';

interface TodoListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
}

const DraggableTodoItem = ({ task, index, onToggle, onDelete, onEdit, onReorder }: { task: Task, index: number } & Omit<TodoListProps, 'tasks' | 'onReorder'> & { onReorder: (dragIndex: number, hoverIndex: number) => void; }) => {
  const ref = useRef<HTMLLIElement>(null);
  const [{ handlerId }, drop] = useDrop({
    accept: 'todo',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: { index: number }, monitor) {
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
      onReorder(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'todo',
    item: () => ({ id: task.id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <motion.li
      ref={ref}
      data-handler-id={handlerId}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{
        opacity: isDragging ? 0.5 : 1,
        boxShadow: isDragging ? '0 4px 8px rgba(0,0,0,0.2)' : 'none',
      }}
      className="mb-2"
    >
      <TodoItem
        task={task}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    </motion.li>
  );
};


const TodoList = ({
  tasks,
  onToggle,
  onDelete,
  onEdit,
  onReorder,
}: TodoListProps) => {
  return (
    <ul>
      {tasks.map((task, index) => (
        <DraggableTodoItem
          key={task.id}
          index={index}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          onReorder={onReorder}
        />
      ))}
    </ul>
  );
};

export default TodoList;

