export default function Avatar({ src, alt, size = 'md', className = '' }) {
  const sizes = {
    sm: 'size-8',
    md: 'size-10',
    lg: 'size-12',
    xl: 'size-[4.5rem]',
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      className={`${sizes[size]} shrink-0 rounded-full object-cover bg-surface-secondary ${className}`}
    />
  )
}
