import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Avatar from '../components/Avatar'
import { IconBack } from '../components/Icons'
import { getProductById } from '../data/products'
import { getSellerById } from '../data/sellers'
import { formatPrice, toPersianDigits } from '../utils/format'
import { useChat } from '../context/ChatContext'

export default function ProductDetail() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { openThreadForSeller } = useChat()
  const product = getProductById(productId)
  const seller = product ? getSellerById(product.sellerId) : null
  const scrollerRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

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
    // RTL: scrollLeft can be negative in some browsers
    const normalized = Math.abs(index)
    setActiveIndex(Math.min(normalized, product.images.length - 1))
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
            {product.images.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={`${product.name} — ${toPersianDigits(i + 1)}`}
                className="snap-center h-[420px] w-full shrink-0 object-cover"
              />
            ))}
          </div>
          {product.images.length > 1 && (
            <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
              {product.images.map((_, i) => (
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

          <div className="flex items-center gap-3 rounded-card border border-border bg-surface-secondary/60 p-3">
            <Avatar src={seller.avatar} alt={seller.name} size="md" />
            <div className="min-w-0">
              <p className="truncate font-semibold text-text">{seller.name}</p>
              <p className="truncate text-sm text-text-muted">@{seller.handle}</p>
            </div>
          </div>

          <div>
            <h2 className="mb-1.5 text-sm font-semibold text-text">توضیحات</h2>
            <p className="text-sm leading-7 text-text-secondary">{product.description}</p>
          </div>
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
