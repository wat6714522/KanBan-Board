import { Badge, Button } from "react-bootstrap";
import TaskCard from "./TaskCard";

function TaskSection({ column, tasks = [], onAdd, onEdit, onStatusChange }) {
  return (
    <div className={`kanban-col ${column.accent} d-flex flex-column gap-2`}>
      <div className="d-flex justify-content-between align-items-center mb-2 px-1">
        <h6 className="text-uppercase fw-bold m-0 d-flex align-items-center gap-2">
          <span className={`status-dot ${column.accent}`}></span>
          {column.label}
          <Badge bg="secondary" className="ms-1">{tasks.length}</Badge>
        </h6>
        <Button variant="link" className="text-decoration-none p-0 text-secondary" onClick={() => onAdd(column.id)}>
          + Add
        </Button>
      </div>
      
      <div className="d-flex flex-column gap-2 flex-grow-1">
        {tasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onEdit={() => onEdit(task)} 
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    </div>
  );
}

export default TaskSection;