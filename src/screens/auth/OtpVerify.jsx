import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import AuthLayout, { AuthPrimaryButton } from '../../components/AuthLayout'
import { IconClock } from '../../components/Icons'
import { useAuth } from '../../context/AuthContext'
import { formatPhoneDisplay, onlyDigits, toPersianDigits } from '../../utils/format'

const OTP_LENGTH = 5
const RESEND_SECONDS = 120

export default function OtpVerify() {
  const navigate = useNavigate()
  const { isAuthenticated, draftPhone, markOtpVerified } = useAuth()
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''))
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS)
  const inputsRef = useRef([])

  const code = digits.join('')
  const complete = code.length === OTP_LENGTH

  useEffect(() => {
    if (secondsLeft <= 0) return undefined
    const id = window.setInterval(() => setSecondsLeft((s) => s - 1), 1000)
    return () => window.clearInterval(id)
  }, [secondsLeft])

  if (isAuthenticated) return <Navigate to="/" replace />
  if (!draftPhone) return <Navigate to="/signup" replace />

  const focusAt = (index) => {
    inputsRef.current[index]?.focus()
  }

  const updateAt = (index, value) => {
    const char = onlyDigits(value).slice(-1)
    setDigits((prev) => {
      const next = [...prev]
      next[index] = char
      return next
    })
    if (char && index < OTP_LENGTH - 1) focusAt(index + 1)
  }

  const onKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      focusAt(index - 1)
    }
  }

  const onPaste = (e) => {
    e.preventDefault()
    const pasted = onlyDigits(e.clipboardData.getData('text')).slice(0, OTP_LENGTH)
    if (!pasted) return
    const next = Array(OTP_LENGTH).fill('')
    pasted.split('').forEach((d, i) => {
      next[i] = d
    })
    setDigits(next)
    focusAt(Math.min(pasted.length, OTP_LENGTH - 1))
  }

  const minutes = Math.floor(secondsLeft / 60)
  const secs = secondsLeft % 60
  const timerLabel = toPersianDigits(
    `${minutes}:${String(secs).padStart(2, '0')}`,
  )

  const submit = (e) => {
    e.preventDefault()
    if (!complete) return
    // Prototype: any 5-digit code is accepted
    markOtpVerified()
    navigate('/signup/name')
  }

  const resend = () => {
    if (secondsLeft > 0) return
    setSecondsLeft(RESEND_SECONDS)
    setDigits(Array(OTP_LENGTH).fill(''))
    focusAt(0)
  }

  return (
    <AuthLayout>
      <form onSubmit={submit} className="flex flex-1 flex-col">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold leading-snug text-text">کد تأیید رو وارد کن</h1>
          <p className="text-sm leading-6 text-text-secondary">
            کد ۵ رقمی به شماره {formatPhoneDisplay(draftPhone)} ارسال شد
          </p>
        </div>

        <div dir="rtl" className="mt-8 flex justify-center gap-2.5" onPaste={onPaste}>
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el
              }}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? 'one-time-code' : 'off'}
              maxLength={1}
              value={digit ? toPersianDigits(digit) : ''}
              onChange={(e) => updateAt(index, e.target.value)}
              onKeyDown={(e) => onKeyDown(index, e)}
              autoFocus={index === 0}
              className="size-12 rounded-btn bg-input text-center text-xl font-bold text-text outline-none focus:ring-2 focus:ring-cta/15"
              aria-label={`رقم ${toPersianDigits(index + 1)}`}
            />
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between px-1 text-sm">
          <button
            type="button"
            onClick={resend}
            disabled={secondsLeft > 0}
            className="text-text-muted transition enabled:text-text enabled:active:opacity-70 disabled:opacity-50"
          >
            ارسال مجدد کد
          </button>
          <div className="flex items-center gap-1.5 text-text-secondary">
            <IconClock className="size-4" />
            <span className="tabular-nums">{timerLabel}</span>
          </div>
        </div>

        <div className="mt-auto space-y-4 pt-8">
          <AuthPrimaryButton type="submit" disabled={!complete}>
            تأیید
          </AuthPrimaryButton>
          <Link
            to="/signup"
            className="block text-center text-sm text-text-muted transition active:text-text"
          >
            تغییر شماره
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}
