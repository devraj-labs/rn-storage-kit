export type TTodo = {
  id: string;
  text: string;
  done: boolean;
};

export type TTodoSchema = {
  todos: TTodo[];
};
