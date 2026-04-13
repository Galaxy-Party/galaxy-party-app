import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import CreateUserPage from './pages/CreateUserPage.tsx'
import MenuPage from './pages/MenuPage.tsx'
import RulesPage from './pages/RulesPage.tsx'
import {io} from "socket.io-client";

export const socket = io(import.meta.env.VITE_WS_URL, {
    path: "/ws",
    transports: ["polling", "websocket"]
});

socket.on("connect", () => {
    console.log("Connected:", socket.id);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateUserPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/rules" element={<RulesPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
