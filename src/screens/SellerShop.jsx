import { Link, useNavigate, useParams } from 'react-router-dom'
import Avatar from '../components/Avatar'
import { IconBack } from '../components/Icons'
import { getProductsBySeller, productImageUrl } from '../data/products'
import { getSellerById } from '../data/sellers'
import { formatPrice } from '../utils/format'

export default function SellerShop() {
  const { sellerId } = useParams()
  const navigate = useNavigate()
  const seller = getSellerById(sellerId)
  const sellerProducts = seller ? getProductsBySeller(seller.id) : []

  if (!seller) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-surface p-6">
        <p className="text-text-secondary">فروشگاه پیدا نشد</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-pill bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          بازگشت
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-surface pt-[calc(0.75rem+env(safe-area-inset-top))]">
      <header className="flex shrink-0 items-center gap-2 px-2 pb-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex size-11 items-center justify-center rounded-full text-text transition active:bg-surface-secondary"
          aria-label="بازگشت"
        >
          <IconBack className="size-5" />
        </button>
        <h1 className="min-w-0 flex-1 truncate text-base font-bold text-text">{seller.name}</h1>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar px-4 pb-8">
        <div className="flex items-center gap-3 rounded-card border border-border bg-surface-secondary/60 p-4">
          <Avatar src={seller.avatar} alt={seller.name} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-bold text-text">{seller.name}</p>
            <p className="mt-0.5 truncate text-sm text-text-muted">@{seller.handle}</p>
            {seller.bio ? (
              <p className="mt-2 text-sm leading-6 text-text-secondary">{seller.bio}</p>
            ) : null}
          </div>
        </div>

        <h2 className="mb-3 mt-6 text-sm font-semibold text-text">محصولات</h2>
        <div className="grid grid-cols-2 gap-3">
          {sellerProducts.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="overflow-hidden rounded-card border border-border bg-surface transition active:scale-[0.98]"
            >
              <img
                src={productImageUrl(product.images[0], 'thumb')}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="aspect-[4/5] w-full object-cover bg-surface-secondary"
                loading="lazy"
              />
              <div className="space-y-1 p-2.5">
                <p className="line-clamp-2 text-sm font-semibold leading-snug text-text">
                  {product.name}
                </p>
                <p className="text-xs font-medium text-text-secondary">
                  {formatPrice(product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
