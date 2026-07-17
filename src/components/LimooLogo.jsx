import logoSrc from '../assets/limoo-logo.png'

/** Limoo brand mark + optional wordmark */
export default function LimooLogo({ size = 'md', showWordmark = true }) {
  const sizes = {
    md: { mark: 'size-20', word: 'text-[1.75rem]', gap: 'gap-3' },
    sm: { mark: 'size-14', word: 'text-xl', gap: 'gap-2' },
  }
  const s = sizes[size] ?? sizes.md

  return (
    <div className={`flex flex-col items-center ${s.gap}`}>
      <img
        src={logoSrc}
        alt="Limoo"
        className={`${s.mark} object-contain`}
      />
      {showWordmark ? (
        <span className={`${s.word} font-bold lowercase tracking-tight text-cta`}>limoo</span>
      ) : null}
    </div>
  )
}
