export default function EmptyState({
  title = "No data found",
  subtitle = "",
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>

      {subtitle ? (
        <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
      ) : null}
    </div>
  );
}