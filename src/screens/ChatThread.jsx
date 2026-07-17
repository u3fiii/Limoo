import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Avatar from '../components/Avatar'
import MessageBubble from '../components/MessageBubble'
import PinnedBar from '../components/PinnedBar'
import ProductCard from '../components/ProductCard'
import QuickReplyChip from '../components/QuickReplyChip'
import { IconAttach, IconBack, IconMore, IconSend } from '../components/Icons'
import { quickReplies } from '../data/chats'
import { getProductById } from '../data/products'
import { getSellerById } from '../data/sellers'
import { useChat } from '../context/ChatContext'

export default function ChatThread() {
  const { threadId } = useParams()
  const navigate = useNavigate()
  const { getThreadById, sendText, sendProduct, peekPendingStage, clearPendingStage } = useChat()
  const thread = getThreadById(threadId)
  const seller = thread ? getSellerById(thread.sellerId) : null

  const [text, setText] = useState('')
  const [stageDismissed, setStageDismissed] = useState(false)
  const [stagedNote, setStagedNote] = useState('')
  const listRef = useRef(null)

  const pendingId = peekPendingStage(threadId)
  const stagedProductId = stageDismissed ? null : pendingId
  const stagedProduct = stagedProductId ? getProductById(stagedProductId) : null
  const messages = thread?.messages ?? []
  const showQuickReplies = messages.length === 0

  const basketTotal = (thread?.basket ?? []).reduce((sum, item) => sum + item.price * item.qty, 0)
  const basketCount = (thread?.basket ?? []).reduce((sum, item) => sum + item.qty, 0)

  useEffect(() => {
    setStageDismissed(false)
    setStagedNote('')
  }, [threadId])

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages.length, stagedProductId])

  if (!thread || !seller) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-bg p-6">
        <p className="text-text-secondary">گفتگو پیدا نشد</p>
        <button
          type="button"
          onClick={() => navigate('/chats')}
          className="rounded-pill bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          لیست چت‌ها
        </button>
      </div>
    )
  }

  const handleSendText = (content) => {
    const value = (content ?? text).trim()
    if (!value) return
    sendText(thread.id, value)
    setText('')
  }

  const handleSendProduct = () => {
    if (!stagedProduct) return
    sendProduct(thread.id, stagedProduct.id, stagedNote)
    clearPendingStage(thread.id)
    setStageDismissed(true)
    setStagedNote('')
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-bg pt-[calc(2rem+env(safe-area-inset-top))]">
      <header className="flex shrink-0 items-center gap-2 border-b border-border bg-surface px-2 py-2">
        <button
          type="button"
          onClick={() => navigate('/chats')}
          className="flex size-11 items-center justify-center rounded-full text-text transition active:bg-surface-secondary"
          aria-label="بازگشت"
        >
          <IconBack className="size-5" />
        </button>
        <Avatar src={seller.avatar} alt={seller.name} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-text">{seller.name}</p>
          <p className="truncate text-xs text-text-muted">معمولاً سریع جواب می‌دهد</p>
        </div>
        <button
          type="button"
          className="flex size-11 items-center justify-center rounded-full text-text-secondary transition active:bg-surface-secondary"
          aria-label="منو"
        >
          <IconMore className="size-5" />
        </button>
      </header>

      <PinnedBar itemCount={basketCount} total={basketTotal} />

      <div ref={listRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto no-scrollbar py-3">
        {messages.length === 0 && !stagedProduct && (
          <div className="px-6 py-10 text-center">
            <p className="text-sm text-text-muted">
              هنوز پیامی نیست. یک سوال بپرس یا از صفحه محصول، کارت کالا بفرست.
            </p>
          </div>
        )}
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>

      {showQuickReplies && (
        <div className="flex shrink-0 gap-2 overflow-x-auto no-scrollbar px-3 pb-2">
          {quickReplies.map((label) => (
            <QuickReplyChip key={label} label={label} onClick={() => handleSendText(label)} />
          ))}
        </div>
      )}

      {stagedProduct && (
        <div className="shrink-0 border-t border-accent-staged/30 bg-accent-staged-soft/40 px-3 py-2.5">
          <ProductCard
            product={stagedProduct}
            state="staged"
            note={stagedNote}
            onNoteChange={setStagedNote}
            onSend={handleSendProduct}
            onDismiss={() => {
              clearPendingStage(thread.id)
              setStageDismissed(true)
              setStagedNote('')
            }}
          />
        </div>
      )}

      <div className="shrink-0 border-t border-border bg-surface px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
        <div className="flex items-end gap-2">
          <button
            type="button"
            className="mb-0.5 flex size-11 shrink-0 items-center justify-center rounded-full text-text-secondary transition active:bg-surface-secondary"
            aria-label="پیوست"
          >
            <IconAttach className="size-5" />
          </button>
          <div className="flex min-h-11 flex-1 items-center rounded-pill border-2 border-border bg-surface-secondary px-1 focus-within:border-cta">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendText()
              }}
              placeholder="پیام بنویس…"
              className="limoo-input-plain min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-text outline-none placeholder:text-text-muted"
            />
            <button
              type="button"
              onClick={() => handleSendText()}
              disabled={!text.trim()}
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition enabled:active:bg-primary-hover disabled:opacity-40"
              aria-label="ارسال"
            >
              <IconSend className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
