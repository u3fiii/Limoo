import { formatTime } from '../utils/format'
import { getProductById } from '../data/products'
import ProductCard from './ProductCard'

/**
 * Renders a single chat message.
 * Extensible via `message.type` — add cases for proposal / order later.
 */
export default function MessageBubble({ message }) {
  if (message.type === 'system') {
    return (
      <div className="flex justify-center px-4 py-1">
        <span className="rounded-pill bg-system px-3 py-1 text-xs text-text-secondary">
          {message.content}
        </span>
      </div>
    )
  }

  if (message.type === 'product') {
    const product = getProductById(message.productId)
    if (!product) return null
    return (
      <div className={`flex px-3 ${message.sender === 'buyer' ? 'justify-start' : 'justify-end'}`}>
        <div className="w-[78%] max-w-[280px]">
          <ProductCard
            product={product}
            state={message.productState ?? 'staged'}
            note={message.note}
          />
          <p
            className={`mt-1 px-1 text-[0.6875rem] text-text-muted ${
              message.sender === 'buyer' ? 'text-start' : 'text-end'
            }`}
          >
            {formatTime(message.timestamp)}
          </p>
        </div>
      </div>
    )
  }

  // Default: text (and future types fall back to text until implemented)
  if (message.type === 'text' || !message.type) {
    const isBuyer = message.sender === 'buyer'
    return (
      <div className={`flex px-3 ${isBuyer ? 'justify-start' : 'justify-end'}`}>
        <div className={`max-w-[78%] ${isBuyer ? '' : ''}`}>
          <div
            className={`rounded-bubble px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
              isBuyer
                ? 'rounded-se-sm bg-bubble-buyer text-text'
                : 'rounded-ss-sm bg-bubble-seller text-text ring-1 ring-border'
            }`}
          >
            {message.content}
          </div>
          <p
            className={`mt-1 px-1 text-[0.6875rem] text-text-muted ${
              isBuyer ? 'text-start' : 'text-end'
            }`}
          >
            {formatTime(message.timestamp)}
          </p>
        </div>
      </div>
    )
  }

  // Placeholder for future message types (proposal, order, …)
  return (
    <div className="flex justify-center px-4 py-1">
      <span className="rounded-pill bg-system px-3 py-1 text-xs text-text-muted">
        [{message.type}] — به‌زودی
      </span>
    </div>
  )
}
