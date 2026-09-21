import { useMemo, useState } from 'react'
import { IconEye, IconSearch } from '../components/Icons'
import { explorePosts, filterExplorePosts } from '../data/explore'
import { formatCompactCount } from '../utils/format'

function ExploreTile({ post }) {
  return (
    <button
      type="button"
      className="relative aspect-[3/4] w-full overflow-hidden bg-surface-secondary"
    >
      <img
        src={post.image}
        alt=""
        className="absolute inset-0 size-full object-cover"
        loading="lazy"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent px-2 pb-2 pt-6">
        <span className="flex items-center gap-1 text-[0.6875rem] font-medium text-text-inverse drop-shadow">
          <IconEye className="size-3.5 shrink-0" />
          {formatCompactCount(post.views)}
        </span>
      </div>
    </button>
  )
}

export default function ExploreSearch() {
  const [query, setQuery] = useState('')

  const posts = useMemo(() => filterExplorePosts(query), [query])

  return (
    <div className="flex h-full min-h-0 flex-col bg-surface pt-[calc(0.75rem+env(safe-area-inset-top))]">
      <header className="shrink-0 px-4 pb-3 pt-1">
        <label className="relative flex items-center">
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
        {posts.length === 0 ? (
          <p className="px-6 py-16 text-center text-sm text-text-muted">
            نتیجه‌ای پیدا نشد.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-0">
            {posts.map((post) => (
              <ExploreTile key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
