import { TTodo } from '../todo-screen-types';

export type TTodoItemProps = {
  todo: TTodo;
  onToggle: (id: string) => void;
  onEdit: (todo: TTodo) => void;
  onDelete: (id: string) => void;
};
