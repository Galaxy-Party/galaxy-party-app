import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import LoginPage from './pages/login/LoginPage.tsx'
import ProfilePage from './pages/profile/ProfilePage.tsx'
import MenuPage from './pages/menu/MenuPage.tsx'
import RoomCreationPage from './pages/roomCreation/RoomCreationPage.tsx'
import RoomListPage from './pages/roomList/RoomListPage.tsx'
import { UserProvider } from './context/UserContext.tsx'
import { ToastProvider } from './context/ToastContext.tsx'
import Toaster from './components/Toaster.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import CatchAllRedirect from './components/CatchAllRedirect.tsx'
import WaitingRoomPage from './pages/waitingRoom/WaitingRoomPage.tsx'
import GamePage from './pages/game/GamePage.tsx'
import SpectatorPage from './pages/spectator/SpectatorPage.tsx'
import AppLayout from './layouts/AppLayout.tsx'
import RankedPage from './pages/ranked/RankedPage.tsx'
import MatchmakingPage from './pages/matchmaking/MatchmakingPage.tsx'
import RanksProvider from './context/RanksProvider.tsx'
import LevelsProvider from './context/LevelsProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <UserProvider>
          <RanksProvider>
          <LevelsProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/menu" element={<MenuPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/create-room" element={<RoomCreationPage />} />
                  <Route path="/rooms" element={<RoomListPage />} />
                  <Route path="/ranked" element={<RankedPage />} />
                </Route>
                <Route path="/ranked/matchmaking" element={<MatchmakingPage />} />
                <Route path="/rooms/:id" element={<WaitingRoomPage />} />
                <Route path="/rooms/:id/game" element={<GamePage />} />
                <Route path="/rooms/:id/spectate" element={<SpectatorPage />} />
              </Route>
              <Route path="*" element={<CatchAllRedirect />} />
            </Routes>
          </LevelsProvider>
          </RanksProvider>
        </UserProvider>
        <Toaster />
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
)
