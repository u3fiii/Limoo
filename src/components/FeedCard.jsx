import { Link } from 'react-router-dom'
import { getProductById } from '../data/products'
import { getSellerById } from '../data/sellers'
import { formatPrice } from '../utils/format'
import Avatar from './Avatar'
import { IconPlay } from './Icons'

export default function FeedCard({ item }) {
  const product = getProductById(item.productId)
  const seller = getSellerById(product.sellerId)
  const isReel = item.type === 'reel'

  return (
    <Link
      to={`/product/${product.id}`}
      className="relative block overflow-hidden rounded-card bg-surface shadow-sm transition active:scale-[0.99]"
    >
      <div className={`relative ${isReel ? 'aspect-[9/14]' : 'aspect-[4/5]'}`}>
        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="size-full object-cover"
          loading="lazy"
        />

        {isReel && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-overlay">
            <IconPlay className="size-14" />
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent p-3.5 pt-16 text-text-inverse">
          <div className="mb-2 flex items-center gap-2">
            <Avatar src={seller.avatar} alt={seller.name} size="sm" className="ring-2 ring-white/30" />
            <span className="text-sm font-medium">{seller.name}</span>
          </div>
          <p className="text-base font-semibold leading-snug">{product.name}</p>
          <p className="mt-1 text-sm text-primary-soft">{formatPrice(product.price)}</p>
        </div>
      </div>
    </Link>
  )
}
