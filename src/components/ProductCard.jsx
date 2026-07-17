/**
 * Product card used in chat (inline message + staged composer).
 * state: 'staged' | 'confirmed'
 */
import { formatPrice } from '../utils/format'
import { IconCheck } from './Icons'

export default function ProductCard({
  product,
  state = 'staged',
  note,
  onNoteChange,
  onSend,
  onDismiss,
  compact = false,
}) {
  const isStaged = state === 'staged'
  const isComposer = typeof onSend === 'function'

  return (
    <div
      className={`overflow-hidden rounded-card bg-surface transition ${
        isStaged
          ? 'border-2 border-accent-staged shadow-sm'
          : 'border border-border shadow-sm'
      } ${compact ? '' : ''}`}
    >
      <div className="flex gap-3 p-3">
        <img
          src={product.images[0]}
          alt={product.name}
          className="size-16 shrink-0 rounded-md object-cover bg-surface-secondary"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text">{product.name}</p>
              <p className="mt-0.5 text-sm font-medium text-primary-foreground">
                {formatPrice(product.price)}
              </p>
            </div>
            {!isStaged && (
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-confirmed-soft text-accent-confirmed">
                <IconCheck className="size-3.5" />
              </span>
            )}
          </div>
          {!isComposer && note ? (
            <p className="mt-1.5 line-clamp-2 text-xs text-text-secondary">{note}</p>
          ) : null}
        </div>
      </div>

      {isComposer && (
        <div className="space-y-2 border-t border-border px-3 py-2.5">
          <input
            type="text"
            value={note ?? ''}
            onChange={(e) => onNoteChange?.(e.target.value)}
            placeholder="یادداشت اختیاری برای فروشنده…"
            className="w-full rounded-md border border-border bg-surface-secondary px-3 py-2 text-sm text-text outline-none placeholder:text-text-muted focus:border-accent-staged"
          />
          <div className="flex gap-2">
            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                className="min-h-10 flex-1 rounded-pill border border-border bg-surface px-3 text-sm font-medium text-text-secondary transition active:bg-surface-secondary"
              >
                انصراف
              </button>
            )}
            <button
              type="button"
              onClick={onSend}
              className="min-h-10 flex-[1.4] rounded-pill bg-accent-staged px-3 text-sm font-semibold text-text-inverse transition active:opacity-90"
            >
              ارسال کالا
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
