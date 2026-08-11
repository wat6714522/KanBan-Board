import { useEffect, useState } from "react";
import { Modal, Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import { PEOPLE } from "../data/people";
import { COLUMNS, STATUS } from "../data/constants";
import { newId } from "../lib/tasks";

const today = () => new Date().toISOString().slice(0, 10);

function initialForm(task, defaultStatus, categories) {
  return {
    title: task?.title ?? "",
    description: task?.description ?? "",
    category: task?.category ?? categories[0] ?? "",
    startDate: task?.startDate ?? today(),
    dueDate: task?.dueDate ?? "",
    completeDate: task?.completeDate ?? "",
    personId: task?.personId ?? "",
    status: task?.status ?? defaultStatus ?? STATUS.TODO,
  };
}

function TaskModal({
  open,
  task,
  defaultStatus,
  categories,
  onAddCategory,
  onSave,
  OnDelete,
  onClose,
}) {
  const isEdit = Boolean(task);
  const [form, setForm] = useState(() =>
    initialForm(task, defaultStatus, categories),
  );
  const [errors, setErrors] = useState({});
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    if (open) {
      setForm(initialForm(task, defaultStatus, categories));
      setErrors({});
      setAddingCategory(false);
      setNewCategory("");
    }
  }, [open, task]);

  const set = (key) => (e) => {
    const value = e.target.value;
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (key === "status") {
        if (value === STATUS.DONE && !next.completeDate)
          next.completeDate = today();
        if (value !== STATUS.DONE) next.completeDate = "";
      }
      return next;
    });
  };

  function validate(f) {
    const err = {};
    if (!f.title.trim()) err.title = "Give the task a title.";
    if (!f.category) err.category = "Choose a category.";
    if (!f.personId) err.personId = "Assign someone.";
    if (!f.startDate) err.startDate = "Set a start date.";
    if (!f.dueDate) err.dueDate = "Set a due date.";
    if (f.startDate && f.dueDate && f.dueDate < f.startDate) {
      err.dueDate = "Due Date is before the Start Date.";
    }
    return err;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const err = validate(form);
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    onSave({
      id: task?.id ?? newId(),
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      startDate: form.startDate,
      dueDate: form.dueDate,
      completeDate: form.status === STATUS.DONE ? form.completeDate : null,
      personId: form.personId,
      status: form.status,
    });
  }

  function confirmAddCategory() {
    const name = newCategory.trim();
    if (!name) return;
    onAddCategory(name);
    setForm((f) => ({ ...f, category: name }));
    setAddingCategory(false);
    setNewCategory("");
  }

  return (
    <Modal show={open} onHide={onClose} centered>
      <Form onSubmit={handleSubmit} noValidate>
        <Modal.Header closeButton>
          <Modal.Title className="font-display fs-5 fw-bold">
            {isEdit ? "Edit Task" : "New Tas"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-medium">Title *</Form.Label>
            <Form.Control
              autoFoucus
              value={form.tilte}
              onChange={set("title")}
              isInvalid={!!errors.tilte}
              placehodler="e.g. Draft the project propsoal"
            />
            <Form.Control.Feedback type="invalid">
              {errors.title}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-medium">Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={Form.description}
              onChange={set("description")}
              placeholder="what needs to be done?"
            />
          </Form.Group>
          <Row className="g-3 mb-3">
            <Col xs={6}>
              <Form.Label className="small fw-medium">Category *</Form.Label>
              {addingCategory ? (
                <InputGroup>
                  <Form.Control
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        confirmAddCategory();
                      }
                    }}
                    placeholder="New Category"
                    autoFocus
                  />
                  <Button className="btn-brand" onClick={confirmAddCategory}>
                    Add
                  </Button>
                </InputGroup>
              ) : (
                <InputGroup>
                  <Form.Select
                    value={form.category}
                    onChange={set("category")}
                    isInvalid={!!errors.category}
                  >
                    {categories.length === 0 && <option value="">-</option>}
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Form.Select>
                  <Button
                    variant="outline-secondary"
                    onClick={() => setAddingCategory(true)}
                  >
                    New
                  </Button>
                </InputGroup>
              )}
              {errors.category && (
                <div className="text-danger" style={{ fontSize: 12 }}>
                  {errors.category}
                </div>
              )}
            </Col>
            <Col xs={6}>
              <Form.Label className="small fw-medium">
                Responsible Person *
              </Form.Label>
              <Form.Select
                value={form.personId}
                onChange={set("personId")}
                isInvalid={!!errors.personId}
              >
                <option value="">Select...</option>
                {PEOPLE.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.personId}
              </Form.Control.Feedback>
            </Col>
          </Row>
          <Row className="g-3 mb-3">
            <Col xs={6}>
              <Form.Label className="small fw-medium">Start Date *</Form.Label>
              <Form.Control
                type="date"
                value={form.startDate}
                onChange={set("startDate")}
                isInvalid={!!errors.startDate}
              />
              <Form.Control.Feedback type="invalid">
                {errors.startDate}
              </Form.Control.Feedback>
            </Col>
            <Col xs={6}>
              <Form.Label className="samll fw-mediium">Due Date *</Form.Label>
              <Form.Control.Feedback type="invalid">
                {errors.dueDate}
              </Form.Control.Feedback>
            </Col>
          </Row>
          <Row className="g-3">
            <Col xs={6}>
              <Form.Label className="small fw-medium">Status *</Form.Label>
              <Form.Select value={form.status} onChange={set("status")}>
                {COLUMNS.map((c) => (
                  <option key={c.id} value={c.id}>
                    c.label
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col xs={6}>
              <Form.Label className="small fw-medium">
                Complete Date {form.status === STATUS.Done ? "*" : ""}
              </Form.Label>
              <Form.Control
                type="date"
                value={form.completeDate}
                onChange={set("completeDate")}
                disabled={form.status !== STATUS.DONE}
                isInvalid={!!errors.completeDate}
              />
              <Form.Control.Feedback type="invalid">
                {errors.completeDate}
              </Form.Control.Feedback>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          {isEdit ? (
            <Button variant="outline-danger" onClick={() => OnDelete(task.id)}>
              Delete
            </Button>
          ) : (
            <span />
          )}
          <div className="d-flex gap-2">
            <Button variant="outline-secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="btn-brand">
              {isEdit ? "Save Change" : "Create Task"}
            </Button>
          </div>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default TaskModal;
