import { useEffect, useMemo, useState } from "react";
import { Search, Pencil, Trash2, Mail, User, MonitorCheck, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import LoadingCard from "../../components/ui/LoadingCard";
import StatusBadge from "../../components/ui/StatusBadge";
import EmployeeModal from "./modals/EmployeeModal";

import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  updateEmployeeStatus,
} from "../../services/employeeService";
import { getDepartments } from "../../services/departmentService";

const safeData = (value) => {
  if (Array.isArray(value)) return value;
  return value?.items || value?.users || value?.data || [];
};

export default function Employees() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError("");
      const [empRes, depRes] = await Promise.all([getEmployees(), getDepartments()]);
      setEmployees(safeData(empRes?.data?.data || empRes?.data));
      setDepartments(safeData(depRes?.data?.data || depRes?.data));
    } catch (err) {
      setError(err?.message || "Unable to load data");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const filteredEmployees = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter((emp) =>
      [emp?.employeeId, emp?.name, emp?.email, emp?.role, emp?.department?.name]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [employees, search]);

  const handleOpenCreate = () => { setEditingEmployee(null); setModalOpen(true); };
  const handleOpenEdit = (emp) => { setEditingEmployee(emp); setModalOpen(true); };
  const handleCloseModal = () => { if (!actionLoading) setModalOpen(false); };

  const handleSubmitEmployee = async (payload) => {
    try {
      setActionLoading(true);
      if (editingEmployee?._id) {
        await updateEmployee(editingEmployee._id, payload);
        toast.success("Employee updated");
      } else {
        await createEmployee(payload);
        toast.success("Employee created");
      }
      setModalOpen(false);
      fetchInitialData();
    } catch {
      toast.error("Operation failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteEmployee = async () => {
    try {
      setActionLoading(true);
      await deleteEmployee(deleteId);
      toast.success("Employee deleted");
      setDeleteId(null);
      fetchInitialData();
    } catch {
      toast.error("Delete failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (emp) => {
    try {
      await updateEmployeeStatus(emp._id, !emp.isActive);
      toast.success("Status updated");
      fetchInitialData();
    } catch {
      toast.error("Status update failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <PageHeader 
          title="Employees" 
          subtitle="Manage your workforce efficiently" 
        />
        
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employees..."
              className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all outline-none"
            />
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 active:scale-95 transition shadow-sm"
          >
            <Plus size={18} />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <LoadingCard /> <LoadingCard /> <LoadingCard />
        </div>
      ) : filteredEmployees.length === 0 ? (
        <EmptyState title="No employees found" subtitle="Try adjusting your search." />
      ) : (
        <>
          {/* MOBILE VIEW CARD */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
            {filteredEmployees.map((emp) => (
              <div key={emp._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  {/* Clickable Area for Profile */}
                  <div 
                    onClick={() => navigate(`/admin/employees/${emp._id}`)} 
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 overflow-hidden border border-slate-100 group-hover:border-indigo-500 transition-all">
                      {emp.profilePhoto?.url ? (
                        <img src={emp.profilePhoto.url} alt={emp.name} className="h-full w-full object-cover" />
                      ) : (
                        <User size={20} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{emp.name}</h3>
                      <p className="text-xs text-slate-400 font-mono">{emp.employeeId}</p>
                    </div>
                  </div>
                  <button onClick={() => handleToggleStatus(emp)}>
                    <StatusBadge status={emp.isActive ? "ACTIVE" : "INACTIVE"} />
                  </button>
                </div>

                <div className="mt-4 space-y-2 border-t border-slate-50 pt-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail size={14} className="text-slate-400" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{emp.role}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{emp.department?.name}</span>
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <button onClick={() => navigate(`/admin/monitoring/${emp._id}`)} className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-indigo-50 py-2.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition">
                    <MonitorCheck size={16} /> Monitor
                  </button>
                  <button onClick={() => handleOpenEdit(emp)} className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => setDeleteId(emp._id)} className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-100 text-red-600 hover:bg-red-50 transition">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP TABLE VIEW */}
          <div className="hidden lg:block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.map((emp, i) => (
                  <tr key={emp._id} className="group hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 overflow-hidden border border-transparent group-hover:border-indigo-200 transition-all">
                          {emp.profilePhoto?.url ? (
                            <img src={emp.profilePhoto.url} alt={emp.name} className="h-full w-full object-cover" />
                          ) : (
                            <User size={16} />
                          )}
                        </div>
                        <div>
                          <button 
                            onClick={() => navigate(`/admin/employees/${emp._id}`)} 
                            className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
                          >
                            {emp.name}
                          </button>
                          <div className="text-[10px] font-mono text-slate-400">{emp.employeeId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-slate-400" />
                        {emp.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 uppercase">
                        {emp.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{emp.department?.name}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleToggleStatus(emp)} className="hover:opacity-80 transition-opacity">
                        <StatusBadge status={emp.isActive ? "ACTIVE" : "INACTIVE"} />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => navigate(`/admin/monitoring/${emp._id}`)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Monitor">
                          <MonitorCheck size={18} />
                        </button>
                        <button onClick={() => handleOpenEdit(emp)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                          <Pencil size={18} />
                        </button>
                        <button onClick={() => setDeleteId(emp._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* MODALS */}
      <EmployeeModal open={modalOpen} onClose={handleCloseModal} onSubmit={handleSubmitEmployee} loading={actionLoading} initialData={editingEmployee} departments={departments} />
      <ConfirmDialog open={!!deleteId} onCancel={() => setDeleteId(null)} onConfirm={handleDeleteEmployee} loading={actionLoading} title="Delete Employee" message="Are you sure? This cannot be undone." />
    </div>
  );
}