import { Card, Badge, Dropdown } from "react-bootstrap";
import { formatDate, isOverdue } from "../../lib/tasks";
import { STATUS } from "../../data/constants";
import { PEOPLE } from "../../data/people";

// ถอยกลับไปหน้า pages เพื่อดึงสไตล์มาใช้
import "../../pages/TaskPage.css";

function TaskCard({ task, onEdit, onStatusChange }) {
  const overdue = isOverdue(task);
  const person = PEOPLE.find((p) => p.id === task.personId) ?? "Unassigned";

  return (
    <Card className="task-card border-0 shadow-sm" onClick={onEdit}>
      <Card.Body className="p-3">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Badge className="badge-category">{task.category}</Badge>
          
          <div onClick={(e) => e.stopPropagation()}>
            <Dropdown align="end">
              <Dropdown.Toggle variant="light" size="sm" className="border-0 p-1 bg-transparent">
                ⚙️
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => onStatusChange(task.id, STATUS.TODO)}>Move to To Do</Dropdown.Item>
                <Dropdown.Item onClick={() => onStatusChange(task.id, STATUS.DOING)}>Move to Doing</Dropdown.Item>
                <Dropdown.Item onClick={() => onStatusChange(task.id, STATUS.DONE)}>Move to Done</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        <h6 className="fw-bold mb-1">{task.title}</h6>
        {task.description && (
          <p className="text-secondary mb-2" style={{ fontSize: "12px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {task.description}
          </p>
        )}

        <div className="d-flex justify-content-between align-items-end mt-3">
          <div style={{ fontSize: "12px" }}>
            {task.dueDate && (
              <span className={overdue ? "text-danger fw-bold" : "text-secondary"}>
                📅 {formatDate(task.dueDate)} {overdue && "(Late)"}
              </span>
            )}
          </div>
    
          <div className="text-end">
            {person && (
            <>
              <div style={{ fontSize: "11px" }} className="text-secondary">
                ID: {person.id}
              </div>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "var(--brand)" }}>
                {person.name}
              </div>
            </>
          )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default TaskCard;