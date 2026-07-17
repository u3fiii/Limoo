import { Link } from 'react-router-dom'
import Avatar from '../components/Avatar'
import { useChat } from '../context/ChatContext'
import { getSellerById } from '../data/sellers'
import { formatTime, toPersianDigits } from '../utils/format'

export default function ChatList() {
  const { threads } = useChat()

  return (
    <div className="flex h-full min-h-0 flex-col bg-bg pt-[calc(2rem+env(safe-area-inset-top))]">
      <header className="shrink-0 border-b border-border bg-surface px-4 pb-3 pt-1">
        <h1 className="text-xl font-bold text-text">چت‌ها</h1>
        <p className="text-sm text-text-muted">گفتگو با فروشنده‌ها</p>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar pb-28">
        {threads.length === 0 ? (
          <p className="px-6 py-16 text-center text-sm text-text-muted">
            هنوز گفتگویی نداری. از فید یک محصول انتخاب کن.
          </p>
        ) : (
          <ul>
            {threads.map((thread) => {
              const seller = getSellerById(thread.sellerId)
              const last = thread.messages[thread.messages.length - 1]
              return (
                <li key={thread.id} className="border-b border-border">
                  <Link
                    to={`/chats/${thread.id}`}
                    className="flex items-center gap-3 px-4 py-3.5 transition active:bg-surface-secondary"
                  >
                    <Avatar src={seller.avatar} alt={seller.name} size="lg" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate font-semibold text-text">{seller.name}</p>
                        {last && (
                          <span className="shrink-0 text-xs text-text-muted">
                            {formatTime(last.timestamp)}
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 flex items-center justify-between gap-2">
                        <p className="truncate text-sm text-text-secondary">
                          {thread.lastPreview || 'شروع گفتگو'}
                        </p>
                        {thread.unread > 0 && (
                          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[0.6875rem] font-bold text-primary-foreground">
                            {toPersianDigits(thread.unread)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
