import { Outlet, useLocation } from 'react-router-dom'
import FloatingNav from './FloatingNav'

function showFloatingNav(pathname) {
  return (
    pathname === '/' ||
    pathname === '/notifications' ||
    pathname === '/search' ||
    pathname === '/chats' ||
    pathname === '/profile'
  )
}

/** Shared chrome for main tabs — same floating nav everywhere */
export default function MainShell() {
  const { pathname } = useLocation()
  const withNav = showFloatingNav(pathname)

  return (
    <div className="relative h-full min-h-0">
      <div className="h-full min-h-0">
        <Outlet />
      </div>
      {withNav ? <FloatingNav /> : null}
    </div>
  )
}
