import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../components/Avatar'
import { IconSearch } from '../components/Icons'
import { useChat } from '../context/ChatContext'
import { filterChatThreads, getThreadContact } from '../data/chats'
import { formatTime, toPersianDigits } from '../utils/format'

function ChatRow({ thread }) {
  const contact = getThreadContact(thread)
  const last = thread.messages[thread.messages.length - 1]
  const timeLabel = last ? formatTime(last.timestamp) : ''

  return (
    <li>
      <Link
        to={`/chats/${thread.id}`}
        className="flex items-center gap-3 px-4 py-3.5 transition active:bg-surface-secondary"
      >
        <div className="relative shrink-0">
          <Avatar src={contact.avatar} alt={contact.name} size="lg" />
          {contact.online ? (
            <span
              className="absolute bottom-0 end-0 size-3 rounded-full border-2 border-surface bg-primary"
              aria-hidden
            />
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold text-text">{contact.name}</p>
          <p className="mt-0.5 truncate text-sm text-text-muted">
            {thread.lastPreview || 'شروع گفتگو'}
          </p>
        </div>

        <div className="flex w-10 shrink-0 flex-col items-center gap-1.5">
          {timeLabel ? (
            <span className="text-xs text-text-muted">{timeLabel}</span>
          ) : (
            <span className="h-4" aria-hidden />
          )}
          {thread.unread > 0 ? (
            <span className="flex size-5 items-center justify-center rounded-full bg-[#0A84FF] text-[0.6875rem] font-bold text-text-inverse">
              {toPersianDigits(thread.unread)}
            </span>
          ) : (
            <span className="size-5" aria-hidden />
          )}
        </div>
      </Link>
    </li>
  )
}

export default function ChatList() {
  const { threads } = useChat()
  const [query, setQuery] = useState('')

  const visibleThreads = useMemo(
    () => filterChatThreads(threads, query),
    [threads, query],
  )

  return (
    <div className="flex h-full min-h-0 flex-col bg-surface pt-[calc(2rem+env(safe-area-inset-top))]">
      <header className="shrink-0 px-4 pb-3 pt-1">
        <h1 className="text-xl font-bold text-text">پیام‌ها</h1>

        <label className="relative mt-3 flex items-center">
          <span className="pointer-events-none absolute start-4 text-text-muted">
            <IconSearch className="size-5" />
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو"
            className="min-h-12 w-full rounded-sm bg-input pe-4 ps-12 text-base text-text outline-none placeholder:text-text-muted"
          />
        </label>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar pb-28">
        {visibleThreads.length === 0 ? (
          <p className="px-6 py-16 text-center text-sm text-text-muted">
            {query.trim() ? 'نتیجه‌ای پیدا نشد.' : 'هنوز گفتگویی نداری. از فید یک محصول انتخاب کن.'}
          </p>
        ) : (
          <ul>
            {visibleThreads.map((thread) => (
              <ChatRow key={thread.id} thread={thread} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
