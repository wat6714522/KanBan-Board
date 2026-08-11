import { STATUS } from "../data/constants";

// Generate a reasonably unique id without extra dependencies.
export const newId = () =>
  `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

// Format an ISO date string (YYYY-MM-DD) as e.g. "15 Jul".
export function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

// A task is overdue when it isn't done and its due date is in the past.
export function isOverdue(task, now = new Date()) {
  if (!task.dueDate || task.status === STATUS.DONE) return false;
  const due = new Date(task.dueDate);
  if (Number.isNaN(due.getTime())) return false;
  // Compare by day, ignoring the time component.
  due.setHours(23, 59, 59, 999);
  return due.getTime() < now.getTime();
}

// Classify a done task's timing relative to its due date.
// Returns 'early' | 'onTime' | 'late' | null.
export function completionTiming(task) {
  if (task.status !== STATUS.DONE || !task.completeDate || !task.dueDate) {
    return null;
  }
  const done = new Date(task.completeDate);
  const due = new Date(task.dueDate);
  if (Number.isNaN(done.getTime()) || Number.isNaN(due.getTime())) return null;

  const dayDone = done.toISOString().slice(0, 10);
  const dayDue = due.toISOString().slice(0, 10);
  if (dayDone < dayDue) return "early";
  if (dayDone > dayDue) return "late";
  return "onTime";
}
