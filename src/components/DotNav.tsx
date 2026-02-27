import { useState, useEffect } from "react"

const sections = [
  { id: "hero", label: "Home" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
]

export default function DotNav() {
  const [active, setActive] = useState("hero")

  useEffect(() => {
    const container = document.querySelector<HTMLElement>(".snap-y")
    if (!container) return

    const handleScroll = () => {
      const containerHeight = container.clientHeight
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id)
        if (el) {
          const rect = el.getBoundingClientRect()
          const containerRect = container.getBoundingClientRect()
          const top = rect.top - containerRect.top
          if (top <= containerHeight / 2) {
            setActive(sections[i].id)
            break
          }
        }
      }
    }

    container.addEventListener("scroll", handleScroll, { passive: true })
    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex items-end">
      {/* Labels */}
      <div className="flex flex-col gap-4">
        {sections.map((s) => {
          const isActive = active === s.id
          return (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className="flex items-center gap-3 group h-3 justify-end"
            >
              <span
                className={`text-xs font-medium transition-all duration-300 ${
                  isActive
                    ? "text-blue-400 opacity-100 translate-x-0"
                    : "text-slate-500 opacity-60 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
                }`}
              >
                {s.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Track line + dots */}
      <div className="relative flex flex-col items-center gap-4 ml-3">
        {/* Vertical line */}
        <div className="absolute top-0 bottom-0 w-px bg-slate-600/30" />

        {sections.map((s) => {
          const isActive = active === s.id
          return (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className="relative z-10 flex items-center justify-center h-3"
            >
              <span
                className={`rounded-full transition-all duration-300 ${
                  isActive
                    ? "w-3 h-3 bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]"
                    : "w-2 h-2 bg-slate-500/50 hover:bg-slate-400"
                }`}
              />
            </button>
          )
        })}
      </div>
    </nav>
  )
}
