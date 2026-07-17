import { formatPrice } from '../utils/format'
import { IconBasket } from './Icons'
import { toPersianDigits } from '../utils/format'

export default function PinnedBar({ itemCount, total }) {
  const empty = itemCount === 0

  return (
    <div className="shrink-0 border-b border-border bg-surface px-4 py-2.5">
      <div className="flex items-center gap-2.5 rounded-md bg-surface-secondary px-3 py-2.5">
        <div className="flex size-8 items-center justify-center rounded-full bg-primary-soft text-primary-foreground">
          <IconBasket className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-text">
            {empty
              ? 'سبد خالی است'
              : `${toPersianDigits(itemCount)} کالا · ${formatPrice(total)}`}
          </p>
          <p className="text-xs text-text-muted">
            {empty ? 'فروشنده کالا را به سبد اضافه می‌کند' : 'آماده ادامه گفتگو برای خرید'}
          </p>
        </div>
      </div>
    </div>
  )
}
