import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const StatCard = ({ title, value, icon, trend, variant = "minimal" }) => {
  // Define styles based on the variant prop
  const variants = {
    minimal: "bg-white border-zinc-100 shadow-sm",
    primary: "bg-white border-emerald-100 shadow-[0_15px_30px_rgba(16,185,129,0.05)] ring-1 ring-emerald-50",
    glass: "bg-white/60 backdrop-blur-md border-white shadow-md",
  };

  // Logic to color the trend text
  const getTrendColor = (t) => {
    if (!t) return "text-zinc-400";
    if (t.includes("+")) return "text-emerald-600";
    if (t.includes("-")) return "text-rose-600";
    return "text-zinc-400";
  };

  return (
    <div className={`group relative p-6 rounded-[2rem] border transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-200/50 ${variants[variant]}`}>
      
      {/* Header Area: Title & Icon */}
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-1">
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
            {title}
          </h3>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-light text-zinc-900 tracking-tighter">
              {value}
            </p>
          </div>
        </div>
        
        {icon && (
          <div className={`p-2.5 rounded-xl transition-colors duration-500 ${variant === 'primary' ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-50 text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white'}`}>
            {icon}
          </div>
        )}
      </div>

      {/* Footer Area: Trends & Decorative Line */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
        <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${getTrendColor(trend)}`}>
          {trend?.includes("+") && <TrendingUp size={12} strokeWidth={3} />}
          {trend?.includes("-") && <TrendingDown size={12} strokeWidth={3} />}
          {!trend?.includes("+") && !trend?.includes("-") && <Minus size={12} strokeWidth={3} />}
          {trend || "Stable"}
        </div>
        
        {/* Subtle decorative "Activity" dots */}
        <div className="flex gap-1">
          <span className="w-1 h-1 rounded-full bg-zinc-100"></span>
          <span className="w-1 h-1 rounded-full bg-zinc-200"></span>
          <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
        </div>
      </div>

      {/* Subtle Glow Overlay for Primary variant */}
      {variant === "primary" && (
        <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 blur-3xl rounded-full -z-10"></div>
      )}
    </div>
  );
};

export default StatCard;