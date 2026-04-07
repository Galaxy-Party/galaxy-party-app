import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
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
    <App />
  </StrictMode>,
)
