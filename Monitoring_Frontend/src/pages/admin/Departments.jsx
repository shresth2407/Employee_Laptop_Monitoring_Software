import { useEffect, useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";
import LoadingCard from "../../components/ui/LoadingCard";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import DepartmentModal from "./modals/DepartmentModal";
import toast from "react-hot-toast";
import { Building2, FileText, Pencil, Trash2 } from "lucide-react";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../services/departmentService";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [deleteId, setDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await getDepartments();
      setDepartments(res.data?.data || []);
    } catch (err) {
      toast.error("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleCreate = async (payload) => {
    try {
      setActionLoading(true);

      if (editing) {
        await updateDepartment(editing._id, payload);
        toast.success("Department updated");
      } else {
        await createDepartment(payload);
        toast.success("Department created");
      }

      setModalOpen(false);
      setEditing(null);
      fetchDepartments();
    } catch {
      toast.error("Operation failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setActionLoading(true);
      await deleteDepartment(deleteId);
      toast.success("Department deleted");
      setDeleteId(null);
      fetchDepartments();
    } catch {
      toast.error("Delete failed");
    } finally {
      setActionLoading(false);
    }
  };

return (
  <div className="space-y-6">

    {/* HEADER */}
    <PageHeader
      title="Departments"
      subtitle="Manage organization departments"
      rightContent={
        <button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="
            rounded-xl px-4 py-2 text-sm font-semibold text-white
            bg-gradient-to-r from-indigo-600 to-indigo-500
            shadow-md hover:shadow-lg
            hover:-translate-y-[1px]
            transition-all duration-200
          "
        >
          + Add Department
        </button>
      }
    />

    {/* CONTENT */}
    {loading ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
      </div>
    ) : departments.length === 0 ? (
      <EmptyState title="No departments found" />
    ) : (
      <div
        className="
          relative
          rounded-2xl
          bg-white/70 backdrop-blur-xl
          shadow-[0_10px_40px_rgba(0,0,0,0.06)]
          overflow-hidden
        "
      >
        {/* subtle top glow */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            {/* HEADER */}
            <thead>
              <tr className="text-xs uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4 text-left font-medium">Name</th>
                <th className="px-6 py-4 text-left font-medium">Description</th>
                <th className="px-6 py-4 text-left font-medium">Actions</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="divide-y divide-slate-100">
              {departments.map((dep) => (
                <tr
                  key={dep._id}
                  className="
                    group
                    transition-all duration-200
                    hover:bg-white
                    hover:shadow-[0_8px_25px_rgba(0,0,0,0.04)]
                  "
                >
                  {/* NAME */}
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800 group-hover:text-indigo-600 transition">
                      {dep.name}
                    </p>
                  </td>

                  {/* DESCRIPTION */}
                  <td className="px-6 py-4 text-slate-500">
                    {dep.description}
                  </td>

                   {/* ACTIONS */}
            <td className="px-6 py-4">
              <div className="flex gap-2">

                <button
                  onClick={() => {
                    setEditing(dep);
                    setModalOpen(true);
                  }}
                  className="
                    flex items-center gap-1.5
                    px-3 py-1.5 text-xs font-medium rounded-lg
                    bg-indigo-50 text-indigo-600
                    hover:bg-indigo-100
                    transition
                  "
                >
                  <Pencil size={12} />
                  Edit
                </button>

                <button
                  onClick={() => setDeleteId(dep._id)}
                  className="
                    flex items-center gap-1.5
                    px-3 py-1.5 text-xs font-medium rounded-lg
                    bg-red-50 text-red-600
                    hover:bg-red-100
                    transition
                  "
                >
                  <Trash2 size={12} />
                  Delete
                </button>

              </div>
            </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    )}

    {/* MODALS */}
    <DepartmentModal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      onSubmit={handleCreate}
      loading={actionLoading}
      initialData={editing}
    />

    <ConfirmDialog
      open={!!deleteId}
      onCancel={() => setDeleteId(null)}
      onConfirm={handleDelete}
      loading={actionLoading}
      title="Delete Department"
      message="Are you sure you want to delete this department?"
    />
  </div>
);
}