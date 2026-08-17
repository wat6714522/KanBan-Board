import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { useState, useMemo } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";

import { loadTask } from "../lib/storage";
import { SEED_TASKS } from "../data/seed";
import { STATUS } from "../data/constants";
import { isOverdue, completionTiming } from "../lib/tasks";

function DashBoard() {
  // ดึงข้อมูลจาก Local Storage ด้วยฟังก์ชันเดียวกับหน้า Board
  const [tasks] = useState(() => loadTask(SEED_TASKS));

  // คำนวณตัวเลขและข้อมูลสำหรับกราฟทั้งหมด (ประมวลผลใหม่เฉพาะเมื่อ tasks เปลี่ยน)
  const metrics = useMemo(() => {
    let todo = 0;
    let doing = 0;
    let done = 0;
    let overdue = 0;
    let early = 0;
    let onTime = 0;
    let late = 0;
    const categories = {};

    tasks.forEach((task) => {
      // 1. นับจำนวนตามสถานะ (Status)
      if (task.status === STATUS.TODO) todo++;
      else if (task.status === STATUS.DOING) doing++;
      else if (task.status === STATUS.DONE) done++;

      // 2. นับงานที่เกินกำหนด (Overdue) โดยใช้ฟังก์ชันของเพื่อน
      if (isOverdue(task)) overdue++;

      // 3. นับจำนวนหมวดหมู่ (Category)
      const cat = task.category || "Uncategorized";
      categories[cat] = (categories[cat] || 0) + 1;

      // 4. นับประสิทธิภาพการทำงาน (Completion Timing) สำหรับงานที่เสร็จแล้ว
      const timing = completionTiming(task);
      if (timing === "early") early++;
      else if (timing === "onTime") onTime++;
      else if (timing === "late") late++;
    });

    // --- จัดเตรียมข้อมูลให้กราฟ Recharts ---
    
    // ข้อมูล Doughnut Chart (Status)
    const statusData = [
      { name: "To Do", value: todo, color: "#6b7793" }, // สีตรงกับ var(--todo)
      { name: "Doing", value: doing, color: "#e0902a" }, // สีตรงกับ var(--doing)
      { name: "Done", value: done, color: "#0fa37f" },  // สีตรงกับ var(--done)
    ];

    // ข้อมูล Bar Chart (Category)
    const categoryData = Object.keys(categories).map((key) => ({
      name: key,
      count: categories[key],
    }));

    // ข้อมูล Bar Chart (Performance)
    const performanceData = [
      { name: "Early", count: early, color: "#0fa37f" }, // เขียว
      { name: "On Time", count: onTime, color: "#4f46e5" }, // สีหลัก (Brand)
      { name: "Late", count: late, color: "#dc3545" }, // แดง (Bootstrap danger)
    ];

    return {
      total: tasks.length,
      todo,
      doing,
      done,
      overdue,
      statusData,
      categoryData,
      performanceData
    };
  }, [tasks]);

  return (
    <Container className="py-4" style={{ maxWidth: 1140 }}>
      <div className="mb-4">
        <h1 className="font-display fw-bold m-0">Dashboard</h1>
        <p className="text-secondary m-0" style={{ fontSize: 14 }}>
          Summary of all task information from the Kanban board.
        </p>
      </div>

      {/* 1. Summary Cards */}
      <Row className="g-3 mb-4">
        <Col xs={6} md>
          <Card className="text-center h-100 shadow-sm border-0">
            <Card.Body>
              <Card.Title className="text-secondary" style={{ fontSize: 14 }}>Total Tasks</Card.Title>
              <h2 className="fw-bold m-0">{metrics.total}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md>
          <Card className="text-center h-100 shadow-sm border-0">
            <Card.Body>
              <Card.Title className="text-secondary" style={{ fontSize: 14 }}>To Do</Card.Title>
              <h2 className="fw-bold m-0" style={{ color: "var(--todo)" }}>{metrics.todo}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md>
          <Card className="text-center h-100 shadow-sm border-0">
            <Card.Body>
              <Card.Title className="text-secondary" style={{ fontSize: 14 }}>Doing</Card.Title>
              <h2 className="fw-bold m-0" style={{ color: "var(--doing)" }}>{metrics.doing}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md>
          <Card className="text-center h-100 shadow-sm border-0">
            <Card.Body>
              <Card.Title className="text-secondary" style={{ fontSize: 14 }}>Done</Card.Title>
              <h2 className="fw-bold m-0" style={{ color: "var(--done)" }}>{metrics.done}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md>
          <Card className="text-center h-100 shadow-sm border-0" style={{ background: "rgba(220, 53, 69, 0.1)" }}>
            <Card.Body>
              <Card.Title className="text-danger" style={{ fontSize: 14 }}>Overdue</Card.Title>
              <h2 className="fw-bold m-0 text-danger">{metrics.overdue}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        {/* 2. Task Status Chart (Doughnut Chart) */}
        <Col lg={4} md={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <Card.Title className="mb-4" style={{ fontSize: 16 }}>Task Status</Card.Title>
              <div style={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={metrics.statusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                    >
                      {metrics.statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* 3. Task Category Chart (Bar Chart) */}
        <Col lg={4} md={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <Card.Title className="mb-4" style={{ fontSize: 16 }}>Tasks by Category</Card.Title>
              <div style={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics.categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: "rgba(79, 70, 229, 0.1)" }} />
                    <Bar dataKey="count" fill="var(--brand)" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* 4. Completion Performance Chart (Bar Chart) */}
        <Col lg={4} md={12}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <Card.Title className="mb-4" style={{ fontSize: 16 }}>Completion Performance</Card.Title>
              <div style={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics.performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: "rgba(0,0,0,0.05)" }} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
                      {metrics.performanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default DashBoard;