/** Convert Western digits to Persian digits */
export function toPersianDigits(value) {
  const map = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  return String(value).replace(/\d/g, (d) => map[Number(d)])
}

/** Normalize Persian/Arabic digits to Western 0-9 */
export function toWesternDigits(value) {
  return String(value)
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - '۰'.charCodeAt(0)))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - '٠'.charCodeAt(0)))
}

/** Keep only digits (normalized to Western) */
export function onlyDigits(value) {
  return toWesternDigits(value).replace(/\D/g, '')
}

/** Format Iranian mobile for display, e.g. ۰۹۱۲۸۰۰۴۵۶۷ */
export function formatPhoneDisplay(phone) {
  return toPersianDigits(onlyDigits(phone))
}

/**
 * Format a price in Tomans with Persian digits + thousands separators.
 * @example formatPrice(320000) → "۳۲۰,۰۰۰ تومان"
 */
export function formatPrice(amount) {
  const formatted = Number(amount).toLocaleString('en-US')
  return `${toPersianDigits(formatted)} تومان`
}

/** Format compact counts, e.g. 3200 → ۳K */
export function formatCompactCount(n) {
  if (n >= 1000) {
    const k = n / 1000
    const label = Number.isInteger(k) ? String(k) : k.toFixed(1).replace(/\.0$/, '')
    return `${toPersianDigits(label)}K`
  }
  return toPersianDigits(n)
}

/** Format a timestamp as HH:MM in Persian digits */
export function formatTime(timestamp) {
  const date = new Date(timestamp)
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  return toPersianDigits(`${h}:${m}`)
}
