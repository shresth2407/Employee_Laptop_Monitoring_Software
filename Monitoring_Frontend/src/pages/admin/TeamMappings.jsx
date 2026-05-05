import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";
import LoadingCard from "../../components/ui/LoadingCard";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { getEmployees } from "../../services/employeeService";
import {
  assignEmployee,
  getMappingsByTeamLead,
  deleteMapping,
} from "../../services/teamMappingService";
import TeamMappingGraph from "./TeamMappingGraph";

const safeUsers = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.users)) return payload.users;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const safeMappings = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.mappings)) return payload.mappings;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const Info = ({ label, value }) => (
  <div>
    <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{label}</p>
    <p className="font-semibold text-slate-900 mt-0.5">{value || "—"}</p>
  </div>
);

export default function TeamMappings() {
  const [usersLoading, setUsersLoading] = useState(true);
  const [mappingsLoading, setMappingsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [teamLeads, setTeamLeads] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [mappings, setMappings] = useState([]);

  const [selectedTeamLeadId, setSelectedTeamLeadId] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);

      const res = await getEmployees({ page: 1, limit: 200 });
      const payload = res?.data?.data || res?.data || res;
      const users = safeUsers(payload);

      setTeamLeads(users.filter((u) => u?.role === "MANAGER"));
      setEmployees(users.filter((u) => u?.role === "EMPLOYEE"));
    } catch (err) {
      console.error("Failed to fetch users:", err);
      toast.error(
        err?.response?.data?.message || "Failed to load users for mapping"
      );
      setTeamLeads([]);
      setEmployees([]);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchMappings = async (teamLeadId) => {
    if (!teamLeadId) {
      setMappings([]);
      return;
    }

    try {
      setMappingsLoading(true);

      const res = await getMappingsByTeamLead(teamLeadId);
      const payload = res?.data?.data || res?.data || res;
      setMappings(safeMappings(payload));
    } catch (err) {
      console.error("Failed to fetch mappings:", err);
      toast.error(
        err?.response?.data?.message || "Failed to load assigned employees"
      );
      setMappings([]);
    } finally {
      setMappingsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchMappings(selectedTeamLeadId);
  }, [selectedTeamLeadId]);

  const selectedTeamLead = useMemo(
    () => teamLeads.find((tl) => tl?._id === selectedTeamLeadId) || null,
    [teamLeads, selectedTeamLeadId]
  );

  const assignedEmployeeIds = useMemo(
    () => new Set(mappings.map((m) => m?.employee?._id).filter(Boolean)),
    [mappings]
  );

  const availableEmployees = useMemo(() => {
    return employees.filter(
      (emp) =>
        emp?._id !== selectedTeamLeadId &&
        !assignedEmployeeIds.has(emp?._id)
    );
  }, [employees, assignedEmployeeIds, selectedTeamLeadId]);

  const handleAssign = async () => {
    if (!selectedTeamLeadId) {
      toast.error("Select a team lead first");
      return;
    }

    if (!selectedEmployeeId) {
      toast.error("Select an employee to assign");
      return;
    }

    if (selectedTeamLeadId === selectedEmployeeId) {
      toast.error("Team lead and employee cannot be the same user");
      return;
    }

    try {
      setActionLoading(true);

      const payload = {
        teamLeadId: selectedTeamLeadId,
        employeeId: selectedEmployeeId,
      };

      const res = await assignEmployee(payload);

      if (!res?.data?.success && !res?.success) {
        throw new Error(res?.data?.message || res?.message || "Assign failed");
      }

      toast.success("Employee assigned successfully");
      setSelectedEmployeeId("");
      await fetchMappings(selectedTeamLeadId);
    } catch (err) {
      console.error("Assign failed:", err);
      toast.error(
        err?.response?.data?.message || err?.message || "Assign failed"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemove = async () => {
    try {
      setActionLoading(true);

      const res = await deleteMapping(deleteId);

      if (!res?.data?.success && !res?.success) {
        throw new Error(res?.data?.message || res?.message || "Remove failed");
      }

      toast.success("Mapping removed");
      setDeleteId(null);
      await fetchMappings(selectedTeamLeadId);
    } catch (err) {
      console.error("Remove failed:", err);
      toast.error(
        err?.response?.data?.message || err?.message || "Remove failed"
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        title="Team Hierarchy"
        subtitle="Manage team leads and assign employees"
      />

      {usersLoading ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
        </div>
      ) : teamLeads.length === 0 ? (
        <EmptyState
          title="No managers found"
          subtitle="Create users with the 'MANAGER' role to map teams."
        />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6 items-start">
          
          {/* ================= LEFT SIDEBAR ================= */}
          <div className="space-y-5">
            
            {/* 1. SELECT TEAM LEAD */}
            <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-5">
              <label className="text-sm font-semibold text-slate-800">
                Team Lead (Manager)
              </label>
              <select
                value={selectedTeamLeadId}
                onChange={(e) => {
                  setSelectedTeamLeadId(e.target.value);
                  setSelectedEmployeeId("");
                }}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer bg-slate-50"
              >
                <option value="">Choose a team lead...</option>
                {teamLeads.map((tl) => (
                  <option key={tl._id} value={tl._id}>
                    {tl.name} ({tl.employeeId})
                  </option>
                ))}
              </select>
            </div>

            {/* SHOW BELOW CARDS ONLY IF A LEAD IS SELECTED */}
            {selectedTeamLeadId && (
              <>
                {/* 2. TEAM LEAD DETAILS */}
                <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-5 animate-[fadeIn_0.3s_ease]">
                  <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">
                    Manager Info
                  </h3>
                  <div className="space-y-4">
                    <Info label="Name" value={selectedTeamLead?.name} />
                    <Info label="Employee ID" value={selectedTeamLead?.employeeId} />
                    <Info label="Department" value={selectedTeamLead?.department?.name} />
                  </div>
                </div>

                {/* 3. ASSIGN EMPLOYEE */}
                <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-5 animate-[fadeIn_0.4s_ease]">
                  <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">
                    Add Team Member
                  </h3>
                  <div className="space-y-3">
                    <select
                      value={selectedEmployeeId}
                      onChange={(e) => setSelectedEmployeeId(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all bg-slate-50 cursor-pointer"
                    >
                      <option value="">Select employee...</option>
                      {availableEmployees.map((emp) => (
                        <option key={emp._id} value={emp._id}>
                          {emp.name} ({emp.employeeId})
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={handleAssign}
                      disabled={actionLoading || !selectedEmployeeId}
                      className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 shadow-sm"
                    >
                      {actionLoading ? "Assigning..." : "Assign to Team"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ================= RIGHT SIDE (GRAPH PANEL) ================= */}
          <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
            {!selectedTeamLeadId ? (
              <div className="m-auto w-full max-w-sm">
                <EmptyState
                  title="No Team Lead Selected"
                  subtitle="Select a manager from the left panel to view and manage their team hierarchy."
                />
              </div>
            ) : (
              <>
                <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-sm font-bold text-slate-800">
                    Hierarchy Graph
                  </h3>
                  <span className="text-xs font-semibold px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md">
                    {mappings.length} Members
                  </span>
                </div>

                <div className="flex-1 relative bg-[#fafafa]">
                  {mappingsLoading ? (
                    <div className="p-5 grid gap-4 md:grid-cols-2">
                      <LoadingCard />
                      <LoadingCard />
                    </div>
                  ) : mappings.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <EmptyState
                        title="Empty Team"
                        subtitle="Assign employees from the left panel to start building the graph."
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0 overflow-auto p-4 animate-[fadeIn_0.5s_ease]">
                      <TeamMappingGraph
                        teamLead={selectedTeamLead}
                        mappings={mappings}
                        onRemove={(id) => setDeleteId(id)}
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleRemove}
        loading={actionLoading}
        title="Remove Member"
        message="Are you sure you want to remove this employee from the manager's team?"
      />

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}