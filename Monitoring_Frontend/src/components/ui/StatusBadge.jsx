
export default function StatusBadge({ status }) {
  const value = String(status || "").toUpperCase();

  const base =
    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-200";

  const dot = "w-2 h-2 rounded-full";

  let config = {
    label: status || "Unknown",
    bg: "bg-slate-100",
    text: "text-slate-600",
    dot: "bg-slate-400",
  };

  if (value === "ACTIVE" || value === "ONLINE" || value === "TRUE") {
    config = {
      label: "Active",
      bg: "bg-green-50",
      text: "text-green-700",
      dot: "bg-green-500",
    };
  }

  if (value === "IDLE") {
    config = {
      label: "Idle",
      bg: "bg-amber-50",
      text: "text-amber-700",
      dot: "bg-amber-500",
    };
  }

  if (value === "OFFLINE") {
    config = {
      label: "Offline",
      bg: "bg-red-50",
      text: "text-red-700",
      dot: "bg-red-500",
    };
  }

  if (value === "INACTIVE" || value === "FALSE") {
    config = {
      label: "Inactive",
      bg: "bg-slate-100",
      text: "text-slate-600",
      dot: "bg-slate-400",
    };
  }

  return (
    <span
      className={`
        ${base}
        ${config.bg}
        ${config.text}
        hover:scale-[1.03]
      `}
    >
      <span className={`${dot} ${config.dot}`} />
      {config.label}
    </span>
  );
}