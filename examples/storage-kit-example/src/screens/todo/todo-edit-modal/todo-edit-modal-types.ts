import { TTodo } from '../todo-screen-types';

export type TTodoEditModalProps = {
  todo: TTodo | null;
  onSave: (id: string, text: string) => void;
  onClose: () => void;
};
