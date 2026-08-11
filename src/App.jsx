import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/Navbar.jsx";
import TaskPage from "./pages/TaskPage.jsx";
import DashBoard from "./pages/Dashboard.jsx";

function App() {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <NavBar />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Navigate to="board" replace />} />
          <Route path="/board" element={<TaskPage />} />
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="*" element={<Navigate to="/board" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
