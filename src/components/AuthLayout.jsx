import LimooLogo from './LimooLogo'

/** Shared signup chrome: lime brand field + white bottom sheet */
export default function AuthLayout({ children, footer }) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-primary">
      <div className="flex shrink-0 flex-col items-center justify-center px-6 pb-8 pt-[calc(2.75rem+env(safe-area-inset-top))]">
        <LimooLogo />
      </div>

      <div className="flex min-h-0 flex-1 flex-col rounded-t-sheet bg-surface px-6 pb-6 pt-8 shadow-lg">
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        {footer ? <div className="shrink-0 pt-4 text-center">{footer}</div> : null}
      </div>
    </div>
  )
}

export function AuthPrimaryButton({ children, disabled, type = 'button', onClick }) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="flex min-h-14 w-full items-center justify-center rounded-btn bg-cta text-base font-bold text-cta-foreground transition enabled:active:opacity-90 disabled:opacity-35"
    >
      {children}
    </button>
  )
}

export function AuthTextField({
  value,
  onChange,
  placeholder,
  type = 'text',
  inputMode,
  autoFocus,
  className = '',
  ...rest
}) {
  return (
    <input
      type={type}
      inputMode={inputMode}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoFocus={autoFocus}
      className={`min-h-14 w-full rounded-btn bg-input px-4 text-base text-text outline-none placeholder:text-text-muted focus:ring-2 focus:ring-cta/15 ${className}`}
      {...rest}
    />
  )
}
