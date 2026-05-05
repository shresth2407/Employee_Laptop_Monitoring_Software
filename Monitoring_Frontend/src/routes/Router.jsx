import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import ProtectedRoute from "./ProtectedRoute";

/* ================= EMPLOYEE ================= */
import Dashboard from "../pages/employee/Dashboard";
import WorkSession from "../pages/employee/WorkSession";
import Statistics from "../pages/employee/Statistics";
import Profile from "../pages/employee/Profile";
import ChangePassword from "../pages/employee/ChangePassword";

/* ================= MANAGER ================= */
import ManagerLayout from "../components/layout/ManagerLayout";
import ManagerDashboard from "../pages/Manager/Dashboard";
import TeamMembers from "../pages/Manager/TeamMembers";
import ManagerReports from "../pages/Manager/Reports";
import ManagerEmployeeDetails from "../pages/Manager/EmployeeDetails";

/* ================= ADMIN ================= */
import AdminLayout from "../components/layout/AdminLayout";
import AdminDashboard from "../pages/admin/Dashboard";
import Employees from "../pages/admin/Employees";
import EmployeeDetails from "../pages/admin/EmployeeDetails";
import Monitoring from "../pages/admin/Monitoring";
import Screenshots from "../pages/admin/Screenshots";
import Reports from "../pages/admin/Reports";
import Departments from "../pages/admin/Departments";
import TeamMappings from "../pages/admin/TeamMappings";
import Settings from "../pages/admin/Settings";
import EmployeeDeepView from "../pages/admin/EmployeeDeepView";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===== PUBLIC ===== */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" />} />

        {/* ===== EMPLOYEE ===== */}
        <Route
          element={<ProtectedRoute allowedRoles={["EMPLOYEE", "MANAGER"]} />}
        >
          <Route path="/employee" element={<ManagerLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="session" element={<WorkSession />} />
            <Route path="stats" element={<Statistics />} />
            <Route path="profile" element={<Profile />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>
        </Route>
        {/* ===== MANAGER ===== */}
        <Route element={<ProtectedRoute allowedRoles={["MANAGER"]} />}>
          <Route path="/manager" element={<ManagerLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ManagerDashboard />} />
            <Route path="team" element={<TeamMembers />} />
            <Route path="reports" element={<ManagerReports />} />
            <Route path="employee/:id" element={<ManagerEmployeeDetails />} />
          </Route>
        </Route>

        {/* ===== ADMIN ===== */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="employees" element={<Employees />} />
            <Route path="employees/:id" element={<EmployeeDetails />} />
            <Route path="monitoring/:id" element={<EmployeeDeepView />} />{" "}
            <Route path="monitoring" element={<Monitoring />} />
            <Route path="screenshots" element={<Screenshots />} />
            <Route path="reports" element={<Reports />} />
            <Route path="departments" element={<Departments />} />
            <Route path="team-mappings" element={<TeamMappings />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* ===== FALLBACK ===== */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
