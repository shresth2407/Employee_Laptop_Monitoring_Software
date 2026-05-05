export default function PageHeader({
  title,
  subtitle,
  rightContent = null,
  breadcrumbs = null,
}) {
  return (
    <div className="relative">
      {/* Optional Breadcrumbs Row - Centered on mobile */}
      {breadcrumbs && (
        <div className="flex items-center justify-center md:justify-start gap-2 mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {breadcrumbs}
        </div>
      )}

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        
        {/* Title and Subtitle Group */}
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            {title}
          </h1>
          
          {subtitle ? (
            <p className="text-base font-medium text-slate-500 mx-auto md:mx-0 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          ) : null}
        </div>

        {/* Right Content Group (Search/Buttons) */}
        {rightContent ? (
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 w-full md:w-auto transition-all">
            {rightContent}
          </div>
        ) : null}
      </div>

      {/* Premium Detail Underline - Centered gradient on mobile */}
      <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent md:from-slate-200 md:via-slate-100 md:to-transparent" />
    </div>
  );
}