import { useState, useMemo } from 'react'
import backImg from '../assets/back.png'
import svgRaw from '../assets/avatars/vecteezy_vector-animals-dogs-cats-white-bears-pandas-rats-rabbits_6731369.svg?raw'

const viewBoxes = [
  '80 165 1000 1000',
  '1016 81 1000 1000',
  '1899 113 1000 1000',
  '108 1003 1000 1000',
  '1000 1037 1000 1000',
  '1896 1023 1000 1000',
  '92 1920 1000 1000',
  '962 1900 1000 1000',
  '1910 1896 1000 1000',
]

function CreateUserPage() {
  const [avatarIndex, setAvatarIndex] = useState(0)

  const avatarSvg = useMemo(() =>
    svgRaw.replace(
      'width="3000" height="3000" viewBox="0 0 3000 3000"',
      `width="100%" height="100%" viewBox="${viewBoxes[avatarIndex]}"`
    ),
    [avatarIndex]
  )

  const prevAvatar = () => setAvatarIndex(i => (i - 1 + viewBoxes.length) % viewBoxes.length)
  const nextAvatar = () => setAvatarIndex(i => (i + 1) % viewBoxes.length)

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{ backgroundImage: `url(${backImg})` }}
    >
      <div className="flex flex-col items-center justify-evenly w-full h-screen py-16">

        {/* Avatar selector */}
        <div className="flex items-center gap-16">

          <button className="cursor-pointer" style={{ background: 'none', border: 'none', padding: 0 }} onClick={prevAvatar}>
            <svg width="65" height="72" viewBox="0 0 80 50" preserveAspectRatio="none" fill="none">
              <path d="M 11.6,22.6 L 68.4,4.4 Q 76,2 76,10 L 76,40 Q 76,48 68.4,45.6 L 11.6,27.4 Q 4,25 11.6,22.6 Z"
                fill="#051240" stroke="#DEB992" strokeWidth="1.5"/>
            </svg>
          </button>

          <div
            className="w-72 h-72 rounded-full border-2 overflow-hidden"
            style={{ borderColor: '#DEB992' }}
            dangerouslySetInnerHTML={{ __html: avatarSvg }}
          />

          <button className="cursor-pointer" style={{ background: 'none', border: 'none', padding: 0 }} onClick={nextAvatar}>
            <svg width="65" height="72" viewBox="0 0 80 50" preserveAspectRatio="none" fill="none">
              <path d="M 68.4,22.6 L 11.6,4.4 Q 4,2 4,10 L 4,40 Q 4,48 11.6,45.6 L 68.4,27.4 Q 76,25 68.4,22.6 Z"
                fill="#051240" stroke="#DEB992" strokeWidth="1.5"/>
            </svg>
          </button>

        </div>

        {/* Name input */}
        <div className="flex flex-col items-center gap-3">
          <label className="text-white text-xl font-light">Entrez votre nom :</label>
          <input
            type="text"
            className="border-b-2 text-white text-center outline-none w-72 pb-2 text-lg"
            style={{ borderColor: '#DEB992', background: 'none' }}
          />
        </div>

        {/* Submit button */}
        <button
          className="text-white text-lg px-20 py-3 rounded-2xl cursor-pointer border-2 tracking-wide"
          style={{ backgroundColor: '#051240', borderColor: '#DEB992' }}
        >
          Entrer
        </button>

      </div>
    </div>
  )
}

export default CreateUserPage
