export default function QuickReplyChip({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 rounded-pill border border-border bg-surface px-3.5 py-2 text-sm text-text shadow-sm transition active:bg-primary-soft"
    >
      {label}
    </button>
  )
}
