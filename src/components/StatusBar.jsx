/** iOS-style mock status bar */
import { useLocation } from 'react-router-dom'

export default function StatusBar() {
  const { pathname } = useLocation()
  const lightChrome =
    pathname === '/search' ||
    pathname === '/notifications' ||
    pathname.startsWith('/chats') ||
    pathname.startsWith('/sell') ||
    pathname === '/profile'

  return (
    <div
      dir="ltr"
      className={`pointer-events-none absolute inset-x-0 top-0 z-50 flex h-[calc(2rem+env(safe-area-inset-top))] items-center px-4 pt-[env(safe-area-inset-top)] text-[0.6875rem] font-medium ${
        lightChrome ? 'bg-surface text-text' : 'bg-transparent text-text-inverse'
      }`}
    >
      {/* Left: signal + carrier + wifi */}
      <div className="flex min-w-0 flex-1 items-center gap-1">
        <SignalIcon />
        <span className="truncate tracking-tight">Figma</span>
        <WifiIcon />
      </div>

      {/* Center: time */}
      <div className="shrink-0 tabular-nums">9:41 AM</div>

      {/* Right: extras + battery */}
      <div className="flex min-w-0 flex-1 items-center justify-end gap-1.5">
        <AlarmIcon />
        <BluetoothIcon />
        <span className="tabular-nums">100%</span>
        <BatteryIcon />
      </div>
    </div>
  )
}

function SignalIcon() {
  return (
    <svg className="size-3.5 shrink-0" viewBox="0 0 18 12" fill="currentColor" aria-hidden>
      <rect x="0" y="8" width="3" height="4" rx="0.6" />
      <rect x="5" y="5.5" width="3" height="6.5" rx="0.6" />
      <rect x="10" y="3" width="3" height="9" rx="0.6" />
      <rect x="15" y="0" width="3" height="12" rx="0.6" />
    </svg>
  )
}

function WifiIcon() {
  return (
    <svg className="size-3.5 shrink-0" viewBox="0 0 16 12" fill="none" aria-hidden>
      <path
        d="M1.2 4.2a9 9 0 0 1 13.6 0M3.4 6.5a6 6 0 0 1 9.2 0M5.6 8.8a3 3 0 0 1 4.8 0"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="8" cy="11" r="1.1" fill="currentColor" />
    </svg>
  )
}

function AlarmIcon() {
  return (
    <svg className="size-3 shrink-0" viewBox="0 0 14 14" fill="none" aria-hidden>
      <circle cx="7" cy="7.5" r="4.2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M7 5.5v2.2l1.4.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M3.2 2.2 2 3.3M10.8 2.2 12 3.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function BluetoothIcon() {
  return (
    <svg className="size-3 shrink-0" viewBox="0 0 10 14" fill="none" aria-hidden>
      <path
        d="M4.5 1.5 8 4.5 4.5 7.5 8 10.5 4.5 13.5V1.5ZM4.5 7.5 1.5 5M4.5 7.5l-3 2.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BatteryIcon() {
  return (
    <svg className="h-3 w-[22px] shrink-0" viewBox="0 0 25 12" fill="none" aria-hidden>
      <rect x="0.6" y="0.6" width="20" height="10.8" rx="2.2" stroke="currentColor" strokeWidth="1.2" />
      <rect x="2.2" y="2.2" width="16.8" height="7.6" rx="1.2" fill="currentColor" />
      <path d="M22.5 4v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
