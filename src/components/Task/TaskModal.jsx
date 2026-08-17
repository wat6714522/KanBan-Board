import { useEffect, useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

import { STATUS } from "../../data/constants";
import { newId } from "../../lib/tasks";

function TaskModal({ show, onHide, task, defaultStatus, onSave, onDelete, categories, onAddCategory }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  
  const [assigneeName, setAssigneeName] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  
  const [status, setStatus] = useState(STATUS.TODO);

  useEffect(() => {
    if (show) {
      if (task) {
        setTitle(task.title || "");
        setDescription(task.description || "");
        setCategory(task.category || categories[0] || "");
        setStartDate(task.startDate || "");
        setDueDate(task.dueDate || "");
        setAssigneeName(task.assigneeName || "");
        setAssigneeId(task.assigneeId || "");
        setStatus(task.status || STATUS.TODO);
      } else {
        setTitle("");
        setDescription("");
        setCategory(categories[0] || "");
        setStartDate("");
        setDueDate("");
        setAssigneeName("");
        setAssigneeId("");
        setStatus(defaultStatus || STATUS.TODO);
      }
      setNewCategory("");
    }
  }, [show, task, defaultStatus, categories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let finalCategory = category;
    if (category === "NEW_CATEGORY") {
      if (newCategory.trim()) {
        onAddCategory(newCategory.trim());
        finalCategory = newCategory.trim();
      } else {
        finalCategory = categories[0]; 
      }
    }

    let finalCompleteDate = task ? task.completeDate : null;
    if (status === STATUS.DONE && !finalCompleteDate) {
      finalCompleteDate = new Date().toISOString();
    } else if (status !== STATUS.DONE) {
      finalCompleteDate = null;
    }

    const taskData = {
      id: task ? task.id : newId(),
      title,
      description,
      category: finalCategory,
      startDate,
      dueDate,
      completeDate: finalCompleteDate,
      assigneeName, 
      assigneeId,   
      status,
    };
    
    onSave(taskData);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">{task ? "Edit Task" : "New Task"}</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Title <span className="text-danger">*</span></Form.Label>
            <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="What needs to be done?" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add more details..." />
          </Form.Group>

          <Row className="mb-3">
            <Form.Group as={Col} md={12}>
              <Form.Label>Category</Form.Label>
              <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="NEW_CATEGORY" className="text-primary fw-bold">+ Add New Category...</option>
              </Form.Select>
              {category === "NEW_CATEGORY" && (
                <Form.Control type="text" className="mt-2" placeholder="Type new category name" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} required />
              )}
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md={4}>
              <Form.Label>Person ID</Form.Label>
              <Form.Control type="text" value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} placeholder="e.g. 001" />
            </Form.Group>
            <Form.Group as={Col} md={8}>
              <Form.Label>Full Name</Form.Label>
              <Form.Control type="text" value={assigneeName} onChange={(e) => setAssigneeName(e.target.value)} placeholder="Responsible person's name" />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md={6}>
              <Form.Label>Start Date</Form.Label>
              <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </Form.Group>
            <Form.Group as={Col} md={6}>
              <Form.Label>Due Date</Form.Label>
              <Form.Control type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </Form.Group>
          </Row>

          <Form.Group className="mb-0">
            <Form.Label>Status</Form.Label>
            <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value={STATUS.TODO}>To Do</option>
              <option value={STATUS.DOING}>Doing</option>
              <option value={STATUS.DONE}>Done</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          {task ? (
            <Button variant="outline-danger" onClick={() => onDelete(task.id)}>Delete Task</Button>
          ) : <div></div>}
          
          <div className="d-flex gap-2">
            <Button variant="secondary" onClick={onHide}>Cancel</Button>
            <Button variant="primary" type="submit" className="btn-brand">Save Task</Button>
          </div>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default TaskModal;