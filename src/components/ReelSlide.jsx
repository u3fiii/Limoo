import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Avatar from './Avatar'
import { IconPlus } from './Icons'
import bookmarkIcon from '../assets/reel/bookmark.png'
import likeIcon from '../assets/reel/like.png'
import muteIcon from '../assets/reel/mute.png'
import playIcon from '../assets/reel/play.png'
import shareIcon from '../assets/reel/share.png'
import volumeIcon from '../assets/reel/volume.png'
import { getProductById, productImageUrl } from '../data/products'
import { getSellerById } from '../data/sellers'
import { formatCompactCount, formatPrice } from '../utils/format'

const VIEWPORT_THRESHOLD = 0.75
const CLIP_SNAP_MS = 160

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3
}

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

function ClipVideo({ clip, isActive, globalMuted, paused }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined

    if (!isActive) {
      video.pause()
      video.removeAttribute('src')
      video.load()
      return undefined
    }

    video.muted = globalMuted

    if (video.getAttribute('src') !== clip.videoUrl) {
      video.src = clip.videoUrl
      video.load()
    }

    if (paused) {
      video.pause()
      return undefined
    }

    const tryPlay = () => {
      const play = video.play()
      if (play?.catch) play.catch(() => {})
    }

    if (video.readyState >= 2) {
      tryPlay()
      return undefined
    }

    video.addEventListener('canplay', tryPlay, { once: true })
    return () => video.removeEventListener('canplay', tryPlay)
  }, [clip.videoUrl, globalMuted, isActive, paused])

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 size-full object-cover"
      poster={clip.poster}
      playsInline
      loop
      muted={globalMuted}
      preload="none"
      autoPlay={isActive && !paused}
    />
  )
}

