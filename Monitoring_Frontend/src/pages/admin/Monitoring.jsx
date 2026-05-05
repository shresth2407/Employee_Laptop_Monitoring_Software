import { useEffect, useMemo, useState } from "react";
import { Search, RefreshCw } from "lucide-react";

import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";
import SectionCard from "../../components/ui/SectionCard";

import KpiCards from "../../components/Monitoring/KpiCards";
import ActivityTable from "../../components/Monitoring/Activitytable";
import StatusPieChart from "../../components/Monitoring/StatusPieChart"
import DepartmentBarChart from "../../components/Monitoring/DepartmentBarChart";
import DepartmentSnapshot from "../../components/Monitoring/DepartmentSnapshot";
import ProductivityInsights from "../../components/Monitoring/ProductivityInsights";
import { getAdminSummary } from "../../services/dashboardService";
import { getMonitoringData } from "../../services/monitoringService";
import { getEmployees } from "../../services/employeeService";
import { formatDateTime } from "./EmployeeDetails";

const PAGE_SIZE = 12;
/* ✅ SAFE ARRAY HELPER */
const safeArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.users)) return data.users;
  return [];
};

export default function MonitoringDashboard() {
  const [summary, setSummary] = useState({});
  const [rows, setRows] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("ALL");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /* ================= FETCH ================= */
  const fetchData = async (manual = false) => {
    try {
      manual ? setRefreshing(true) : setLoading(true);

      const [s, m, e] = await Promise.all([
        getAdminSummary(),
        getMonitoringData(),
        getEmployees({ page: 1, limit: 500 }),
      ]);

      // ✅ SUMMARY
      setSummary(s?.data || {});

      // ✅ MONITORING DATA
      const monitoringPayload =
        m?.data?.data || m?.data || [];
      setRows(Array.isArray(monitoringPayload) ? monitoringPayload : []);

      // ✅ EMPLOYEES (FIXED 🔥)
      const employeePayload = safeArray(e?.data);
      setEmployees(employeePayload);

      // DEBUG (optional)
      // console.log("EMPLOYEES:", employeePayload);

    } catch (err) {
      console.error("Dashboard Error:", err);
      setSummary({});
      setRows([]);
      setEmployees([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), 30000);
    return () => clearInterval(interval);
  }, []);

  /* ================= EMP MAP ================= */
  const empMap = useMemo(() => {
    const map = new Map();

    if (Array.isArray(employees)) {
      employees.forEach((emp) => {
        if (emp?.employeeId) {
          map.set(emp.employeeId, emp);
        }
      });
    }

    return map;
  }, [employees]);

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return rows.filter((r) => {
      const emp = empMap.get(r.employeeCode);

      const roleMatch =
        role === "ALL" || emp?.role === role;

      const searchMatch =
        !q ||
        [
          r.employeeName,
          r.employeeCode,
          r.applicationName,
          r.windowTitle,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);

      return roleMatch && searchMatch;
    });
  }, [rows, search, role, empMap]);

  /* ================= SORT + PAGINATION ================= */
  const sorted = useMemo(() => {
    return [...filtered].sort(
      (a, b) =>
        new Date(b.lastHeartbeatAt || 0) -
        new Date(a.lastHeartbeatAt || 0)
    );
  }, [filtered]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [sorted, page]);

  /* ================= KPIs ================= */
  const kpis = useMemo(() => {
    return {
      totalEmployees: filtered.length,
      activeEmployees: filtered.filter((x) => x.status === "ACTIVE").length,
      idleEmployees: filtered.filter((x) => x.status === "IDLE").length,
      offlineEmployees: filtered.filter((x) => x.status === "OFFLINE").length,
    };
  }, [filtered]);

  const activeRate = kpis.totalEmployees
    ? Math.round((kpis.activeEmployees / kpis.totalEmployees) * 100)
    : 0;

  /* ================= DEPARTMENT ================= */
  const deptData = useMemo(() => {
    const map = {};

    filtered.forEach((r) => {
      const emp = empMap.get(r.employeeCode);
      const dept = emp?.department?.name || "Unassigned";

      if (!map[dept]) {
        map[dept] = {
          department: dept,
          ACTIVE: 0,
          IDLE: 0,
          OFFLINE: 0,
          total: 0,
        };
      }

      map[dept][r.status] = (map[dept][r.status] || 0) + 1;
      map[dept].total++;
    });

    return Object.values(map);
  }, [filtered, empMap]);

/* ================= SKELETON LOADING UI ================= */
if (loading) {
  return (
    <div className="min-h-screen bg-[#fcfdfe] p-4 md:p-8 space-y-8 animate-pulse">
      
      {/* HEADER SKELETON */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="h-10 w-64 bg-slate-200 rounded-2xl"></div>
          <div className="h-4 w-48 bg-slate-200 rounded-lg"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-12 w-64 bg-slate-200 rounded-2xl"></div>
          <div className="h-12 w-12 bg-slate-200 rounded-2xl"></div>
        </div>
      </div>

      {/* KPI CARDS SKELETON */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-white rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-200/50"></div>
        ))}
      </div>

      {/* MAIN TABLE SKELETON */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 space-y-6">
        <div className="h-6 w-40 bg-slate-200 rounded-lg"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-12 w-full bg-slate-50 rounded-xl"></div>
          ))}
        </div>
      </div>

      {/* CHARTS SKELETON */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="h-[400px] bg-white rounded-[2rem] border border-slate-100 shadow-sm"></div>
        <div className="h-[400px] bg-white rounded-[2rem] border border-slate-100 shadow-sm"></div>
      </div>

      {/* FOOTER SKELETON */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="h-64 bg-white rounded-[2rem] border border-slate-100 shadow-sm"></div>
        <div className="h-64 bg-slate-200 rounded-[2rem] border border-slate-100 shadow-sm opacity-50"></div>
      </div>

    </div>
  );
}
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <PageHeader
        title="Monitoring Dashboard"
        subtitle="Live productivity tracking"
        rightContent={
          <div className="flex gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employee..."
              className="border px-3 py-2 rounded-lg"
            />

            <button
              onClick={() => fetchData(true)}
              className="border px-3 py-2 rounded-lg"
            >
              <RefreshCw className={refreshing ? "animate-spin" : ""} />
            </button>
          </div>
        }
      />

      {/* KPI */}
      <KpiCards kpis={kpis} activeRate={activeRate} />

      {/* ACTIVITY */}
      <SectionCard title="Recent Activity">
        {paginated.length === 0 ? (
          <EmptyState title="No activity found" />
        ) : (
          <ActivityTable
            data={paginated}
            employeeMetaMap={empMap}
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            formatDateTime={(d) =>
              d
                ? new Date(d).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                })
                : "—"
            }
          />
        )}
      </SectionCard>

      {/* CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SectionCard title="Status Distribution">
          <StatusPieChart
            data={[
              { name: "Active", value: kpis.activeEmployees, fill: "#16a34a" },
              { name: "Idle", value: kpis.idleEmployees, fill: "#d97706" },
              { name: "Offline", value: kpis.offlineEmployees, fill: "#dc2626" },
            ]}
          />
        </SectionCard>

        <SectionCard title="Department Productivity">
          <DepartmentBarChart data={deptData} />
        </SectionCard>
      </div>

      {/* SNAPSHOT + INSIGHTS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SectionCard title="Department Snapshot">
          <DepartmentSnapshot data={deptData} />
        </SectionCard>

        <SectionCard title="Insights">
          <ProductivityInsights
            activeRate={activeRate}
            idleEmployees={kpis.idleEmployees}
          />
        </SectionCard>
      </div>

    </div>
  );
}