import { useState, useEffect, useMemo } from "react"
import { useResumeContext } from "../context/ResumeContext"
import EditableText from "./EditableText"
import WaterCanvas from "./WaterCanvas"

export default function Hero() {
  const { data, isEditing, updateField } = useResumeContext()
  const { name, title, avatar } = data
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlValue, setUrlValue] = useState(avatar || "")
  const [imgError, setImgError] = useState(false)

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")

  // Typewriter effect — cycle through title parts split by "|"
  const words = useMemo(() => title.split("|").map((s) => s.trim()), [title])
  const [wordIndex, setWordIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  // Reset typewriter when title changes (edit mode)
  useEffect(() => {
    setWordIndex(0)
    setDisplayText("")
    setIsDeleting(false)
  }, [title])

  useEffect(() => {
    if (isEditing) return // Pause typewriter in edit mode

    const currentWord = words[wordIndex % words.length]

    if (!isDeleting && displayText === currentWord) {
      const timer = setTimeout(() => setIsDeleting(true), 2000)
      return () => clearTimeout(timer)
    }

    if (isDeleting && displayText === "") {
      setIsDeleting(false)
      setWordIndex((prev) => (prev + 1) % words.length)
      return
    }

    const timer = setTimeout(
      () => {
        setDisplayText(
          isDeleting
            ? currentWord.slice(0, displayText.length - 1)
            : currentWord.slice(0, displayText.length + 1)
        )
      },
      isDeleting ? 40 : 80
    )

    return () => clearTimeout(timer)
  }, [displayText, isDeleting, wordIndex, words, isEditing])

  // Auto-convert Google Drive share links to direct image URLs
  function toDirectUrl(url: string): string {
    const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/)
    if (driveMatch) {
      return `https://lh3.googleusercontent.com/d/${driveMatch[1]}`
    }
    const driveMatch2 = url.match(/drive\.google\.com\/open\?id=([^&]+)/)
    if (driveMatch2) {
      return `https://lh3.googleusercontent.com/d/${driveMatch2[1]}`
    }
    return url
  }

  const handleSaveUrl = () => {
    const directUrl = toDirectUrl(urlValue.trim())
    setUrlValue(directUrl)
    setImgError(false)
    updateField("avatar", directUrl)
    setShowUrlInput(false)
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen snap-start flex items-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden"
    >
      {/* Interactive water canvas — desktop only */}
      <div className="hidden md:block">
        <WaterCanvas />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div
        className={`relative z-10 w-full max-w-6xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16 ${
          isEditing
            ? ""
            : "pointer-events-none [&_a]:pointer-events-auto [&_button]:pointer-events-auto"
        }`}
      >
        {/* Left side — Text content */}
        <div className="flex-1 text-center md:text-left">
          <p className="text-lg md:text-xl italic text-slate-400 mb-3 animate-[fadeInUp_0.8s_ease-out]">
            My Name is
          </p>

          <div className="mb-5 animate-[fadeInUp_0.8s_ease-out_0.15s_both]">
            <EditableText
              value={name}
              path="name"
              as="h1"
              className="text-5xl md:text-7xl font-bold tracking-tight leading-tight"
            />
            <div className="h-1.5 w-20 bg-blue-500 rounded-full mt-3 mx-auto md:mx-0" />
          </div>

          {/* Typewriter subtitle */}
          <div className="mb-8 animate-[fadeInUp_0.8s_ease-out_0.3s_both]">
            {isEditing ? (
              <EditableText
                value={title}
                path="title"
                as="p"
                className="text-lg md:text-xl text-blue-300 font-medium"
              />
            ) : (
              <p className="text-lg md:text-xl text-slate-300">
                I am {/^[aeiou]/i.test(displayText) ? "an" : "a"}{" "}
                <span className="text-blue-400 font-semibold">
                  {displayText}
                  <span className="animate-[blink_1s_step-end_infinite] ml-0.5 text-blue-400">
                    |
                  </span>
                </span>
              </p>
            )}
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 animate-[fadeInUp_0.8s_ease-out_0.45s_both]">
            <a
              href="#contact"
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-full font-medium transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
            >
              Contact Me
            </a>
            <a
              href="#experience"
              className="px-6 py-3 border border-slate-500 hover:border-blue-400 rounded-full font-medium transition-all hover:scale-105"
            >
              View My Work
            </a>
          </div>
        </div>

        {/* Right side — Avatar */}
        <div className="flex-shrink-0 animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
          <div className="relative group">
            {avatar && !imgError ? (
              <img
                src={avatar}
                alt={name}
                className="w-52 h-52 md:w-80 md:h-80 xl:w-96 xl:h-96 rounded-full object-cover shadow-2xl shadow-blue-500/20 ring-4 ring-white/10"
                onError={() => setImgError(true)}
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            ) : (
              <div className="w-52 h-52 md:w-80 md:h-80 xl:w-96 xl:h-96 rounded-full bg-gradient-to-br from-blue-400 to-teal-400 flex items-center justify-center text-5xl md:text-7xl font-bold shadow-2xl shadow-blue-500/20 ring-4 ring-white/10">
                {initials}
              </div>
            )}

            {isEditing && (
              <button
                onClick={() => {
                  setUrlValue(avatar || "")
                  setShowUrlInput(true)
                }}
                className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <span className="text-sm font-medium">Change</span>
              </button>
            )}

            {showUrlInput && (
              <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-600 rounded-xl p-4 shadow-2xl w-[min(20rem,calc(100vw-3rem))] z-20">
                <p className="text-sm text-slate-300 mb-2">Paste image URL:</p>
                <input
                  type="url"
                  value={urlValue}
                  onChange={(e) => setUrlValue(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm outline-none focus:border-blue-400 mb-3"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveUrl()
                    if (e.key === "Escape") setShowUrlInput(false)
                  }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveUrl}
                    className="flex-1 px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => {
                      updateField("avatar", "")
                      setShowUrlInput(false)
                    }}
                    className="px-3 py-1.5 text-sm bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => setShowUrlInput(false)}
                    className="px-3 py-1.5 text-sm bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-slate-500 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-slate-400 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
