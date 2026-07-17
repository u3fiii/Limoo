export default function PlaceholderScreen({ title, subtitle }) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-bg pt-[calc(2rem+env(safe-area-inset-top))]">
      <header className="shrink-0 border-b border-border bg-surface px-4 pb-3 pt-1">
        <h1 className="text-xl font-bold text-text">{title}</h1>
        {subtitle && <p className="text-sm text-text-muted">{subtitle}</p>}
      </header>
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <p className="text-sm text-text-muted">این بخش در فاز بعدی اضافه می‌شود.</p>
      </div>
    </div>
  )
}
