export default function SectionCard({
  title,
  subtitle,
  children,
  rightContent,
  className = "",
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}
    >
      {/* Header */}
      {(title || rightContent) && (
        <div className="mb-4 flex items-start justify-between">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-slate-900">
                {title}
              </h3>
            )}

            {subtitle && (
              <p className="mt-1 text-sm text-slate-500">
                {subtitle}
              </p>
            )}
          </div>

          {rightContent && <div>{rightContent}</div>}
        </div>
      )}

      {/* Content */}
      <div>{children}</div>
    </div>
  );
}