import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Avatar from './Avatar'
import { IconPlay, IconPlus, IconVolume } from './Icons'
import bookmarkIcon from '../assets/reel/bookmark.png'
import likeIcon from '../assets/reel/like.png'
import muteIcon from '../assets/reel/mute.png'
import shareIcon from '../assets/reel/share.png'
import { getProductById } from '../data/products'
import { getSellerById } from '../data/sellers'
import { formatCompactCount, formatPrice } from '../utils/format'

function ActionIcon({ src, className = '' }) {
  return (
    <span
      aria-hidden
      className={`nav-icon-mask block size-5 shrink-0 bg-current ${className}`}
      style={{
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
      }}
    />
  )
}

function ActionButton({ children, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1 text-text-inverse"
      aria-label={label}
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-glass backdrop-blur-md">
        {children}
      </span>
    </button>
  )
}

export default function ReelSlide({ reel, isActive, globalMuted, onToggleMute }) {
  const seller = getSellerById(reel.sellerId)
  const products = reel.productIds.map(getProductById).filter(Boolean)
  const videoRef = useRef(null)
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [clipIndex, setClipIndex] = useState(0)
  const [following, setFollowing] = useState(false)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (!isActive) setPaused(false)
  }, [isActive])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined

    video.muted = globalMuted

    if (!isActive) {
      video.pause()
      try {
        video.currentTime = 0
      } catch {
        /* ignore seek before metadata */
      }
      return undefined
    }

    if (paused) {
      video.pause()
      return undefined
    }

    const tryPlay = () => {
      const play = video.play()
      if (play?.catch) play.catch(() => {})
    }

    video.addEventListener('canplay', tryPlay, { once: true })
    video.addEventListener('loadeddata', tryPlay, { once: true })

    // Force a fresh buffer when this slide becomes active (reels + cache bust).
    if (video.readyState < 3) {
      video.load()
    }
    tryPlay()

    return () => {
      video.removeEventListener('canplay', tryPlay)
      video.removeEventListener('loadeddata', tryPlay)
    }
  }, [isActive, globalMuted, paused, reel.videoUrl])

  const togglePlayback = () => {
    if (!isActive) return
    setPaused((p) => !p)
  }

  if (!seller) return null

  const likeCount = liked ? reel.likes + 1 : reel.likes

  return (
    <section className="relative h-full w-full overflow-hidden bg-reel-bg">
      <video
        ref={videoRef}
        className="absolute inset-0 size-full object-cover"
        src={reel.videoUrl}
        poster={reel.poster || undefined}
        playsInline
        loop
        muted={globalMuted}
        preload={isActive ? 'auto' : 'metadata'}
        autoPlay={isActive && !paused}
      />

      {/* Tap layer — pause / resume */}
      <button
        type="button"
        className="absolute inset-0 z-10"
        onClick={togglePlayback}
        aria-label={paused ? 'Play' : 'Pause'}
      />

      {/* Bottom scrim — above video, behind UI (pitch black 100% → 0%) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[11] h-[100%] bg-gradient-to-t from-reel-scrim to-transparent"
      />

      {paused && isActive && (
        <button
          type="button"
          onClick={togglePlayback}
          className="absolute inset-0 z-20 flex items-center justify-center"
          aria-label="Play"
        >
          <IconPlay className="size-16 drop-shadow-lg transition active:scale-95" />
        </button>
      )}

      {/* Top: clip dots + plus (plus on left) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-4 pt-[calc(2rem+env(safe-area-inset-top)+0.25rem)]">
        {/* Balance spacer — same size as plus button (RTL: sits on the right) */}
        <span className="size-11 shrink-0" aria-hidden />

        <div className="pointer-events-auto absolute inset-x-0 flex items-center justify-center gap-1.5">
          {reel.clips.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setClipIndex(i)}
              className={`h-1.5 rounded-pill transition-all ${
                i === clipIndex ? 'w-4 bg-text-inverse' : 'w-1.5 bg-text-inverse/40'
              }`}
              aria-label={`کلیپ ${i + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          className="pointer-events-auto flex size-11 shrink-0 items-center justify-center rounded-full bg-glass text-text-inverse backdrop-blur-md"
          aria-label="افزودن"
        >
          <IconPlus className="size-5" />
        </button>
      </div>

      {/* Side actions — start-4 matches product cards px-4 */}
      <div className="absolute bottom-44 start-4 z-30 flex flex-col items-start gap-4 md:bottom-40">
        <div className="flex w-11 flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <ActionButton label="لایک" onClick={() => setLiked((v) => !v)}>
              <ActionIcon src={likeIcon} className={liked ? 'text-like' : ''} />
            </ActionButton>
            <span className="text-xs font-medium text-text-inverse drop-shadow">
              {formatCompactCount(likeCount)}
            </span>
          </div>

          <ActionButton label="ذخیره" onClick={() => setSaved((v) => !v)}>
            <ActionIcon src={bookmarkIcon} className={saved ? 'text-primary' : ''} />
          </ActionButton>

          <ActionButton label="اشتراک‌گذاری">
            <ActionIcon src={shareIcon} />
          </ActionButton>

          <ActionButton label={globalMuted ? 'صدا روشن' : 'بی‌صدا'} onClick={onToggleMute}>
            {globalMuted ? <ActionIcon src={muteIcon} /> : <IconVolume className="size-5" />}
          </ActionButton>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative flex w-11 shrink-0 justify-center">
            <Avatar
              src={seller.avatar}
              alt={seller.name}
              size="md"
              className="ring-2 ring-white/80"
            />
            <button
              type="button"
              onClick={() => setFollowing(true)}
              className="absolute -bottom-1 left-[calc(50%-8px)] flex size-5 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground"
              aria-label={following ? 'دنبال می‌کنی' : 'دنبال کردن'}
            >
              <IconPlus className="size-3.5" />
            </button>
          </div>
          <div className="min-w-0 max-w-[9.5rem]">
            <p className="truncate text-sm font-bold text-text-inverse drop-shadow">{seller.name}</p>
            <p className="mt-0.5 truncate text-xs text-text-inverse/80 drop-shadow">@{seller.handle}</p>
          </div>
        </div>
      </div>

      {/* Product cards row */}
      <div className="absolute inset-x-0 bottom-[5.25rem] z-30 md:bottom-[5rem]">
        <div
          data-reel-pan
          className="flex gap-2.5 overflow-x-auto no-scrollbar px-4"
        >
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="flex min-w-[210px] max-w-[240px] shrink-0 items-center gap-2.5 rounded-card bg-glass-strong p-2 backdrop-blur-md transition active:scale-[0.98]"
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="size-12 shrink-0 rounded-md object-cover bg-surface-secondary"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-text-inverse">{product.name}</p>
                <p className="mt-1 truncate text-[0.6875rem] font-normal text-text-inverse/70">
                  {formatPrice(product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
