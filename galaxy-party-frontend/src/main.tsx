import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import CreateUserPage from './pages/CreateUserPage.tsx'
import MenuPage from './pages/MenuPage.tsx'
import RulesPage from './pages/RulesPage.tsx'
import RoomCreationPage from './pages/RoomCreationPage.tsx'
import RoomListPage from './pages/RoomListPage.tsx'
import { UserProvider } from './context/UserContext.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import WaitingRoomPage from './pages/rooms/WaitingRoomPage.tsx'
import GamePage from './pages/rooms/GamePage.tsx'
import AppLayout from './layouts/AppLayout.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<CreateUserPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/rules" element={<RulesPage />} />
              <Route path="/create-room" element={<RoomCreationPage />} />
              <Route path="/rooms" element={<RoomListPage />} />
            </Route>
            <Route path="/rooms/:id" element={<WaitingRoomPage />} />
            <Route path="/rooms/:id/game" element={<GamePage />} />
          </Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
)
