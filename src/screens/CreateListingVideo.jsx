import { useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { IconBack, IconChevronStart, IconClose, IconUpload, IconVideoAdd } from '../components/Icons'
import { useListingDraft } from '../context/ListingDraftContext'

function uid() {
  return `video-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export default function CreateListingVideo() {
  const navigate = useNavigate()
  const location = useLocation()
  const returnTo = location.state?.from ?? '/profile'
  const { draft, updateDraft, resetDraft } = useListingDraft()
  const videoInputRef = useRef(null)

  const addVideos = (files) => {
    const next = Array.from(files).map((file) => ({
      id: uid(),
      url: URL.createObjectURL(file),
      name: file.name,
    }))
    updateDraft({ videos: [...draft.videos, ...next] })
  }

  const removeVideo = (videoId) => {
    const target = draft.videos.find((video) => video.id === videoId)
    if (target?.url?.startsWith('blob:')) URL.revokeObjectURL(target.url)
    updateDraft({ videos: draft.videos.filter((video) => video.id !== videoId) })
  }

  const finishListing = () => {
    resetDraft()
    navigate(returnTo, { replace: true })
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-surface pt-[calc(2rem+env(safe-area-inset-top))]">
      <header className="flex shrink-0 items-center gap-2 px-2 pb-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex size-11 items-center justify-center rounded-full text-text transition active:bg-surface-secondary"
          aria-label="بازگشت"
        >
          <IconBack className="size-5" />
        </button>
        <h1 className="min-w-0 flex-1 truncate text-base font-bold text-text">افزودن ویدئو</h1>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar px-4 pb-36">
        <section className="rounded-card border border-border p-4">
          <div className="flex items-center gap-2">
            <IconUpload className="size-5 text-text" />
            <h2 className="text-sm font-bold text-text">افزودن ویدئو</h2>
          </div>
          <p className="mt-2 text-xs leading-5 text-text-muted">
            برای کالای خود یک یا چند ویدئو (Reels) اضافه کن.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {draft.videos.map((video) => (
              <div
                key={video.id}
                className="relative flex size-24 shrink-0 flex-col items-center justify-center gap-1 rounded-md border border-border bg-surface-secondary"
              >
                <IconVideoAdd className="size-7 text-text-secondary" />
                <span className="max-w-[5.5rem] truncate px-1 text-[0.625rem] text-text-muted">
                  {video.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeVideo(video.id)}
                  className="absolute end-1 top-1 flex size-6 items-center justify-center rounded-full bg-overlay text-text-inverse"
                  aria-label="حذف ویدئو"
                >
                  <IconClose className="size-3.5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              className="flex size-24 shrink-0 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border bg-surface-secondary text-text-muted transition active:bg-input"
            >
              <IconVideoAdd className="size-7" />
              <span className="text-[0.6875rem] font-medium">ویدئو</span>
            </button>
          </div>
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            multiple
            className="hidden"
            onChange={(event) => {
              if (event.target.files?.length) addVideos(event.target.files)
              event.target.value = ''
            }}
          />
        </section>

        <button
          type="button"
          className="mt-4 flex w-full items-center gap-3 rounded-card border border-border px-4 py-4 text-start transition active:bg-surface-secondary"
        >
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-text">برای ساخت ویدئوی مناسب نیاز به کمک داری؟</p>
            <p className="mt-1 text-xs leading-5 text-text-muted">
              ما می‌تونیم افراد متخصصی بهت معرفی کنیم که کمک کنن ویدئوها جذاب داشته باشی و به
              فروشت کمک کنن.
            </p>
          </div>
          <IconChevronStart className="size-5 shrink-0 text-text-muted" />
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 border-t border-border bg-surface px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={finishListing}
          className="flex min-h-14 w-full items-center justify-center rounded-btn bg-cta text-base font-bold text-cta-foreground transition active:opacity-90"
        >
          ثبت آگهی
        </button>
        <button
          type="button"
          onClick={finishListing}
          className="mt-3 flex w-full items-center justify-center py-2 text-sm font-medium text-text-muted transition active:text-text-secondary"
        >
          ثبت آگهی بدون ویدئو
        </button>
      </div>
    </div>
  )
}
