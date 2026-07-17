import { Navigate, Route, Routes } from 'react-router-dom'
import MainShell from './components/MainShell'
import PhoneFrame from './components/PhoneFrame'
import { ChatProvider } from './context/ChatContext'
import { ListingDraftProvider } from './context/ListingDraftContext'
import ChatList from './screens/ChatList'
import ChatThread from './screens/ChatThread'
import CreateListingDetails from './screens/CreateListingDetails'
import CreateListingVideo from './screens/CreateListingVideo'
import ExploreFeed from './screens/ExploreFeed'
import ExploreSearch from './screens/ExploreSearch'
import Notifications from './screens/Notifications'
import Profile from './screens/Profile'
import ProductDetail from './screens/ProductDetail'
import SellerShop from './screens/SellerShop'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainShell />}>
        <Route path="/" element={<ExploreFeed />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/search" element={<ExploreSearch />} />
        <Route path="/chats" element={<ChatList />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="/shop/:sellerId" element={<SellerShop />} />
      <Route path="/product/:productId" element={<ProductDetail />} />
      <Route path="/chats/:threadId" element={<ChatThread />} />
      <Route path="/sell" element={<CreateListingDetails />} />
      <Route path="/sell/video" element={<CreateListingVideo />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ChatProvider>
      <ListingDraftProvider>
        <PhoneFrame>
          <AppRoutes />
        </PhoneFrame>
      </ListingDraftProvider>
    </ChatProvider>
  )
}
