import { useMemo, useState } from 'react'
import Avatar from '../components/Avatar'
import { IconCheck, IconClose } from '../components/Icons'
import { activityFilters, getActivitiesByFilter } from '../data/notifications'
import { toPersianDigits } from '../utils/format'

function ActorStack({ actors }) {
  if (actors.length === 0) return null

  if (actors.length === 1) {
    return <Avatar src={actors[0].avatar} alt={actors[0].name} size="md" />
  }

  return (
    <div className="relative size-10 shrink-0">
      <img
        src={actors[0].avatar}
        alt={actors[0].name}
        className="absolute end-0 top-0 size-7 rounded-full object-cover ring-2 ring-surface"
      />
      <img
        src={actors[1].avatar}
        alt={actors[1].name}
        className="absolute start-0 bottom-0 size-7 rounded-full object-cover ring-2 ring-surface"
      />
    </div>
  )
}

function ActivityText({ item }) {
  if (item.type === 'like_multi') {
    const [first, second] = item.actors
    return (
      <p className="text-sm leading-6 text-text">
        <span className="font-bold">{first.name}</span>
        ،{' '}
        <span className="font-bold">{second.name}</span>
        {' '}و {toPersianDigits(item.othersCount)} نفر دیگر {item.body}
      </p>
    )
  }

  return (
    <p className="text-sm leading-6 text-text">
      <span className="font-bold">{item.actors[0].name}</span>
      {' '}
      {item.body}
    </p>
  )
}

function ActivityActions({ item, onAccept, onDecline, onFollow, following, decided }) {
  if (item.type === 'follow_request') {
    if (decided) {
      return (
        <span className="shrink-0 text-xs text-text-muted">
          {decided === 'accepted' ? 'پذیرفته شد' : 'رد شد'}
        </span>
      )
    }

    return (
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onAccept}
          className="flex size-9 items-center justify-center rounded-full bg-accent-confirmed-soft text-accent-confirmed transition active:scale-95"
          aria-label="قبول"
        >
          <IconCheck className="size-4" />
        </button>
        <button
          type="button"
          onClick={onDecline}
          className="flex size-9 items-center justify-center rounded-full bg-like/15 text-like transition active:scale-95"
          aria-label="رد"
        >
          <IconClose className="size-4" />
        </button>
      </div>
    )
  }

  if (item.type === 'follow') {
    return (
      <button
        type="button"
        onClick={onFollow}
        className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-semibold transition active:scale-95 ${
          following
            ? 'bg-surface-secondary text-text-secondary'
            : 'bg-surface-secondary text-text'
        }`}
      >
        {following ? 'دنبال می‌کنی' : 'دنبال کردن'}
      </button>
    )
  }

  return null
}

export default function Notifications() {
  const [filter, setFilter] = useState('all')
  const [followingIds, setFollowingIds] = useState(() => new Set())
  const [requestDecisions, setRequestDecisions] = useState(() => ({}))

  const items = useMemo(() => getActivitiesByFilter(filter), [filter])

  return (
    <div className="flex h-full min-h-0 flex-col bg-surface pt-[calc(0.75rem+env(safe-area-inset-top))]">
      <header className="shrink-0 pb-3 pt-1">
        <h1 className="px-4 text-xl font-bold text-text">فعالیت‌ها</h1>

        <div className="mt-3 overflow-x-auto no-scrollbar">
          <div className="flex w-max min-w-full gap-2 px-4">
            {activityFilters.map((tab) => {
              const active = filter === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  className={`shrink-0 rounded-pill px-3.5 py-1.5 text-sm font-medium transition ${
                    active
                      ? 'bg-cta text-cta-foreground'
                      : 'border border-border bg-surface text-text'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar pb-28">
        {items.length === 0 ? (
          <p className="px-6 py-16 text-center text-sm text-text-muted">
            فعالیتی در این بخش نیست.
          </p>
        ) : (
          <ul>
            {items.map((item) => (
              <li key={item.id} className="border-b border-border/70">
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <ActorStack actors={item.actors} />

                  <div className="min-w-0 flex-1">
                    <ActivityText item={item} />
                    <p className="mt-0.5 text-xs text-text-muted">{item.timeAgo}</p>
                  </div>

                  <ActivityActions
                    item={item}
                    decided={requestDecisions[item.id]}
                    following={followingIds.has(item.id)}
                    onAccept={() =>
                      setRequestDecisions((prev) => ({ ...prev, [item.id]: 'accepted' }))
                    }
                    onDecline={() =>
                      setRequestDecisions((prev) => ({ ...prev, [item.id]: 'declined' }))
                    }
                    onFollow={() =>
                      setFollowingIds((prev) => {
                        const next = new Set(prev)
                        if (next.has(item.id)) next.delete(item.id)
                        else next.add(item.id)
                        return next
                      })
                    }
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
