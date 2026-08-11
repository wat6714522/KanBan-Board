// The three board columns / task statuses.
export const STATUS = {
  TODO: 'todo',
  DOING: 'doing',
  DONE: 'done',
};

// Ordered list used to render columns left → right.
export const COLUMNS = [
  { id: STATUS.TODO, label: 'To Do', accent: 'todo' },
  { id: STATUS.DOING, label: 'Doing', accent: 'doing' },
  { id: STATUS.DONE, label: 'Done', accent: 'done' },
];

// Categories the app ships with. Users can add more at runtime.
export const DEFAULT_CATEGORIES = [
  'Design',
  'Development',
  'Research',
  'Marketing',
];
