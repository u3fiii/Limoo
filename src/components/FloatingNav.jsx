import { NavLink, useLocation } from 'react-router-dom'
import bellIcon from '../assets/nav/bell.png'
import chatIcon from '../assets/nav/chat.png'
import homeIcon from '../assets/nav/home.png'
import profileIcon from '../assets/nav/profile.png'
import searchIcon from '../assets/nav/search.png'

/**
 * LTR order left → right: Home, Bell, Search, Chat, Profile
 * (Home stays on the left as requested)
 */
const tabs = [
  { to: '/', icon: homeIcon, end: true, label: 'فید' },
  { to: '/notifications', icon: bellIcon, label: 'اعلان‌ها' },
  { to: '/search', icon: searchIcon, label: 'جستجو' },
  { to: '/chats', icon: chatIcon, label: 'چت‌ها' },
  { to: '/profile', icon: profileIcon, label: 'پروفایل' },
]

function NavIcon({ src, className = '' }) {
  return (
    <span
      aria-hidden
      className={`nav-icon-mask block size-5 shrink-0 bg-current ${className}`}
      style={{
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
      }}
    />
  )
}

/** Glass floating pill nav — selected tab is a wider lime pill */
export default function FloatingNav() {
  const { pathname } = useLocation()
  const immersive = pathname === '/'

  return (
    <nav
      dir="ltr"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-40 flex justify-center px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      <ul
        className={`pointer-events-auto flex w-full max-w-sm items-center rounded-pill px-1.5 py-1.5 shadow-md backdrop-blur-xl ${
          immersive ? 'bg-nav-float' : 'border border-border/60 bg-surface/70'
        }`}
      >
        {tabs.map(({ to, icon, end, label }) => (
          <li key={to} className="min-w-0 flex-1">
            <NavLink
              to={to}
              end={end}
              aria-label={label}
              className={({ isActive }) =>
                `relative flex h-11 w-full items-center justify-center rounded-pill ${
                  isActive
                    ? 'text-primary-foreground'
                    : `transition-colors duration-200 ${
                        immersive
                          ? 'text-nav-float-icon active:bg-white/10'
                          : 'text-text active:bg-surface-secondary'
                      }`
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive ? (
                    <span
                      aria-hidden
                      className="nav-pill-in absolute inset-0 rounded-pill bg-primary"
                    />
                  ) : null}
                  <span className="relative z-10">
                    <NavIcon src={icon} />
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
