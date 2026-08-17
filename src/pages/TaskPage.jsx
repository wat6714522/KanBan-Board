import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import "./TaskPage.css";

import { useState, useEffect, useMemo } from "react";
import { COLUMNS, DEFAULT_CATEGORIES, STATUS } from "../data/constants";
import { SEED_TASKS } from "../data/seed";
import {
  loadTask,
  saveTasks,
  loadCategories,
  saveCategories,
} from "../lib/storage";

// โหลด Component ที่อยู่ในโฟลเดอร์เดียวกัน 
import TaskSection from "./TaskSection";
import TaskModal from "./TaskModal";

function ToDoList() {
  const [tasks, setTasks] = useState(() => loadTask(SEED_TASKS));
  const [categories, setCategories] = useState(() =>
    loadCategories(DEFAULT_CATEGORIES),
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [createStatus, setCreateStatus] = useState(STATUS.TODO);

  // บันทึกข้อมูลลง Local Storage อัตโนมัติเมื่อ tasks หรือ categories เปลี่ยนแปลง
  useEffect(() => saveTasks(tasks), [tasks]);
  useEffect(() => saveCategories(categories), [categories]);

  // จัดกลุ่มงานตามสถานะ (TODO, DOING, DONE)
  const byStatus = useMemo(() => {
    const groups = { todo: [], doing: [], done: [] };
    for (const task of tasks) {
      (groups[task.status] ?? groups.todo).push(task);
    }
    return groups;
  }, [tasks]);

  function openCreate(status = STATUS.TODO) {
    setEditingTask(null);
    setCreateStatus(status);
    setModalOpen(true);
  }

  function openEdit(task) {
    setEditingTask(task);
    setModalOpen(true);
  }

  function handleSave(saved) {
    setTasks((prev) => {
      const exists = prev.some((t) => t.id === saved.id);
      return exists
        ? prev.map((t) => (t.id === saved.id ? saved : t)) 
        : [saved, ...prev];
    });
  }

  function handleDelete(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setModalOpen(false);
    setEditingTask(null);
  }

  function handleStatusChange(id, status) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const completeDate =
          status === STATUS.DONE ? t.completeDate || new Date().toISOString() : null; 
        return { ...t, status, completeDate };
      }),
    );
  }

  function handleAddCategory(name) {
    setCategories((prev) => (prev.includes(name) ? prev : [...prev, name]));
  }

  return (
    <Container className="py-4" style={{ maxWidth: 1140 }}>
      <div className="d-flex flex-wrap align-items-end justify-content-between gap-2 mb-4">
        <div>
          <h1 className="font-display fw-bold m-0">Task List</h1>
          <p className="text-secondary m-0" style={{ fontSize: 14 }}>
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"} across three
            columns.
          </p>
        </div>
        <Button
          className="btn-brand d-flex align-items-center gap-2"
          onClick={() => openCreate(STATUS.TODO)}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M8 3V10M3 8h10"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          New Task
        </Button>
      </div>
      <Row className="g-4">
        {COLUMNS.map((column) => (
          <Col key={column.id} xs={12} md={4}> 
            <TaskSection
              column={column}
              tasks={byStatus[column.id]}
              onAdd={openCreate}
              onEdit={openEdit}
              onStatusChange={handleStatusChange}
            />
          </Col>
        ))}
      </Row>

      <TaskModal
        show={modalOpen}
        onHide={() => setModalOpen(false)}
        task={editingTask}
        defaultStatus={createStatus}
        onSave={handleSave}
        onDelete={handleDelete}
        categories={categories}
        onAddCategory={handleAddCategory}
      />
    </Container>
  );
}

export default ToDoList;