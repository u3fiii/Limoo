import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const STORAGE_KEY = 'limoo-auth'

function loadAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => loadAuth())
  const [draftPhone, setDraftPhone] = useState('')
  const [otpVerified, setOtpVerified] = useState(false)

  const isAuthenticated = Boolean(auth?.name)

  const persist = useCallback((next) => {
    setAuth(next)
    if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    else localStorage.removeItem(STORAGE_KEY)
  }, [])

  const setPhone = useCallback((phone) => {
    setDraftPhone(phone)
    setOtpVerified(false)
  }, [])

  const markOtpVerified = useCallback(() => {
    setOtpVerified(true)
  }, [])

  const completeSignup = useCallback(
    (name) => {
      persist({
        phone: draftPhone,
        name: name.trim(),
        signedUpAt: Date.now(),
      })
      setOtpVerified(false)
    },
    [draftPhone, persist],
  )

  const logout = useCallback(() => {
    persist(null)
    setDraftPhone('')
    setOtpVerified(false)
  }, [persist])

  const value = useMemo(
    () => ({
      user: auth,
      isAuthenticated,
      draftPhone,
      otpVerified,
      setPhone,
      markOtpVerified,
      completeSignup,
      logout,
    }),
    [
      auth,
      isAuthenticated,
      draftPhone,
      otpVerified,
      setPhone,
      markOtpVerified,
      completeSignup,
      logout,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
