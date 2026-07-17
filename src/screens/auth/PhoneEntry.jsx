import { useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import AuthLayout, { AuthPrimaryButton, AuthTextField } from '../../components/AuthLayout'
import { useAuth } from '../../context/AuthContext'
import { formatPhoneDisplay, onlyDigits, toPersianDigits } from '../../utils/format'

function isValidIranMobile(digits) {
  return /^09\d{9}$/.test(digits)
}

export default function PhoneEntry() {
  const navigate = useNavigate()
  const { isAuthenticated, draftPhone, setPhone } = useAuth()
  const [raw, setRaw] = useState(() => draftPhone || '')

  const digits = onlyDigits(raw)
  const display = formatPhoneDisplay(digits)
  const valid = isValidIranMobile(digits)

  const hint = useMemo(() => {
    if (!digits) return null
    if (digits.length < 11) return `${toPersianDigits(11 - digits.length)} رقم مانده`
    if (!valid) return 'شماره موبایل معتبر نیست'
    return null
  }, [digits, valid])

  if (isAuthenticated) return <Navigate to="/" replace />

  const onChange = (e) => {
    const next = onlyDigits(e.target.value).slice(0, 11)
    setRaw(next)
  }

  const submit = (e) => {
    e.preventDefault()
    if (!valid) return
    setPhone(digits)
    navigate('/signup/otp')
  }

  return (
    <AuthLayout
      footer={
        <p className="text-xs leading-5 text-text-muted">
          با ورود، قوانین و مقررات لیمو را می‌پذیرید
        </p>
      }
    >
      <form onSubmit={submit} className="flex flex-1 flex-col">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold leading-snug text-text">شماره موبایلتو وارد کن</h1>
          <p className="text-sm leading-6 text-text-secondary">
            کد تأیید به این شماره ارسال می‌شه!
          </p>
        </div>

        <div className="mt-8 space-y-2">
          <AuthTextField
            value={display}
            onChange={onChange}
            placeholder="شماره موبایل خود را وارد کنید"
            inputMode="numeric"
            autoComplete="tel"
            autoFocus
            className="tracking-wide"
          />
          {hint && <p className="px-1 text-xs text-text-muted">{hint}</p>}
        </div>

        <div className="mt-auto pt-8">
          <AuthPrimaryButton type="submit" disabled={!valid}>
            دریافت کد
          </AuthPrimaryButton>
        </div>
      </form>
    </AuthLayout>
  )
}
