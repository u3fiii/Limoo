import { Navigate, Route, Routes } from 'react-router-dom'
import MainShell from './components/MainShell'
import PhoneFrame from './components/PhoneFrame'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ChatProvider } from './context/ChatContext'
import ChatList from './screens/ChatList'
import ChatThread from './screens/ChatThread'
import ExploreFeed from './screens/ExploreFeed'
import ExploreSearch from './screens/ExploreSearch'
import NameEntry from './screens/auth/NameEntry'
import Notifications from './screens/Notifications'
import OtpVerify from './screens/auth/OtpVerify'
import PhoneEntry from './screens/auth/PhoneEntry'
import Profile from './screens/Profile'
import ProductDetail from './screens/ProductDetail'
import SellerShop from './screens/SellerShop'

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/signup" replace />
  return children
}

function AppRoutes() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/" replace /> : <PhoneEntry />}
      />
      <Route path="/signup/otp" element={<OtpVerify />} />
      <Route path="/signup/name" element={<NameEntry />} />

      <Route
        element={
          <RequireAuth>
            <MainShell />
          </RequireAuth>
        }
      >
        <Route path="/" element={<ExploreFeed />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/search" element={<ExploreSearch />} />
        <Route path="/chats" element={<ChatList />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route
        path="/shop/:sellerId"
        element={
          <RequireAuth>
            <SellerShop />
          </RequireAuth>
        }
      />
      <Route
        path="/product/:productId"
        element={
          <RequireAuth>
            <ProductDetail />
          </RequireAuth>
        }
      />
      <Route
        path="/chats/:threadId"
        element={
          <RequireAuth>
            <ChatThread />
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/signup'} replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <PhoneFrame>
          <AppRoutes />
        </PhoneFrame>
      </ChatProvider>
    </AuthProvider>
  )
}
