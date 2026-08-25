// Responsible-person data is provided by the assignment.
// The app does not implement person management — this list is fixed.
export const PEOPLE = [
  { id: '671234', name: 'Aria Nakamura' },
  { id: '641344', name: 'Bruno Silva' },
  { id: '511467', name: 'Chiara Rossi' },
  { id: '691234', name: 'Devin Clarke' },
  { id: '657891', name: 'Elena Petrova' },
];

export const personById = (id) => PEOPLE.find((p) => p.id === id) || null;
export const personName = (id) => personById(id)?.name ?? 'Unassigned';
