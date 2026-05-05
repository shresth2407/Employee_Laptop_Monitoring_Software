import { Building2 } from "lucide-react";

function getProgressColor(rate) {
  if (rate >= 70) return "from-green-500 to-emerald-500";
  if (rate >= 40) return "from-amber-500 to-yellow-500";
  return "from-slate-400 to-slate-500";
}

export default function DepartmentSnapshot({ data = [] }) {
  if (!data.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-4 text-sm text-slate-500">
        No department data available
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 transition-all duration-200 hover:shadow-md">
      
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">
            Department Snapshot
          </h3>
          <p className="text-xs text-slate-500">
            Live activity distribution
          </p>
        </div>
      </div>

      {/* Departments */}
      <div className="space-y-5">
        {data.slice(0, 5).map((dept) => {
          const total = dept.total || 1;
          const active = dept.ACTIVE || 0;
          const rate = Math.round((active / total) * 100);
          const gradient = getProgressColor(rate);

          return (
            <div
              key={dept.department}
              className="group"
            >
              {/* Row */}
              <div className="flex items-center justify-between mb-2">
                
                {/* Left */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-slate-100 text-slate-600 shrink-0">
                    <Building2 size={14} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {dept.department}
                    </p>
                    <p className="text-xs text-slate-400">
                      Department
                    </p>
                  </div>
                </div>

                {/* Right */}
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-slate-800">
                    {rate}%
                  </p>
                  <p className="text-xs text-slate-400">
                    {active}/{total}
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`
                    h-full rounded-full bg-gradient-to-r ${gradient}
                    transition-all duration-500 ease-out
                    group-hover:brightness-110
                  `}
                  style={{ width: `${rate}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}