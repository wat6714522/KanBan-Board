// Responsible-person data is provided by the assignment.
// The app does not implement person management — this list is fixed.
export const PEOPLE = [
  { id: 'p1', name: 'Aria Nakamura' },
  { id: 'p2', name: 'Bruno Silva' },
  { id: 'p3', name: 'Chiara Rossi' },
  { id: 'p4', name: 'Devin Clarke' },
  { id: 'p5', name: 'Elena Petrova' },
];

export const personById = (id) => PEOPLE.find((p) => p.id === id) || null;
export const personName = (id) => personById(id)?.name ?? 'Unassigned';
