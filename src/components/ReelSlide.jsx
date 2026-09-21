import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Avatar from './Avatar'
import { IconCheck, IconChevronStart, IconComment, IconFlag, IconStore } from './Icons'
import inoLogo from '../assets/ino-logo.png'
import bookmarkIcon from '../assets/reel/bookmark.png'
import bookmarkFilledIcon from '../assets/reel/bookmark-filled.png'
import likeIcon from '../assets/reel/like.png'
import likeFilledIcon from '../assets/reel/like-filled.png'
import muteIcon from '../assets/reel/mute.png'
import shareIcon from '../assets/reel/share.png'
import volumeIcon from '../assets/reel/volume.png'
import { getProductById, productImageUrl } from '../data/products'
import { getSellerById } from '../data/sellers'
import { formatCompactCount, formatPrice } from '../utils/format'
import { posterForVideo } from '../utils/video'

const VIEWPORT_THRESHOLD = 0.75
const CLIP_SNAP_MS = 160
const HOLD_TO_PAUSE_MS = 220
const TAP_MOVE_TOLERANCE_PX = 10

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3
}

function ActionIcon({ src, className = '' }) {
  return (
    <span
      aria-hidden
      className={`nav-icon-mask block size-7 shrink-0 bg-current ${className}`}
      style={{
        maskImage: `url("${src}")`,
        WebkitMaskImage: `url("${src}")`,
      }}
    />
  )
}