const ReelSlide = forwardRef(function ReelSlide(
  { reel, scrollRoot, globalMuted, onToggleMute },
  ref,
) {
  const sectionRef = useRef(null)
  const clipScrollerRef = useRef(null)
  const clipAnimatingRef = useRef(false)
  const [inViewport, setInViewport] = useState(false)
  const [clipIndex, setClipIndex] = useState(0)
  const [likedByClip, setLikedByClip] = useState({})
  const [savedByClip, setSavedByClip] = useState({})
  const [followingByClip, setFollowingByClip] = useState({})
  const [paused, setPaused] = useState(false)

  const clips = reel.clips?.length
    ? reel.clips
    : [{
        id: `${reel.id}c0`,
        sellerId: reel.sellerId,
        likes: reel.likes ?? 0,
        videoUrl: reel.videoUrl,
        poster: reel.poster,
        productIds: reel.productIds ?? [],
      }]

  const activeClip = clips[clipIndex] ?? clips[0]
  const seller = getSellerById(activeClip.sellerId)
  const products = (activeClip.productIds ?? []).map(getProductById).filter(Boolean)
  const isLiked = Boolean(likedByClip[activeClip.id])
  const isSaved = Boolean(savedByClip[activeClip.id])
  const isFollowing = Boolean(followingByClip[activeClip.id])

  const getClipMetrics = () => {
    const el = clipScrollerRef.current
    const width = el?.clientWidth || 0
    const index = width ? Math.round(el.scrollLeft / width) : 0
    return { el, width, index, count: clips.length }
  }

  const animateClipTo = (rawIndex) => {
    const { el, width, index, count } = getClipMetrics()
    if (!el || !width || clipAnimatingRef.current) return false

    const next = Math.max(0, Math.min(count - 1, rawIndex))
    if (next === index && Math.abs(el.scrollLeft - next * width) < 2) return false

    const start = el.scrollLeft
    const target = next * width
    const dist = target - start

    if (Math.abs(dist) < 1) {
      setClipIndex(next)
      return true
    }

    clipAnimatingRef.current = true
    setClipIndex(next)

    const t0 = performance.now()
    const frame = (now) => {
      const t = Math.min(1, (now - t0) / CLIP_SNAP_MS)
      el.scrollLeft = start + dist * easeOutCubic(t)
      if (t < 1) {
        requestAnimationFrame(frame)
        return
      }
      el.scrollLeft = target
      clipAnimatingRef.current = false
    }
    requestAnimationFrame(frame)
    return true
  }

  useImperativeHandle(ref, () => ({
    hasMultipleClips: () => clips.length > 1,
    isClipAnimating: () => clipAnimatingRef.current,
    getClipState: () => {
      const { index, count } = getClipMetrics()
      return {
        clipIndex: index,
        clipCount: count,
        atStart: index <= 0,
        atEnd: index >= count - 1,
      }
    },
    getClipScrollLeft: () => clipScrollerRef.current?.scrollLeft ?? 0,
    setClipScroll: (scrollLeft) => {
      const el = clipScrollerRef.current
      if (!el) return
      el.scrollLeft = scrollLeft
    },
    scrollClipBy: (delta) => animateClipTo(getClipMetrics().index + delta),
    scrollClipTo: (index) => animateClipTo(index),
    snapClipNearest: () => {
      const { index } = getClipMetrics()
      animateClipTo(index)
    },
  }))

  useEffect(() => {
    const root = scrollRoot?.current
    const target = sectionRef.current
    if (!root || !target) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        setInViewport(entry.isIntersecting && entry.intersectionRatio >= VIEWPORT_THRESHOLD)
      },
      { root, threshold: [0, 0.25, 0.5, VIEWPORT_THRESHOLD, 1] },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [scrollRoot])

  useEffect(() => {
    if (!inViewport) {
      setPaused(false)
      const el = clipScrollerRef.current
      if (el) {
        el.scrollLeft = 0
        setClipIndex(0)
      }
    }
  }, [inViewport])

  const togglePlayback = () => {
    if (!inViewport) return
    setPaused((p) => !p)
  }

  if (!seller || !activeClip) return null

  const likeCount = isLiked ? activeClip.likes + 1 : activeClip.likes
  const showPauseOverlay = paused && inViewport

  return (
    <section ref={sectionRef} className="relative h-full w-full overflow-hidden bg-reel-bg">
      <div
        ref={clipScrollerRef}
        data-reel-clips
        dir="ltr"
        className="absolute inset-0 flex overflow-x-scroll overscroll-x-contain no-scrollbar"
      >
        {clips.map((clip, i) => (
          <div key={clip.id} className="relative h-full min-w-full w-full shrink-0">
            <ClipVideo
              clip={clip}
              isActive={inViewport && clipIndex === i}
              globalMuted={globalMuted}
              paused={paused}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        className="absolute inset-0 z-10"
        onClick={togglePlayback}
        aria-label={paused ? 'Play' : 'Pause'}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[11] h-[100%] bg-gradient-to-t from-reel-scrim to-transparent"
      />

      {showPauseOverlay && (
        <button
          type="button"
          onClick={togglePlayback}
          className="absolute inset-0 z-20 flex items-center justify-center"
          aria-label="Play"
        >
          <span className="reel-play-in flex size-14 items-center justify-center rounded-full bg-overlay drop-shadow-lg transition-transform duration-150 active:scale-95">
            <span
              aria-hidden
              className="nav-icon-mask block size-7 shrink-0 bg-text-inverse ms-0.5"
              style={{
                maskImage: `url(${playIcon})`,
                WebkitMaskImage: `url(${playIcon})`,
              }}
            />
          </span>
        </button>
      )}

      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-4 pt-[calc(2rem+env(safe-area-inset-top)+0.25rem)]">
        <span className="size-11 shrink-0" aria-hidden />

        {clips.length > 1 ? (
          <div className="pointer-events-auto absolute inset-x-0 flex flex-row-reverse items-center justify-center gap-1.5">
            {clips.map((clip, i) => (
              <button
                key={clip.id}
                type="button"
                onClick={() => animateClipTo(i)}
                className={`h-1.5 rounded-pill transition-all ${
                  i === clipIndex ? 'w-4 bg-text-inverse' : 'w-1.5 bg-text-inverse/40'
                }`}
                aria-label={`کلیپ ${i + 1}`}
              />
            ))}
          </div>
        ) : null}

        <button
          type="button"
          className="pointer-events-auto flex size-11 shrink-0 items-center justify-center rounded-full bg-glass text-text-inverse backdrop-blur-md"
          aria-label="افزودن"
        >
          <IconPlus className="size-5" />
        </button>
      </div>

      <div
        key={activeClip.id}
        className="absolute bottom-44 start-4 z-30 flex flex-col items-start gap-4 md:bottom-40"
      >
        <div className="flex w-11 flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <ActionButton
              label="لایک"
              onClick={() =>
                setLikedByClip((prev) => ({ ...prev, [activeClip.id]: !prev[activeClip.id] }))
              }
            >
              <ActionIcon src={likeIcon} className={isLiked ? 'text-like' : ''} />
            </ActionButton>
            <span className="text-xs font-medium text-text-inverse drop-shadow">
              {formatCompactCount(likeCount)}
            </span>
          </div>

          <ActionButton
            label="ذخیره"
            onClick={() =>
              setSavedByClip((prev) => ({ ...prev, [activeClip.id]: !prev[activeClip.id] }))
            }
          >
            <ActionIcon src={bookmarkIcon} className={isSaved ? 'text-primary' : ''} />
          </ActionButton>

          <ActionButton label="اشتراک‌گذاری">
            <ActionIcon src={shareIcon} />
          </ActionButton>

          <ActionButton label={globalMuted ? 'صدا روشن' : 'بی‌صدا'} onClick={onToggleMute}>
            {globalMuted ? <ActionIcon src={muteIcon} /> : <ActionIcon src={volumeIcon} />}
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
              onClick={() =>
                setFollowingByClip((prev) => ({ ...prev, [activeClip.id]: true }))
              }
              className="absolute -bottom-1 left-[calc(50%-8px)] flex size-5 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground"
              aria-label={isFollowing ? 'دنبال می‌کنی' : 'دنبال کردن'}
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

      <div key={`${activeClip.id}-products`} className="absolute inset-x-0 bottom-[5.25rem] z-30 md:bottom-[5rem]">
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
                src={productImageUrl(product.images[0], 'thumb')}
                alt={product.name}
                referrerPolicy="no-referrer"
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
})

export default ReelSlide
