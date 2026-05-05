import { TrendingUp, Users, Clock, Zap, AlertCircle, Activity } from "lucide-react";

const ManagerStatCard = ({ title, value, type = "default", trend }) => {
  // Define premium themes to match the new Slate & Emerald aesthetic
  const themes = {
    default: {
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      icon: <Users size={20} />,
      trendColor: "text-indigo-500",
      trendIcon: <Activity size={14} />
    },
    performance: {
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      icon: <Zap size={20} />,
      trendColor: "text-emerald-500",
      trendIcon: <TrendingUp size={14} />
    },
    urgency: {
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      icon: <Clock size={20} />,
      trendColor: "text-amber-500",
      trendIcon: <AlertCircle size={14} />
    }
  };

  const theme = themes[type] || themes.default;

  return (
    <div className="relative group p-5 rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300 flex flex-col h-full overflow-hidden">
      
      {/* ================= TOP SECTION (Title, Value, Icon) ================= */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-500">
            {title}
          </h3>
          <p className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">
            {value}
          </p>
        </div>
        
        {/* Dynamic Icon Container */}
        <div className={`p-2.5 rounded-xl transition-colors duration-300 ${theme.iconBg} ${theme.iconColor}`}>
          {theme.icon}
        </div>
      </div>

      {/* ================= BOTTOM SECTION (Trend) ================= */}
      {trend && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
          <div className="flex items-center gap-1.5">
            <span className={theme.trendColor}>
              {theme.trendIcon}
            </span>
            <span className="text-xs font-medium text-slate-600">
              {trend}
            </span>
          </div>
          
          {/* Subtle decoration for visual balance */}
          <div className="flex gap-1">
            <div className={`w-1.5 h-1.5 rounded-full bg-slate-200 transition-colors group-hover:${theme.iconBg.replace('bg-', 'bg-').replace('50', '400')}`}></div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-100"></div>
          </div>
        </div>
      )}

      {/* Subtle background glow effect on hover */}
      <div className={`absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20 pointer-events-none ${theme.iconBg.replace('50', '500')}`}></div>
    </div>
  );
};

export default ManagerStatCard;