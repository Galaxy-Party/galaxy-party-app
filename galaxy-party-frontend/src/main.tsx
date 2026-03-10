import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {io} from "socket.io-client";

export const socket = io("http://localhost:3001");

socket.on("connect", () => {
    console.log("Connected:", socket.id);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
