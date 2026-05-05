import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export default function DepartmentBarChart({ data = [] }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 h-[340px] transition-all duration-200 hover:shadow-md">
      
      {/* Title */}
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-slate-800">
          Department Activity
        </h3>
        <p className="text-xs text-slate-500">
          Active vs Idle vs Inactive employees
        </p>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data} barGap={6}>
          
          {/* Grid */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e2e8f0"
            vertical={false}
          />

          {/* X Axis */}
          <XAxis
            dataKey="department"
            tick={{ fontSize: 12, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
          />

          {/* Y Axis */}
          <YAxis
            tick={{ fontSize: 12, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
          />

          {/* Tooltip */}
          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.04)" }}
            contentStyle={{
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              fontSize: "12px",
            }}
          />

          {/* Legend */}
          <Legend
            wrapperStyle={{
              fontSize: "12px",
              paddingTop: "8px",
            }}
          />

          {/* Bars */}
          <Bar
            dataKey="ACTIVE"
            fill="#22c55e"
            radius={[6, 6, 0, 0]}
          />
          <Bar
            dataKey="IDLE"
            fill="#f59e0b"
            radius={[6, 6, 0, 0]}
          />
          <Bar
            dataKey="INACTIVE"
            fill="#94a3b8"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}