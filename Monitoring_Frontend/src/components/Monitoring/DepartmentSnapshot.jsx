import { Building2 } from "lucide-react";

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
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-800">
          Department Snapshot
        </h3>
        <p className="text-xs text-slate-500">
          Activity distribution across departments
        </p>
      </div>

      {/* List */}
      <div className="space-y-4">
        {data.slice(0, 5).map((dept) => {
          const total = dept.total || 1;
          const active = dept.ACTIVE || 0;
          const rate = Math.round((active / total) * 100);

          return (
            <div
              key={dept.department}
              className="group"
            >
              {/* Top Row */}
              <div className="flex items-center justify-between mb-1.5">
                
                {/* Left */}
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600 shrink-0">
                    <Building2 size={14} />
                  </div>

                  <span className="text-sm font-medium text-slate-800 truncate">
                    {dept.department}
                  </span>
                </div>

                {/* Right */}
                <span className="text-xs font-medium text-slate-500 shrink-0">
                  {active}/{total} • {rate}%
                </span>
              </div>

              {/* Progress */}
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-300 group-hover:brightness-110"
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