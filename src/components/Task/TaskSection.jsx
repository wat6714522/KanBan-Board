import { Badge, Button } from "react-bootstrap";
import TaskCard from "./TaskCard";
import "../../pages/TaskPage.css";

function TaskSection({ column, tasks, onAdd, onEdit, onStatusChange }) {
  const s = column.accent;

  return (
    <div className={`kanban-col ${s}`}>
      <div className="d-flex align-items-center justify-content-between px-1 mb-3">
        <div className="d-flex align-items-center gap-3">
          <span className={`status-dot ${s}`} />
          <h2
            className="font-display fw-bold text-uppercase m-0"
            style={{ fontSize: 13, letterSpacing: "0.04em" }}
          >
            {column.label}
          </h2>
          <Badge bg="light" text="dark" className={`status-text ${s}`} pill>
            {tasks.length}
          </Badge>
        </div>
        <Button
          variant="light"
          size="sm"
          className="d-grid p-1"
          style={{ width: 28, height: 28, placeItems: "center" }}
          onClick={() => onAdd?.(column.id)}
          aria-label={`Add task to ${column.label}`}
          title={`Add task to ${column.label}`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M8 3v10M3 8h10"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </Button>
      </div>
      <div className="d-flex flex-column gap-2">
        {tasks.length === 0 ? (
          <p
            className="text-center text-secondary border border-dashed rounded-3 px-3 py-4 m-0"
            style={{ fontSize: 12 }}
          >
            No tasks here yet.
          </p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </div>
    </div>
  );
}
export default TaskSection;
