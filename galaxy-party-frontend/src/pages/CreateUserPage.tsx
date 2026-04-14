import {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import backImg from '../assets/back.png'
import avatars from '../assets/avatars'
import {useSocket} from "../hooks/useSocket.ts";
import socket from "../socket/client.ts";
import type {User} from "../types/user/models.ts";

function CreateUserPage() {
    const navigate = useNavigate()

    //TODO: Ajouter un contexte pour les utilisateur + mettre uniquement l'id dans le localStorage
    useSocket("user:created", (user) => {
        localStorage.setItem("galaxy-party-user", JSON.stringify(user));
        navigate("/menu");
    })

    const [avatarIndex, setAvatarIndex] = useState(0)
    const [username, setUsername] = useState("");
    const [imageName, setImageName] = useState<string>(avatars[0]);

    useEffect(() => {
        const json = localStorage.getItem("galaxy-party-user")
        if (json) {
            const user = JSON.parse(json) as User;
            console.log(user)
            navigate("/menu");
        }
    }, [navigate]);

    useEffect(() => {
        setImageName(avatars[avatarIndex])
    }, [avatarIndex]);





  const prevAvatar = () => setAvatarIndex(i => (i - 1 + avatars.length) % avatars.length)
  const nextAvatar = () => setAvatarIndex(i => (i + 1) % avatars.length)

    const handleSubmit = () => {
        if (!username.trim()) return;

        socket.emit(
            "user:create",
            {
                username,
                imageName,
            },
            (err?: string) => {
                if (err) console.error(err);
            }
        );
    };

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{ backgroundImage: `url(${backImg})` }}
    >
      <div className="flex flex-col items-center justify-evenly w-full h-screen py-16">

        <div className="flex items-center gap-16">

          <button className="cursor-pointer transition-opacity hover:opacity-70" style={{ background: 'none', border: 'none', padding: 0 }} onClick={prevAvatar}>
            <svg width="65" height="72" viewBox="0 0 80 50" preserveAspectRatio="none" fill="none">
              <path d="M 11.6,22.6 L 68.4,4.4 Q 76,2 76,10 L 76,40 Q 76,48 68.4,45.6 L 11.6,27.4 Q 4,25 11.6,22.6 Z"
                fill="#051240" stroke="#DEB992" strokeWidth="1.5"/>
            </svg>
          </button>

          <div
            className="w-72 h-72 rounded-full border-2 overflow-hidden flex items-center justify-center"
            style={{ borderColor: '#DEB992', backgroundColor: '#051240' }}
          >
            <img src={imageName} alt="avatar" className="w-3/4 h-3/4 object-contain" />
          </div>

          <button className="cursor-pointer transition-opacity hover:opacity-70" style={{ background: 'none', border: 'none', padding: 0 }} onClick={nextAvatar}>
            <svg width="65" height="72" viewBox="0 0 80 50" preserveAspectRatio="none" fill="none">
              <path d="M 68.4,22.6 L 11.6,4.4 Q 4,2 4,10 L 4,40 Q 4,48 11.6,45.6 L 68.4,27.4 Q 76,25 68.4,22.6 Z"
                fill="#051240" stroke="#DEB992" strokeWidth="1.5"/>
            </svg>
          </button>

        </div>

        <div className="flex flex-col items-center gap-3">
          <label className="text-white text-xl font-light">Entrez votre nom :</label>
          <input
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            className="border-b-2 text-white text-center outline-none w-72 pb-2 text-lg"
            style={{ borderColor: '#DEB992', background: 'none' }}
          />
        </div>

        <button
          className="text-white text-lg px-20 py-3 rounded-2xl cursor-pointer border-2 tracking-wide transition-opacity hover:opacity-70"
          style={{ backgroundColor: '#051240', borderColor: '#DEB992' }}
          onClick={handleSubmit}
        >
          Entrer
        </button>

      </div>
    </div>
  )
}

export default CreateUserPage
