import { useCallback, useEffect, useState } from 'react';
import { MMKVStorageAdapter } from '@devraj-labs/rn-storage-kit';
import { TTodo, TTodoSchema } from './todo-screen-types';

const todoStorage = new MMKVStorageAdapter<TTodoSchema>('rn-storage-kit.todos');

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const useTodoScreen = () => {
  const [todos, setTodos] = useState<TTodo[]>([]);
  const [newText, setNewText] = useState('');
  const [editingTodo, setEditingTodo] = useState<TTodo | null>(null);

  useEffect(() => {
    todoStorage.get('todos').then((stored) => {
      if (stored) setTodos(stored);
    });
  }, []);

  const persist = async (next: TTodo[]) => {
    setTodos(next);
    await todoStorage.set('todos', next);
  };

  const handleAdd = () => {
    const trimmed = newText.trim();
    if (!trimmed) return;
    persist([...todos, { id: generateId(), text: trimmed, done: false }]);
    setNewText('');
  };

  const handleToggle = useCallback((id: string) => {
    setTodos((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
      todoStorage.set('todos', next);
      return next;
    });
  }, []);

  const handleDelete = useCallback((id: string) => {
    setTodos((prev) => {
      const next = prev.filter((t) => t.id !== id);
      todoStorage.set('todos', next);
      return next;
    });
  }, []);

  const handleSaveEdit = (id: string, text: string) => {
    setTodos((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, text } : t));
      todoStorage.set('todos', next);
      return next;
    });
    setEditingTodo(null);
  };

  const handleCloseEdit = () => setEditingTodo(null);

  return {
    todos,
    newText,
    editingTodo,
    pending: todos.filter((t) => !t.done),
    done: todos.filter((t) => t.done),
    setNewText,
    setEditingTodo,
    handleAdd,
    handleToggle,
    handleDelete,
    handleSaveEdit,
    handleCloseEdit,
  };
};
