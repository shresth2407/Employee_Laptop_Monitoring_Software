import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const ProductivityChart = ({ data = [] }) => {
  const safeData = (data || []).map(item => ({
    day: item.day || "",
    hours: parseFloat(item.hours) || 0
  }));

  return (
    // Fixed compact height ensures it fits perfectly inside the dashboard widget
    <div className="w-full h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={safeData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
          <defs>
            <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            vertical={false} 
            stroke="#f1f5f9" 
            strokeDasharray="3 3" 
          />
          
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fontWeight: 500, fill: '#64748b' }} 
            dy={10}
          />
          
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fontWeight: 500, fill: '#64748b' }} 
            dx={-10}
          />
          
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#ffffff', 
              borderRadius: '8px', 
              border: '1px solid #e2e8f0', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              fontSize: '12px',
              color: '#0f172a'
            }}
            itemStyle={{ color: '#6366f1', fontWeight: 600 }}
            labelStyle={{ color: '#64748b', marginBottom: '4px', fontWeight: 500 }}
            cursor={{ stroke: '#e2e8f0', strokeWidth: 2, strokeDasharray: '3 3' }}
          />
          
          <Area 
            type="monotone" 
            dataKey="hours" 
            name="Logged Hours"
            stroke="#6366f1" 
            strokeWidth={3} 
            fillOpacity={1} 
            fill="url(#colorHours)" 
            activeDot={{ r: 5, fill: '#6366f1', stroke: '#ffffff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductivityChart;