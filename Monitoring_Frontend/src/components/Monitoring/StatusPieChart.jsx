import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

export default function StatusPieChart({ data = [] }) {
  const total = data.reduce((acc, d) => acc + (d.value || 0), 0);

  // Custom Tooltip for a cleaner look
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-md border border-slate-100 p-3 rounded-2xl shadow-xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            {payload[0].name}
          </p>
          <p className="text-lg font-extrabold text-slate-900">
            {payload[0].value} <span className="text-xs font-medium text-slate-500">Users</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative flex flex-col h-full group">
      {/* Chart Section */}
      <div className="relative h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              dataKey="value"
              innerRadius={75}
              outerRadius={100}
              paddingAngle={8} // Increased for a more "segmented" modern look
              stroke="none"
              cornerRadius={10} // Rounded edges on the donut segments
              animationBegin={0}
              animationDuration={1200}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.fill} 
                  className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text - More prominent for KPIs */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            Workforce
          </span>
          <span className="text-4xl font-extrabold text-slate-900 tracking-tighter">
            {total}
          </span>
          <div className="h-1 w-8 bg-slate-100 rounded-full mt-1" />
        </div>
      </div>

      {/* Enhanced Custom Legend */}
      <div className="mt-auto grid grid-cols-1 gap-2 pt-4 border-t border-slate-50">
        {data.map((item, i) => {
          const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
          return (
            <div key={i} className="flex items-center justify-between group/item">
              <div className="flex items-center gap-3">
                <div 
                  className="w-2.5 h-2.5 rounded-full ring-4 ring-offset-2 transition-all group-hover/item:scale-110" 
                  style={{ backgroundColor: item.fill, borderColor: `${item.fill}20` }} 
                />
                <span className="text-xs font-bold text-slate-600 group-hover/item:text-slate-900 transition-colors">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-slate-400">
                  {item.value}
                </span>
                <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-lg bg-slate-50 text-slate-600`}>
                  {percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}