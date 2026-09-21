import { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AiDescriptionSheet from '../components/AiDescriptionSheet'
import { IconBack, IconClose, IconPhotoAdd, IconSparkle } from '../components/Icons'
import { useListingDraft } from '../context/ListingDraftContext'

function uid() {
  return `photo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export default function CreateListingDetails() {
  const navigate = useNavigate()
  const location = useLocation()
  const returnTo = location.state?.from ?? '/'
  const { draft, updateDraft } = useListingDraft()
  const photoInputRef = useRef(null)
  const [aiOpen, setAiOpen] = useState(false)

  const addPhotos = (files) => {
    const next = Array.from(files).map((file) => ({
      id: uid(),
      url: URL.createObjectURL(file),
      name: file.name,
    }))
    updateDraft({ photos: [...draft.photos, ...next] })
  }

  const removePhoto = (photoId) => {
    const target = draft.photos.find((photo) => photo.id === photoId)
    if (target?.url?.startsWith('blob:')) URL.revokeObjectURL(target.url)
    updateDraft({ photos: draft.photos.filter((photo) => photo.id !== photoId) })
  }

  const canContinue = draft.title.trim().length > 0

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-surface pt-[calc(0.75rem+env(safe-area-inset-top))]">
      <header className="flex shrink-0 items-center gap-2 px-2 pb-3">
        <button
          type="button"
          onClick={() => navigate(returnTo, { replace: true })}
          className="flex size-11 items-center justify-center rounded-full text-text transition active:bg-surface-secondary"
          aria-label="بازگشت"
        >
          <IconBack className="size-5" />
        </button>
        <h1 className="min-w-0 flex-1 truncate text-base font-bold text-text">اضافه کردن کالا</h1>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar px-4 pb-28">
        <section className="mb-6">
          <h2 className="text-sm font-bold text-text">عکس‌های کالا رو انتخاب کن</h2>
          <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {draft.photos.map((photo) => (
              <div key={photo.id} className="relative size-24 shrink-0 overflow-hidden rounded-md">
                <img
                  src={photo.url}
                  alt=""
                  className="size-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(photo.id)}
                  className="absolute end-1 top-1 flex size-6 items-center justify-center rounded-full bg-overlay text-text-inverse"
                  aria-label="حذف عکس"
                >
                  <IconClose className="size-3.5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="flex size-24 shrink-0 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border bg-surface-secondary text-text-muted transition active:bg-input"
            >
              <IconPhotoAdd className="size-7" />
              <span className="text-[0.6875rem] font-medium">عکس کالا</span>
            </button>
          </div>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(event) => {
              if (event.target.files?.length) addPhotos(event.target.files)
              event.target.value = ''
            }}
          />
        </section>

        <section className="mb-6">
          <h2 className="text-sm font-bold text-text">عنوان آگهی</h2>
          <p className="mt-1 text-xs leading-5 text-text-muted">
            یک عنوان مناسب و جذاب برای آگهی بنویس.
          </p>
          <input
            type="text"
            value={draft.title}
            onChange={(event) => updateDraft({ title: event.target.value })}
            placeholder="مثلاً کفش نایکی اوریجینال"
            className="limoo-input-plain mt-3 min-h-12 w-full rounded-md border-2 border-cta bg-surface px-4 text-sm text-text outline-none placeholder:text-text-muted"
          />
        </section>

        <section className="mb-6">
          <h2 className="text-sm font-bold text-text">توضیحات</h2>
          <p className="mt-1 text-xs leading-5 text-text-muted">
            یک عنوان مناسب و جذاب برای آگهی بنویس.
          </p>
          <div className="relative mt-3">
            <button
              type="button"
              onClick={() => setAiOpen(true)}
              className="absolute -start-1 -top-3 z-10 flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm transition active:bg-primary-hover"
              aria-label="نوشتن با هوش مصنوعی"
            >
              <IconSparkle className="size-4" />
            </button>
            <textarea
              value={draft.description}
              onChange={(event) => updateDraft({ description: event.target.value })}
              rows={6}
              placeholder="توضیحات آگهی رو اضافه کن، از قبیل رنگ و سایز و چیزایی که به خریدار کمک می‌کنه."
              className="limoo-input-plain w-full resize-none rounded-md bg-input px-4 py-4 text-sm leading-6 text-text outline-none placeholder:text-text-muted"
            />
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-sm font-bold text-text">قیمت کالا</h2>
          <div className="relative mt-3">
            <span className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-sm text-text-muted">
              تومان
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={draft.price}
              onChange={(event) =>
                updateDraft({ price: event.target.value.replace(/[^\d]/g, '') })
              }
              placeholder="قیمت رو به تومان بنویس"
              className="limoo-input-plain min-h-12 w-full rounded-md bg-input pe-4 ps-16 text-sm text-text outline-none placeholder:text-text-muted"
            />
          </div>
        </section>

        <label className="mb-4 flex cursor-pointer items-start gap-3 rounded-md border border-border px-3 py-3">
          <input
            type="checkbox"
            checked={draft.negotiable}
            onChange={(event) => updateDraft({ negotiable: event.target.checked })}
            className="mt-1 size-4 shrink-0 accent-cta"
          />
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-text">
              با قیمت توافقی هم مشکلی ندارم.
            </span>
            <span className="mt-1 block text-xs leading-5 text-text-muted">
              انتخاب این گزینه، خریدار متوجه می‌شه که جا برای مذاکره هم وجود داره.
            </span>
          </span>
        </label>
      </div>

      <div className="absolute inset-x-0 bottom-0 border-t border-border bg-surface px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          disabled={!canContinue}
          onClick={() => navigate('/sell/video', { state: location.state })}
          className="flex min-h-14 w-full items-center justify-center rounded-btn bg-cta text-base font-bold text-cta-foreground transition enabled:active:opacity-90 disabled:opacity-35"
        >
          ثبت و ادامه
        </button>
      </div>

      <AiDescriptionSheet
        open={aiOpen}
        title={draft.title}
        onClose={() => setAiOpen(false)}
        onSelect={(description) => updateDraft({ description })}
      />
    </div>
  )
}
