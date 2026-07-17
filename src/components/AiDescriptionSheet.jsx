import { aiDescriptionTones, generateListingDescription } from '../data/listingAi'
import BottomSheet from './BottomSheet'

export default function AiDescriptionSheet({ open, title, onClose, onSelect }) {
  const handleSelect = (toneId) => {
    onSelect(generateListingDescription(title, toneId))
    onClose()
  }

  return (
    <BottomSheet open={open} title="توضیحات با هوش مصنوعی" onClose={onClose}>
      <p className="mb-4 text-sm leading-6 text-text-secondary">
        لحن و سبک توضیحات رو انتخاب کن تا متن آگهی برات نوشته بشه.
      </p>
      <ul className="space-y-2">
        {aiDescriptionTones.map((tone) => (
          <li key={tone.id}>
            <button
              type="button"
              onClick={() => handleSelect(tone.id)}
              className="flex w-full flex-col items-start rounded-card border border-border bg-surface px-4 py-3 text-start transition active:bg-surface-secondary"
            >
              <span className="text-sm font-semibold text-text">{tone.label}</span>
              <span className="mt-1 text-xs text-text-muted">{tone.hint}</span>
            </button>
          </li>
        ))}
      </ul>
    </BottomSheet>
  )
}
