import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Shield,
  Building2,
  BadgeCheck,
  Clock3,
  CalendarDays,
  UserCircle2,
  MonitorCheckIcon,
  ExternalLink,
  Info,
} from "lucide-react";

import PageHeader from "../../components/ui/PageHeader";
import LoadingCard from "../../components/ui/LoadingCard";
import EmptyState from "../../components/ui/EmptyState";
import StatusBadge from "../../components/ui/StatusBadge";
import { getEmployeeById } from "../../services/employeeService";

export const formatDateTime = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// Enhanced InfoCard with hover states and better typography
function InfoCard({ icon: Icon, label, value, colorClass = "text-slate-700 bg-slate-50" }) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-indigo-100 hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className={`rounded-xl border border-slate-100 p-3 transition-colors group-hover:bg-indigo-50`}>
          <Icon size={20} className="text-slate-600 group-hover:text-indigo-600" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
          <h3 className="mt-0.5 truncate text-sm font-semibold text-slate-900">
            {value || "—"}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default function EmployeeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getEmployeeById(id);
      const payload = res?.data?.data || res?.data || res;
      if (!payload) throw new Error("Employee not found");
      setEmployee(payload);
    } catch (err) {
      setEmployee(null);
      setError(err?.response?.data?.message || err?.message || "Unable to load employee details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  return (
    <div className="mx-auto max-w-7xl pb-10">
      <PageHeader
        title={employee?.name || "Employee Profile"}
        subtitle="Comprehensive view of employee account and activity"
        rightContent={
          <Link
            to="/manager/team"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 active:scale-95"
          >
            <ArrowLeft size={16} />
            Back to List
          </Link>
        }
      />

      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <LoadingCard key={i} />)}
        </div>
      ) : error ? (
        <EmptyState title="Unable to load employee" subtitle={error} />
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[350px_1fr]">
          
          {/* LEFT COLUMN: Profile Hero */}
          <div className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-lg">
              <div className="h-24 bg-gradient-to-r from-slate-800 to-indigo-900" />
              <div className="relative -mt-12 flex flex-col items-center px-6 pb-8">
                <div className="relative">
                  {employee?.profilePhoto?.url ? (
                    <img
                      src={employee.profilePhoto.url}
                      alt={employee.name}
                      className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-xl"
                    />
                  ) : (
                    <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-slate-100 text-slate-400 shadow-xl">
                      <UserCircle2 size={64} />
                    </div>
                  )}
                  <div className="absolute bottom-1 right-1">
                    <StatusBadge status={employee?.isActive ? "ACTIVE" : "INACTIVE"} />
                  </div>
                </div>

                <h2 className="mt-4 text-2xl font-bold text-slate-900">{employee?.name}</h2>
                <p className="font-mono text-xs font-semibold uppercase tracking-widest text-slate-400">
                  {employee?.employeeId}
                </p>

                <div className="mt-6 w-full space-y-3 rounded-2xl bg-slate-50 p-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 font-medium">Work Role</span>
                    <span className="rounded-lg bg-indigo-100 px-2 py-1 text-[11px] font-bold text-indigo-700">
                      {employee?.role}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 font-medium">Department</span>
                    <span className="font-semibold text-slate-800">{employee?.department?.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 font-medium">Last Online</span>
                    <span className="text-right font-semibold text-slate-800">
                      {formatDateTime(employee?.lastLoginAt)}
                    </span>
                  </div>
                </div>

                            </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Details & Metadata */}
          <div className="space-y-8">
            {/* Essential Information Grid */}
            <section>
              <div className="mb-4 flex items-center gap-2 px-1">
                <BadgeCheck size={18} className="text-indigo-600" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Primary Details</h3>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InfoCard icon={BadgeCheck} label="System ID" value={employee?.employeeId} />
                <InfoCard icon={Mail} label="Official Email" value={employee?.email} />
                <InfoCard icon={Shield} label="Access Level" value={employee?.role} />
                <InfoCard 
                  icon={Building2} 
                  label="Office Unit" 
                  value={employee?.department?.name ? `${employee.department.name} (${employee.department.code || 'N/A'})` : "—"} 
                />
                <InfoCard icon={Clock3} label="Recent Activity" value={formatDateTime(employee?.lastLoginAt)} />
                <InfoCard icon={CalendarDays} label="Joining Date" value={formatDateTime(employee?.createdAt)} />
              </div>
            </section>

            {/* Technical Metadata Section */}
            <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info size={18} className="text-indigo-600" />
                  <h3 className="text-lg font-bold text-slate-900">Account Metadata</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-5 transition-colors hover:bg-slate-100/80">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Department Identifier</p>
                  <p className="mt-1 text-sm font-mono font-bold text-slate-700">{employee?.department?.code || "NOT_ASSIGNED"}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5 transition-colors hover:bg-slate-100/80">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Record Last Modified</p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">{formatDateTime(employee?.updatedAt)}</p>
                </div>

                
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}