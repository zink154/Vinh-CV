import { useState, useEffect } from "react"

const sections = [
  { id: "hero", label: "Home" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
]

export default function Navbar({ dark, onToggleDark, hasAdminBar }: { dark: boolean; onToggleDark: () => void; hasAdminBar?: boolean }) {
  const [active, setActive] = useState("hero")
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const container = document.querySelector<HTMLElement>(".snap-y")
    if (!container) return

    const handleScroll = () => {
      setScrolled(container.scrollTop > 50)

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
    setMenuOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div
        className={`pointer-events-auto ${hasAdminBar ? "mt-14" : "mt-4"} px-2 py-1.5 border transition-[background,box-shadow,border-color,backdrop-filter] duration-500 rounded-2xl md:rounded-full ${
          scrolled
            ? "bg-slate-900/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/15 shadow-lg shadow-black/20"
            : "bg-slate-900/40 dark:bg-slate-900/40 backdrop-blur-md border-white/10 shadow-md shadow-black/10"
        }`}
      >
        <div className="flex items-center gap-0.5">
          {/* Logo */}
          <button
            onClick={() => scrollTo("hero")}
            className="px-3 py-1.5 text-white font-bold text-sm tracking-tight hover:text-blue-400 transition-colors"
          >
            VP
          </button>

          <div className="w-px h-4 bg-white/15 mx-1" />

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-0.5">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`relative px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  active === s.id
                    ? "text-white bg-blue-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {s.label}
                {active === s.id && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-blue-400 rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="hidden md:block w-px h-4 bg-white/15 mx-1" />

          {/* Dark mode toggle */}
          <button
            onClick={onToggleDark}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {dark ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            <div className="w-4 flex flex-col gap-[3px]">
              <span className={`block h-[2px] bg-current transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[5px]" : ""}`} />
              <span className={`block h-[2px] bg-current transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-[2px] bg-current transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[5px]" : ""}`} />
            </div>
          </button>
        </div>

        {/* Mobile dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            menuOpen ? "max-h-80 opacity-100 mt-2" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-white/10 pt-2 pb-1 px-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  active === s.id
                    ? "text-blue-400 bg-blue-400/10"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
