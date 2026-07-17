import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import AuthLayout, { AuthPrimaryButton, AuthTextField } from '../../components/AuthLayout'
import { useAuth } from '../../context/AuthContext'

export default function NameEntry() {
  const navigate = useNavigate()
  const { isAuthenticated, draftPhone, otpVerified, completeSignup } = useAuth()
  const [name, setName] = useState('')

  if (isAuthenticated) return <Navigate to="/" replace />
  if (!draftPhone || !otpVerified) return <Navigate to="/signup" replace />

  const trimmed = name.trim()
  const valid = trimmed.length >= 2

  const submit = (e) => {
    e.preventDefault()
    if (!valid) return
    completeSignup(trimmed)
    navigate('/', { replace: true })
  }

  return (
    <AuthLayout>
      <form onSubmit={submit} className="flex flex-1 flex-col">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold leading-snug text-text">اسمت چیه؟</h1>
          <p className="text-sm leading-6 text-text-secondary">
            همه چیز آماده‌ست، فقط اسمتو وارد کن.
          </p>
        </div>

        <div className="mt-8">
          <AuthTextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="نام و نام خانوادگی"
            autoComplete="name"
            autoFocus
          />
        </div>

        <div className="mt-auto pt-8">
          <AuthPrimaryButton type="submit" disabled={!valid}>
            تأیید و ورود
          </AuthPrimaryButton>
        </div>
      </form>
    </AuthLayout>
  )
}
