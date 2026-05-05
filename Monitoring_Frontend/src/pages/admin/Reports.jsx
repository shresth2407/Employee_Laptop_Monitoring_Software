import { useEffect, useState } from "react";
import { RefreshCw, AlertCircle } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";
import StatusBadge from "../../components/ui/StatusBadge";
import { getReports } from "../../services/reportService";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchReports = async (manual = false) => {
    try {
      setError("");
      manual ? setRefreshing(true) : setLoading(true);

      const res = await getReports();

      if (!res?.success) {
        throw new Error(res?.message || "Failed to fetch reports");
      }

      setReports(Array.isArray(res?.data) ? res.data : res?.data?.items || []);
    } catch (err) {
      setError(err?.customMessage || err?.message || "Failed to fetch reports");
      setReports([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="pb-10 space-y-4">
      <PageHeader
        title="Reports"
        subtitle="Review employee session summaries and productivity insights"
        rightContent={
          <button
            onClick={() => fetchReports(true)}
            disabled={refreshing || loading}
            className="group inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 disabled:opacity-60"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : "transition-transform group-hover:rotate-180"} />
            {refreshing ? "Syncing..." : "Sync"}
          </button>
        }
      />

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 font-medium">
          <AlertCircle size={18} className="text-red-500" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center text-sm font-medium text-slate-500 shadow-sm animate-pulse">
          Loading reports data...
        </div>
      ) : reports.length === 0 ? (
        <EmptyState
          title="No reports found"
          subtitle="Session reports will appear here once employees start and end work sessions."
        />
      ) : (
        /* RESPONSIVE TABLE WRAPPER */
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Employee</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Date</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Total Work</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Active Time</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Idle Time</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Productivity</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {reports.map((item, index) => (
                  <tr
                    key={item?._id || index}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">
                        {item?.employeeName || "—"}
                      </div>
                      <div className="text-xs font-medium text-slate-500 mt-0.5">
                        {item?.employeeCode || "—"}
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap font-medium">
                      {item?.date || "—"}
                    </td>

                    <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
                      {item?.totalWorkHours || "0.00h"}
                    </td>

                    <td className="px-5 py-3.5 text-emerald-600 font-medium whitespace-nowrap">
                      {item?.activeHours || "0.00h"}
                    </td>

                    <td className="px-5 py-3.5 text-amber-600 font-medium whitespace-nowrap">
                      {item?.idleHours || "0.00h"}
                    </td>

                    <td className="px-5 py-3.5 font-bold text-indigo-600 whitespace-nowrap">
                      {item?.productivityScore || "0%"}
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <StatusBadge status={item?.status || "—"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}