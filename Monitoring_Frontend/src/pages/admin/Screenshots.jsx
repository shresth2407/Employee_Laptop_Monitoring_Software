import { useEffect, useMemo, useState } from "react";
import { 
  Search, 
  RefreshCw, 
  Maximize2, 
  Clock, 
  User, 
  Monitor, 
  Layout, 
  X
} from "lucide-react";

import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";
import { getScreenshots } from "../../services/screenshotService";
import { formatDateTime } from "./EmployeeDetails";

export default function Screenshots() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState(""); 
  const [dateFilter, setDateFilter] = useState("today");
  const [selectedImage, setSelectedImage] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  /* ================= FETCH ================= */
  const fetchScreenshots = async (manual = false) => {
    try {
      manual ? setRefreshing(true) : setLoading(true);
      setError("");
      const res = await getScreenshots();
      if (!res?.success) throw new Error(res?.message || "Failed to fetch screenshots");
      setItems(Array.isArray(res?.data) ? res.data : res?.data?.items || []);
    } catch (err) {
      setError(err?.customMessage || err?.message || "Failed to fetch screenshots");
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchScreenshots();
  }, []);

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    
    return items.filter((item) => {
      const empName = item?.employeeId?.name || "";
      const empCode = item?.employeeId?.employeeId || "";
      const deptName = item?.employeeId?.department?.name || "";

      // Search match
      const searchMatch =
        !q ||
        [empName, empCode, item?.applicationName, item?.windowTitle]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q));

      // Department match (Nested payload handling)
      const deptMatch = !departmentFilter || deptName === departmentFilter;

      // Date match
      let dateMatch = true;
      if (dateFilter) {
        const captured = new Date(item?.capturedAt);
        const now = new Date();
        if (dateFilter === "today") dateMatch = captured.toDateString() === now.toDateString();
        else if (dateFilter === "week") {
          const weekAgo = new Date();
          weekAgo.setDate(now.getDate() - 7);
          dateMatch = captured >= weekAgo;
        } else if (dateFilter === "month") {
          dateMatch = captured.getMonth() === now.getMonth() && captured.getFullYear() === now.getFullYear();
        }
      }

      return searchMatch && deptMatch && dateMatch;
    });
  }, [items, search, departmentFilter, dateFilter]);

  const hasActiveFilters = search || departmentFilter || dateFilter !== "today";

  const clearFilters = () => {
    setSearch("");
    setDepartmentFilter("");
    setDateFilter("today");
  };

  return (
    <div className="space-y-4 pb-10">
      {/* ================= HEADER ================= */}
      <PageHeader
        title="Screenshots"
        subtitle="Review captured agent activity"
        rightContent={
          <button
            onClick={() => fetchScreenshots(true)}
            disabled={refreshing || loading}
            className="group inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 disabled:opacity-60"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : "transition-transform group-hover:rotate-180"} />
            {refreshing ? "Syncing..." : "Sync"}
          </button>
        }
      />

      {/* ================= COMPACT TOOLBAR ================= */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm">
        
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Search employee, app..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-400/20"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none transition-all focus:border-indigo-400 cursor-pointer"
          >
            <option value="">All Departments</option>
            <option value="IT">IT</option>
            <option value="HR">HR</option>
            <option value="Engineering">Engineering</option>
            <option value="Sales">Sales</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none transition-all focus:border-indigo-400 cursor-pointer"
          >
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>

          {hasActiveFilters && (
            <button 
              onClick={clearFilters}
              className="h-9 rounded-lg px-3 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ================= ERROR STATE ================= */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 font-medium flex items-center gap-2">
          <X size={16} className="text-red-500 rounded-full bg-red-100 p-0.5" />
          {error}
        </div>
      )}

      {/* ================= GRID OR LOADING ================= */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden animate-pulse">
              <div className="h-40 w-full bg-slate-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
                <div className="h-3 w-1/3 bg-slate-100 rounded"></div>
                <div className="h-8 w-full bg-slate-50 rounded mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No screenshots found" subtitle="Try adjusting your filters or search criteria." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
          {filtered.map((item) => {
            const imageUrl = item?.filePath || "";
            const empName = item?.employeeId?.name || "Unknown";
            const empCode = item?.employeeId?.employeeId || "—";
            const deptName = item?.employeeId?.department?.name || "";

            return (
              <div
                key={item?._id}
                className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                {/* IMAGE */}
                <button
                  type="button"
                  onClick={() => imageUrl && setSelectedImage(imageUrl)}
                  className="relative block aspect-video w-full bg-slate-100 overflow-hidden cursor-pointer outline-none"
                >
                  {imageUrl ? (
                    <>
                      <img
                        src={imageUrl}
                        alt="Screenshot"
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-slate-900/0 transition-colors duration-300 group-hover:bg-slate-900/30 flex items-center justify-center">
                        <div className="transform scale-75 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 rounded-full bg-white/20 p-2 backdrop-blur-sm">
                          <Maximize2 className="text-white" size={24} />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center text-slate-400 gap-2">
                      <Monitor size={24} className="opacity-50" />
                      <span className="text-xs font-medium">No preview</span>
                    </div>
                  )}
                </button>

                {/* DETAILS */}
                <div className="flex flex-col p-3.5 flex-1">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0">
                      <p className="flex items-center gap-1.5 text-sm font-bold text-slate-900 truncate">
                        <User size={14} className="text-slate-400 shrink-0" />
                        <span className="truncate">{empName}</span>
                        {deptName && (
                          <span className="text-[10px] font-medium text-slate-400 ml-1">({deptName})</span>
                        )}
                      </p>
                      <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mt-1">
                        <Clock size={12} className="shrink-0" />
                        {formatDateTime(item?.capturedAt)}
                      </p>
                    </div>
                    
                    {item?.applicationName && (
                      <span className="shrink-0 inline-flex items-center rounded bg-indigo-50 px-2 py-1 text-[10px] font-bold tracking-wider text-indigo-700 uppercase border border-indigo-100 max-w-[80px] truncate" title={item.applicationName}>
                        {item.applicationName}
                      </span>
                    )}
                  </div>

                  {/* Window Title Context */}
                  <div className="mt-auto flex items-start gap-2 rounded-lg border border-slate-100 bg-slate-50 p-2">
                    <Layout size={14} className="text-slate-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed" title={item?.windowTitle || "No window title"}>
                      {item?.windowTitle || <span className="italic text-slate-400">No active window title recorded</span>}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= MODAL PREVIEW ================= */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm transition-opacity">
          <div className="relative max-w-[95vw] max-h-[95vh]">
            <button 
              onClick={() => setSelectedImage("")}
              className="absolute -top-4 -right-4 lg:-right-12 lg:top-0 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors backdrop-blur-md"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
            <img
              src={selectedImage}
              alt="Screenshot preview"
              className="max-h-[90vh] rounded-xl object-contain shadow-2xl ring-1 ring-white/10"
            />
          </div>
        </div>
      )}
    </div>
  );
}