function ActionButton({ children, label, count, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-12 flex-col items-center justify-center gap-1 rounded-pill bg-black/20 text-text-inverse backdrop-blur-md transition active:scale-95 ${
        count == null ? 'h-12' : 'pt-2.5 pb-2'
      }`}
      aria-label={label}
    >
      {children}
      {count != null && <span className="text-xs font-medium leading-none">{count}</span>}
    </button>
  )
}

function ClipVideo({ clip, isActive, globalMuted, paused, onAutoplayMuted }) {
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

    if (video.getAttribute('src') !== clip.videoUrl) {
      video.src = clip.videoUrl
      video.load()
    }

    if (paused) {
      video.pause()
      return undefined
    }

    const tryPlay = () => {
      video.muted = globalMuted
      video
        .play()
        .catch(() => {
          if (globalMuted) return
          video.muted = true
          video.play().catch(() => {})
          onAutoplayMuted?.()
        })
    }

    if (video.readyState >= 2) {
      tryPlay()
      return undefined
    }

    video.addEventListener('canplay', tryPlay, { once: true })
    return () => video.removeEventListener('canplay', tryPlay)
  }, [clip.videoUrl, globalMuted, isActive, paused, onAutoplayMuted])

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 size-full object-cover"
      poster={clip.poster ?? posterForVideo(clip.videoUrl)}
      playsInline
      loop
      muted={globalMuted}
      preload="none"
      autoPlay={isActive && !paused}
    />
  )
}

const ReelSlide = forwardRef(function ReelSlide(
  { reel, scrollRoot, globalMuted, onToggleMute, onAutoplayMuted },
  ref,
) {
  const sectionRef = useRef(null)
  const clipScrollerRef = useRef(null)
  const clipAnimatingRef = useRef(false)
  const [inViewport, setInViewport] = useState(false)
  const [clipIndex, setClipIndex] = useState(0)
  const [likedByClip, setLikedByClip] = useState({})
  const [likePopClipId, setLikePopClipId] = useState(null)
  const [savedByClip, setSavedByClip] = useState({})
  const [followingByClip, setFollowingByClip] = useState({})
  const [paused, setPaused] = useState(false)
  const [muteFlash, setMuteFlash] = useState(null)
  const holdTimerRef = useRef(null)
  const pressStartRef = useRef(null)
  const suppressTapRef = useRef(false)
  const navigate = useNavigate()

  const clips = reel.clips?.length
    ? reel.clips
    : [{
        id: `${reel.id}c0`,
        sellerId: reel.sellerId,
        likes: reel.likes ?? 0,
        videoUrl: reel.videoUrl,
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

  useEffect(() => () => window.clearTimeout(holdTimerRef.current), [])

  // Tap toggles sound; pressing and holding pauses until release.
  const clearHoldTimer = () => {
    window.clearTimeout(holdTimerRef.current)
    holdTimerRef.current = null
  }

  const onPressStart = (e) => {
    if (!inViewport || (e.pointerType === 'mouse' && e.button !== 0)) return
    suppressTapRef.current = false
    pressStartRef.current = { x: e.clientX, y: e.clientY }
    e.currentTarget.setPointerCapture?.(e.pointerId)
    clearHoldTimer()
    holdTimerRef.current = window.setTimeout(() => {
      holdTimerRef.current = null
      suppressTapRef.current = true
      setPaused(true)
    }, HOLD_TO_PAUSE_MS)
  }

  const onPressMove = (e) => {
    const start = pressStartRef.current
    if (!start || suppressTapRef.current) return
    if (Math.hypot(e.clientX - start.x, e.clientY - start.y) > TAP_MOVE_TOLERANCE_PX) {
      clearHoldTimer()
      suppressTapRef.current = true
    }
  }

  const onPressEnd = () => {
    clearHoldTimer()
    pressStartRef.current = null
    setPaused(false)
  }

  const onTap = () => {
    if (suppressTapRef.current) {
      suppressTapRef.current = false
      return
    }
    if (!inViewport) return
    setMuteFlash({ key: Date.now(), muted: !globalMuted })
    onToggleMute?.()
  }

  if (!seller || !activeClip) return null

  const likeCount = isLiked ? activeClip.likes + 1 : activeClip.likes

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
              onAutoplayMuted={onAutoplayMuted}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        className="reel-tap-surface absolute inset-0 z-10"
        onClick={onTap}
        onPointerDown={onPressStart}
        onPointerMove={onPressMove}
        onPointerUp={onPressEnd}
        onPointerCancel={onPressEnd}
        onContextMenu={(e) => e.preventDefault()}
        aria-label={globalMuted ? 'وصل صدا' : 'قطع صدا'}
      />

      {muteFlash && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <span
            key={muteFlash.key}
            onAnimationEnd={() => setMuteFlash(null)}
            className="reel-mute-flash flex size-14 items-center justify-center rounded-full bg-overlay drop-shadow-lg"
          >
            <span
              aria-hidden
              className="nav-icon-mask block size-7 shrink-0 bg-text-inverse"
              style={{
                maskImage: `url(${muteFlash.muted ? muteIcon : volumeIcon})`,
                WebkitMaskImage: `url(${muteFlash.muted ? muteIcon : volumeIcon})`,
              }}
            />
          </span>
        </div>
      )}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[calc(7rem+env(safe-area-inset-top))] bg-linear-to-b from-black/60 via-black/25 to-transparent"
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex flex-row-reverse items-center justify-between px-4 pt-[calc(1rem+env(safe-area-inset-top))]">
        <div className="pointer-events-auto flex flex-row-reverse min-w-0 items-center gap-2">
          <Avatar
            src={seller.avatar}
            alt={seller.name}
            size="sm"
            className="ring-2 ring-white/80"
          />
          <div className="flex min-w-0 max-w-[9rem] flex-col items-end text-left">
            <p className="max-w-full truncate text-sm font-bold text-text-inverse drop-shadow">@{seller.handle}</p>
            <button
              type="button"
              onClick={() =>
                setFollowingByClip((prev) => ({ ...prev, [activeClip.id]: !prev[activeClip.id] }))
              }
              className={`mt-1 flex items-center gap-1 rounded-pill py-0.5 text-xs transition-colors ${
                isFollowing
                  ? 'bg-surface ps-0.5 pe-2 font-bold text-text'
                  : 'bg-glass px-2 font-medium text-text-inverse backdrop-blur-md'
              }`}
              aria-pressed={isFollowing}
            >
              {isFollowing && (
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-text text-text-inverse">
                  <IconCheck className="size-2.5" />
                </span>
              )}
              {isFollowing ? 'دنبال شده' : 'دنبال کردن'}
            </button>
          </div>
        </div>

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
          onClick={() => navigate('/sell', { state: { from: '/' } })}
          className="pointer-events-auto flex h-11 shrink-0 items-center justify-center drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
          aria-label="ثبت آگهی"
        >
          <img src={inoLogo} alt="" aria-hidden className="h-8 w-auto" />
        </button>
      </div>

      <div
        key={activeClip.id}
        className="absolute bottom-44 start-4 z-30 flex flex-col items-start gap-4 md:bottom-40"
      >
        <div className="flex w-12 flex-col items-center gap-3">
          <ActionButton
            label="لایک"
            count={formatCompactCount(likeCount)}
            onClick={() => {
              setLikePopClipId(isLiked ? null : activeClip.id)
              setLikedByClip((prev) => ({ ...prev, [activeClip.id]: !prev[activeClip.id] }))
            }}
          >
            <span
              className={`block ${isLiked && likePopClipId === activeClip.id ? 'reel-like-pop' : ''}`}
              onAnimationEnd={() => setLikePopClipId(null)}
            >
              <ActionIcon src={isLiked ? likeFilledIcon : likeIcon} className={isLiked ? 'text-like' : ''} />
            </span>
          </ActionButton>

          <ActionButton label="نظرات" count={formatCompactCount(activeClip.comments ?? 0)}>
            <IconComment className="size-7 shrink-0" />
          </ActionButton>

          <ActionButton label="اشتراک‌گذاری">
            <ActionIcon src={shareIcon} />
          </ActionButton>

          <ActionButton
            label="ذخیره"
            onClick={() =>
              setSavedByClip((prev) => ({ ...prev, [activeClip.id]: !prev[activeClip.id] }))
            }
          >
            <ActionIcon src={isSaved ? bookmarkFilledIcon : bookmarkIcon} />
          </ActionButton>

          <ActionButton label="گزارش">
            <IconFlag className="size-7 shrink-0" />
          </ActionButton>
        </div>

      </div>

      <div key={`${activeClip.id}-products`} className="absolute inset-x-0 bottom-[5.25rem] z-30 md:bottom-[5rem]">
        <div
          data-reel-pan
          className="flex gap-2.5 overflow-x-auto no-scrollbar px-4"
        >
          {products.map((product) => {
            const productSeller = getSellerById(product.sellerId) ?? seller
            return (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className={`flex items-center gap-2 rounded-md border border-border bg-surface p-1.5 pe-1 shadow-md transition active:scale-[0.98] ${
                  products.length === 1 ? 'min-w-0 flex-1' : 'min-w-[200px] max-w-[230px] shrink-0'
                }`}
              >
                <img
                  src={productImageUrl(product.images[0], 'thumb')}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="size-12 shrink-0 rounded-sm object-cover bg-surface-secondary"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-text">{product.name}</p>
                  <p className="mt-0.5 truncate text-[0.6875rem] font-bold text-text">
                    {formatPrice(product.price)}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-[0.625rem] text-text-secondary">
                    <IconStore className="size-3 shrink-0" />
                    <span className="truncate">{productSeller?.name}</span>
                  </p>
                </div>
                <IconChevronStart className="size-4 shrink-0 text-text-secondary" />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
})

export default ReelSlide
