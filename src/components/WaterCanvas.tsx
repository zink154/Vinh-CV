import { useEffect, useRef } from "react"

interface TrailPoint {
  x: number
  y: number
  time: number
}

export default function WaterCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const trail = useRef<TrailPoint[]>([])
  const mouse = useRef({ x: 0, y: 0, active: false })
  const animId = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const dpr = window.devicePixelRatio || 1
      canvas.width = parent.clientWidth * dpr
      canvas.height = parent.clientHeight * dpr
      canvas.style.width = `${parent.clientWidth}px`
      canvas.style.height = `${parent.clientHeight}px`
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener("resize", resize)

    let timeout: ReturnType<typeof setTimeout>

    const handleMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.current.x = e.clientX - rect.left
      mouse.current.y = e.clientY - rect.top
      mouse.current.active = true

      trail.current.push({
        x: mouse.current.x,
        y: mouse.current.y,
        time: Date.now(),
      })

      // Keep trail manageable
      if (trail.current.length > 120) {
        trail.current = trail.current.slice(-120)
      }

      clearTimeout(timeout)
      timeout = setTimeout(() => {
        mouse.current.active = false
      }, 150)
    }

    canvas.addEventListener("mousemove", handleMove)

    const trailLife = 1200 // ms

    const draw = () => {
      const w = canvas.width / (window.devicePixelRatio || 1)
      const h = canvas.height / (window.devicePixelRatio || 1)
      ctx.clearRect(0, 0, w, h)

      const now = Date.now()

      // Remove expired points
      trail.current = trail.current.filter((p) => now - p.time < trailLife)

      const pts = trail.current
      if (pts.length < 2) {
        animId.current = requestAnimationFrame(draw)
        return
      }

      // Draw smooth trail with fading segments
      for (let i = 1; i < pts.length; i++) {
        const prev = pts[i - 1]
        const curr = pts[i]
        const age = now - curr.time
        const life = 1 - age / trailLife

        if (life <= 0) continue

        // Thinner line that fades
        const width = life * 2.5 + 0.5
        const alpha = life * 0.25

        // Gradient hue: blue → teal
        const hue = 200 + (1 - life) * 20

        ctx.beginPath()
        ctx.moveTo(prev.x, prev.y)
        ctx.lineTo(curr.x, curr.y)
        ctx.strokeStyle = `hsla(${hue}, 60%, 65%, ${alpha})`
        ctx.lineWidth = width
        ctx.lineCap = "round"
        ctx.stroke()

        // Soft glow layer
        ctx.beginPath()
        ctx.moveTo(prev.x, prev.y)
        ctx.lineTo(curr.x, curr.y)
        ctx.strokeStyle = `hsla(${hue}, 70%, 70%, ${alpha * 0.3})`
        ctx.lineWidth = width + 6
        ctx.lineCap = "round"
        ctx.stroke()
      }

      // Subtle glow at cursor
      if (mouse.current.active) {
        const gradient = ctx.createRadialGradient(
          mouse.current.x, mouse.current.y, 0,
          mouse.current.x, mouse.current.y, 50
        )
        gradient.addColorStop(0, "hsla(210, 70%, 70%, 0.08)")
        gradient.addColorStop(1, "hsla(210, 70%, 70%, 0)")
        ctx.beginPath()
        ctx.arc(mouse.current.x, mouse.current.y, 50, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }

      animId.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener("resize", resize)
      canvas.removeEventListener("mousemove", handleMove)
      cancelAnimationFrame(animId.current)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-auto"
    />
  )
}
