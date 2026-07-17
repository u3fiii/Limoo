/** Limoo wordmark + mark — black on lime brand field */
export default function LimooLogo({ size = 'md' }) {
  const sizes = {
    md: { mark: 'size-16', word: 'text-[1.75rem]', gap: 'gap-2.5' },
    sm: { mark: 'size-12', word: 'text-xl', gap: 'gap-2' },
  }
  const s = sizes[size] ?? sizes.md

  return (
    <div className={`flex flex-col items-center ${s.gap}`}>
      <div
        className={`${s.mark} flex items-center justify-center rounded-full bg-cta text-cta-foreground`}
        aria-hidden
      >
        <svg viewBox="0 0 48 48" className="size-[55%] fill-current" aria-hidden>
          <path d="M24 8c6.5 0 12 5.2 12 12.2 0 8.4-7.2 14.3-12 19.8-4.8-5.5-12-11.4-12-19.8C12 13.2 17.5 8 24 8Zm0 6.5c-3.2 0-5.8 2.6-5.8 5.9 0 4.8 3.6 8.2 5.8 10.6 2.2-2.4 5.8-5.8 5.8-10.6 0-3.3-2.6-5.9-5.8-5.9Z" />
        </svg>
      </div>
      <span className={`${s.word} font-bold lowercase tracking-tight text-cta`}>limoo</span>
    </div>
  )
}
