import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import ReelSlide from '../components/ReelSlide'
import { reels } from '../data/feed'

const SNAP_MS = 160
const SWIPE_THRESHOLD = 48
const WHEEL_COOLDOWN_MS = 180
const AXIS_LOCK_PX = 10

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3
}

/**
 * Infinite reel loop:
 * [lastClone, ...reels, firstClone]
 * Vertical swipe → next/prev reel (category)
 * Horizontal swipe → next/prev related clip within the active reel
 */
export default function ExploreFeed() {
  const scrollerRef = useRef(null)
  const slideRefs = useRef({})
  const indexRef = useRef(1)
  const animatingRef = useRef(false)
  const jumpingRef = useRef(false)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const touchStartScroll = useRef(0)
  const clipTouchStartScroll = useRef(0)
  const touchSkipRef = useRef(false)
  const gestureAxisRef = useRef(null)
  const [muted, setMuted] = useState(true)

  const slides = useMemo(() => {
    if (reels.length === 0) return []
    const last = reels[reels.length - 1]
    const first = reels[0]
    return [
      { ...last, slideKey: `clone-start-${last.id}`, logicalIndex: reels.length - 1 },
      ...reels.map((reel, i) => ({
        ...reel,
        slideKey: `real-${reel.id}`,
        logicalIndex: i,
      })),
      { ...first, slideKey: `clone-end-${first.id}`, logicalIndex: 0 },
    ]
  }, [])

  const getActiveSlideRef = useCallback(() => {
    const slide = slides[indexRef.current]
    if (!slide) return null
    return slideRefs.current[slide.slideKey] ?? null
  }, [slides])

  const resolveClones = useCallback(
    (index) => {
      if (index <= 0) return reels.length
      if (index >= slides.length - 1) return 1
      return index
    },
    [slides.length],
  )

  const jumpToIndex = useCallback(
    (index) => {
      const el = scrollerRef.current
      if (!el) return
      const height = el.clientHeight
      if (!height) return
      jumpingRef.current = true
      animatingRef.current = false
      el.scrollTop = index * height
      indexRef.current = index
      window.setTimeout(() => {
        jumpingRef.current = false
      }, 40)
    },
    [slides],
  )

  const animateToIndex = useCallback(
    (rawIndex) => {
      const el = scrollerRef.current
      if (!el || animatingRef.current || jumpingRef.current) return

      const height = el.clientHeight
      if (!height) return

      let index = Math.max(0, Math.min(slides.length - 1, rawIndex))
      if (index === indexRef.current && Math.abs(el.scrollTop - index * height) < 2) return

      const start = el.scrollTop
      const target = index * height
      const dist = target - start
      if (Math.abs(dist) < 1) {
        indexRef.current = index
        return
      }

      animatingRef.current = true
      indexRef.current = index

      const t0 = performance.now()

      const frame = (now) => {
        const t = Math.min(1, (now - t0) / SNAP_MS)
        el.scrollTop = start + dist * easeOutCubic(t)
        if (t < 1) {
          requestAnimationFrame(frame)
          return
        }

        el.scrollTop = target
        animatingRef.current = false

        const resolved = resolveClones(index)
        if (resolved !== index) {
          jumpToIndex(resolved)
        }
      }

      requestAnimationFrame(frame)
    },
    [jumpToIndex, resolveClones, slides],
  )

  useLayoutEffect(() => {
    jumpToIndex(1)
    const id = window.setTimeout(() => jumpToIndex(1), 80)
    return () => window.clearTimeout(id)
  }, [jumpToIndex])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return undefined

    let wheelLockUntil = 0

    const onWheel = (e) => {
      e.preventDefault()
      if (animatingRef.current || jumpingRef.current) return
      const now = performance.now()
      if (now < wheelLockUntil) return

      const slideRef = getActiveSlideRef()
      const clipState = slideRef?.getClipState?.()

      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) >= 8) {
        if (e.deltaX > 0) {
          if (clipState && !clipState.atEnd && slideRef.scrollClipBy(1)) {
            wheelLockUntil = now + WHEEL_COOLDOWN_MS
          }
        } else if (clipState && !clipState.atStart && slideRef.scrollClipBy(-1)) {
          wheelLockUntil = now + WHEEL_COOLDOWN_MS
        }
        return
      }

      if (Math.abs(e.deltaY) < 8) return

      wheelLockUntil = now + WHEEL_COOLDOWN_MS
      if (e.deltaY > 0) {
        animateToIndex(indexRef.current + 1)
      } else {
        animateToIndex(indexRef.current - 1)
      }
    }

    const onTouchStart = (e) => {
      if (animatingRef.current) return
      touchSkipRef.current = Boolean(e.target.closest('[data-reel-pan]'))
      touchStartX.current = e.touches[0].clientX
      touchStartY.current = e.touches[0].clientY
      touchStartScroll.current = el.scrollTop
      gestureAxisRef.current = null

      const slideRef = getActiveSlideRef()
      clipTouchStartScroll.current = slideRef?.getClipScrollLeft?.() ?? 0
    }

    const onTouchMove = (e) => {
      if (touchSkipRef.current) return

      const dx = e.touches[0].clientX - touchStartX.current
      const dy = e.touches[0].clientY - touchStartY.current

      if (!gestureAxisRef.current && (Math.abs(dx) > AXIS_LOCK_PX || Math.abs(dy) > AXIS_LOCK_PX)) {
        gestureAxisRef.current = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
      }

      const slideRef = getActiveSlideRef()
      const clipState = slideRef?.getClipState?.()

      if (
        gestureAxisRef.current === 'x'
        && slideRef?.hasMultipleClips?.()
        && clipState
      ) {
        if (dx < 0 && !clipState.atEnd) {
          e.preventDefault()
          slideRef.setClipScroll(clipTouchStartScroll.current - dx)
          return
        }
        if (dx > 0 && !clipState.atStart) {
          e.preventDefault()
          slideRef.setClipScroll(clipTouchStartScroll.current - dx)
          return
        }
      }

      if (gestureAxisRef.current !== 'y') return

      if (animatingRef.current || jumpingRef.current) {
        e.preventDefault()
        return
      }
      if (Math.abs(dy) > 6) e.preventDefault()
      el.scrollTop = touchStartScroll.current - dy
    }

    const onTouchEnd = (e) => {
      if (touchSkipRef.current || animatingRef.current || jumpingRef.current) return

      const endX = e.changedTouches[0]?.clientX ?? touchStartX.current
      const endY = e.changedTouches[0]?.clientY ?? touchStartY.current
      const dx = endX - touchStartX.current
      const dy = endY - touchStartY.current
      const slideRef = getActiveSlideRef()
      const clipState = slideRef?.getClipState?.()

      if (gestureAxisRef.current === 'x' && slideRef && clipState) {
        if (dx <= -SWIPE_THRESHOLD) {
          if (!clipState.atEnd) slideRef.scrollClipBy(1)
          else slideRef.snapClipNearest?.()
          return
        }
        if (dx >= SWIPE_THRESHOLD) {
          if (!clipState.atStart) slideRef.scrollClipBy(-1)
          else slideRef.snapClipNearest?.()
          return
        }
        slideRef.snapClipNearest?.()
        return
      }

      if (dy <= -SWIPE_THRESHOLD) {
        animateToIndex(indexRef.current + 1)
      } else if (dy >= SWIPE_THRESHOLD) {
        animateToIndex(indexRef.current - 1)
      } else {
        animateToIndex(indexRef.current)
      }
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [animateToIndex, getActiveSlideRef])

  return (
    <div className="h-full min-h-0 bg-reel-bg">
      <div
        ref={scrollerRef}
        className="h-full overflow-y-auto overscroll-y-none no-scrollbar"
      >
        {slides.map((reel) => (
          <div
            key={reel.slideKey}
            className="box-border h-full min-h-full w-full shrink-0"
          >
            <ReelSlide
              ref={(node) => {
                if (node) slideRefs.current[reel.slideKey] = node
                else delete slideRefs.current[reel.slideKey]
              }}
              reel={reel}
              scrollRoot={scrollerRef}
              globalMuted={muted}
              onToggleMute={() => setMuted((m) => !m)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
