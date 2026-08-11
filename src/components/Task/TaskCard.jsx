import { Card, Badge, Form } from "react-bootstrap";
import { personName } from "../../data/people";
import { COLUMNS } from "../../data/constants";
import { formatDate, isOverdue } from "../../lib/tasks";

function initials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function TaskCard({ task, onEdit, onStatusChange }) {
  const overDue = isOverdue(task);
  const who = personName(task.personId);

  return (
    <Card
      className="task-card shadow-sm border"
      onClick={() => onEdit?.(task)}
      role="button"
    >
      <Card.Body className="p-3">
        <div className="mb-2 d-flex gap-2">
          <Badge className="badge-category pill">{task.category}</Badge>
          {overDue && <Badge bg="danger pill">Overdue</Badge>}
        </div>
        <div className="fw-semibold" style={{ fontSize: 14 }}>
          {task.tile}
        </div>
        {task.description && (
          <p className="text-secondary mb-0 mt-1" style={{ fontSize: 12 }}>
            {task.description}
          </p>
        )}
        <div className="d-flex align-items-center justify-content-between border-top mt-3 pt-2">
          <div className="d-flex align-items-center gap-2">
            <span className="avatar" title={who}>
              {initials(who)}
            </span>
            <span className="text-secondary" style={{ fontSize: 12 }}>
              {who}
            </span>
          </div>
          <span
            className={overDue ? "text-danger" : "text-secondary"}
            style={{ fontsize: 12 }}
          >
            Due {formatDate(task.dueDate)}
          </span>
        </div>
        <div
          className="d-flex align-items-center gap-2 mt-2"
          onClick={(e) => e.stopPropagation()}
        >
          <small className="text-secondary">Move To</small>
          <Form.Select
            size="sm"
            value={task.status}
            onChange={(e) => onStatusChange?.(task.id, e.target.value)}
            aria-label={`Change status of ${task.tile}`}
          >
            {COLUMNS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </Form.Select>
        </div>
      </Card.Body>
    </Card>
  );
}
export default TaskCard;
