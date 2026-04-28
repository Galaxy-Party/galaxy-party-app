import { useEffect, useRef } from 'react'

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const stars = Array.from({ length: 360 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.4 + 0.15,
      tw: Math.random() * Math.PI * 2,
      tws: Math.random() * 0.018 + 0.004,
      speed: Math.random() * 0.07 + 0.01,
    }))

    const shoots: { x: number; y: number; len: number; speed: number; life: number }[] = []
    let lastShoot = 0

    const draw = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const s of stars) {
        s.tw += s.tws
        const a = 0.3 + Math.sin(s.tw) * 0.35
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200,200,255,${a})`
        ctx.fill()
        s.y += s.speed
        if (s.y > canvas.height) { s.y = 0; s.x = Math.random() * canvas.width }
      }

      if (t - lastShoot > 4500 && Math.random() < 0.4) {
        shoots.push({
          x: Math.random() * canvas.width * 0.7,
          y: Math.random() * canvas.height * 0.4,
          len: 90 + Math.random() * 80,
          speed: 7 + Math.random() * 4,
          life: 1,
        })
        lastShoot = t
      }

      for (let i = shoots.length - 1; i >= 0; i--) {
        const s = shoots[i]
        const g = ctx.createLinearGradient(s.x, s.y, s.x - s.len, s.y - s.len * 0.3)
        g.addColorStop(0, `rgba(180,180,255,${s.life * 0.7})`)
        g.addColorStop(1, 'rgba(180,180,255,0)')
        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(s.x - s.len, s.y - s.len * 0.3)
        ctx.strokeStyle = g
        ctx.lineWidth = 1.2
        ctx.stroke()
        s.x += s.speed
        s.y += s.speed * 0.3
        s.life -= 0.02
        if (s.life <= 0) shoots.splice(i, 1)
      }

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  )
}
