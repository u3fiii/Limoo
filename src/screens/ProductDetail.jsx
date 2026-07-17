import { useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Avatar from '../components/Avatar'
import { IconBack, IconChevronStart, IconEye } from '../components/Icons'
import { useChat } from '../context/ChatContext'
import { getClipsForProduct, getClipsForSeller } from '../data/feed'
import { getProductById, getProductImages } from '../data/products'
import { getSellerById } from '../data/sellers'
import { formatCompactCount, formatPrice, toPersianDigits } from '../utils/format'
import { posterForVideo } from '../utils/video'

function VideoThumb({ clip }) {
  return (
    <button
      type="button"
      className="relative aspect-[3/4] w-[7.25rem] shrink-0 overflow-hidden rounded-card bg-surface-secondary"
    >
      <img
        src={clip.poster ?? posterForVideo(clip.videoUrl)}
        alt=""
        referrerPolicy="no-referrer"
        className="absolute inset-0 size-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/15">
        <span className="flex size-10 items-center justify-center rounded-full bg-surface/95 shadow-sm">
          <svg className="ms-0.5 size-4 text-text" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <path d="M4 2.5v11l9-5.5-9-5.5Z" />
          </svg>
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-2 pb-2 pt-5">
        <span className="flex items-center justify-end gap-1 text-[0.6875rem] font-medium text-text-inverse">
          {formatCompactCount(clip.likes)} بازدید
          <IconEye className="size-3.5 shrink-0" />
        </span>
      </div>
    </button>
  )
}

export default function ProductDetail() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { openThreadForSeller } = useChat()
  const product = getProductById(productId)
  const seller = product ? getSellerById(product.sellerId) : null
  const scrollerRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const images = useMemo(
    () => (product ? getProductImages(product) : []),
    [product],
  )

  const videos = useMemo(() => {
    if (!product || !seller) return []
    const forProduct = getClipsForProduct(product.id)
    if (forProduct.length > 0) return forProduct
    return getClipsForSeller(seller.id, 6)
  }, [product, seller])

  if (!product || !seller) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-bg p-6">
        <p className="text-text-secondary">محصول پیدا نشد</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="rounded-pill bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          بازگشت به فید
        </button>
      </div>
    )
  }

  const onScroll = () => {
    const el = scrollerRef.current
    if (!el) return
    const index = Math.round(el.scrollLeft / el.clientWidth)
    const normalized = Math.abs(index)
    setActiveIndex(Math.min(normalized, images.length - 1))
  }

  const startChat = () => {
    const threadId = openThreadForSeller(seller.id, product.id)
    navigate(`/chats/${threadId}`)
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-surface">
      <header className="absolute inset-x-0 top-[calc(2rem+env(safe-area-inset-top))] z-20 flex items-center justify-between px-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex size-11 items-center justify-center rounded-full bg-surface/90 text-text shadow-sm backdrop-blur"
          aria-label="بازگشت"
        >
          <IconBack className="size-5" />
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar pb-28">
        <div className="relative">
          <div
            ref={scrollerRef}
            onScroll={onScroll}
            className="flex snap-x-mandatory overflow-x-auto no-scrollbar"
          >
            {images.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={`${product.name} — ${toPersianDigits(i + 1)}`}
                referrerPolicy="no-referrer"
                className="snap-center h-[420px] w-full shrink-0 object-cover bg-surface-secondary"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            ))}
          </div>
          {images.length > 1 && (
            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-pill transition-all ${
                    i === activeIndex ? 'w-5 bg-primary' : 'w-1.5 bg-text-inverse/70'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4 px-4 py-4">
          <div>
            <h1 className="text-xl font-bold text-text">{product.name}</h1>
            <p className="mt-1 text-lg font-semibold text-primary-foreground">
              {formatPrice(product.price)}
            </p>
          </div>

          <Link
            to={`/shop/${seller.id}`}
            className="flex items-center gap-3 rounded-card border border-border bg-surface-secondary/60 p-3 transition active:bg-surface-secondary"
          >
            <Avatar src={seller.avatar} alt={seller.name} size="md" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-text">{seller.name}</p>
              <p className="truncate text-sm text-text-muted">@{seller.handle}</p>
            </div>
            <IconChevronStart className="size-5 shrink-0 text-text-muted" aria-hidden />
          </Link>

          <div>
            <h2 className="mb-1.5 text-sm font-semibold text-text">توضیحات</h2>
            <p className="text-sm leading-7 text-text-secondary">{product.description}</p>
          </div>

          {videos.length > 0 ? (
            <div>
              <h2 className="mb-3 text-sm font-semibold text-text">ویدیوها</h2>
              <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
                {videos.map((clip) => (
                  <VideoThumb key={clip.id} clip={clip} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 border-t border-border bg-surface/95 px-4 pb-4 pt-3 backdrop-blur">
        <button
          type="button"
          onClick={startChat}
          className="flex min-h-12 w-full items-center justify-center rounded-pill bg-primary px-4 text-base font-bold text-primary-foreground shadow-md transition active:bg-primary-hover"
        >
          چت برای خرید · {formatPrice(product.price)}
        </button>
      </div>
    </div>
  )
}
