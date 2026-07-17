import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ListingDraftContext = createContext(null)

const emptyDraft = {
  photos: [],
  title: '',
  description: '',
  price: '',
  negotiable: false,
  videos: [],
}

export function ListingDraftProvider({ children }) {
  const [draft, setDraft] = useState(emptyDraft)

  const updateDraft = useCallback((patch) => {
    setDraft((prev) => ({ ...prev, ...patch }))
  }, [])

  const resetDraft = useCallback(() => {
    setDraft(emptyDraft)
  }, [])

  const value = useMemo(
    () => ({
      draft,
      updateDraft,
      resetDraft,
    }),
    [draft, updateDraft, resetDraft],
  )

  return <ListingDraftContext.Provider value={value}>{children}</ListingDraftContext.Provider>
}

export function useListingDraft() {
  const ctx = useContext(ListingDraftContext)
  if (!ctx) throw new Error('useListingDraft must be used within ListingDraftProvider')
  return ctx
}
