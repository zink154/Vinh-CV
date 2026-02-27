import { useState } from "react"
import { useResumeContext } from "../context/ResumeContext"
import EditableText from "./EditableText"
import WaterCanvas from "./WaterCanvas"

export default function Hero() {
  const { data, isEditing, updateField } = useResumeContext()
  const { name, title, summary, contact, avatar } = data
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlValue, setUrlValue] = useState(avatar || "")

  const [imgError, setImgError] = useState(false)

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")

  // Auto-convert Google Drive share links to direct image URLs
  function toDirectUrl(url: string): string {
    // https://drive.google.com/file/d/FILE_ID/view?...
    const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/)
    if (driveMatch) {
      return `https://lh3.googleusercontent.com/d/${driveMatch[1]}`
    }
    // https://drive.google.com/open?id=FILE_ID
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
    <section id="hero" className="relative min-h-screen snap-start flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Interactive water canvas */}
      <WaterCanvas />

      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className={`relative z-10 text-center px-6 max-w-3xl mx-auto animate-[fadeInUp_0.8s_ease-out] ${isEditing ? "" : "pointer-events-none [&_a]:pointer-events-auto [&_button]:pointer-events-auto"}`}>
        {/* Avatar */}
        <div className="relative mx-auto mb-8 w-28 h-28 group">
          {avatar && !imgError ? (
            <img
              src={avatar}
              alt={name}
              className="w-28 h-28 rounded-full object-cover shadow-lg shadow-blue-500/20 ring-4 ring-blue-400/30"
              onError={() => setImgError(true)}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-400 to-teal-400 flex items-center justify-center text-4xl font-bold shadow-lg shadow-blue-500/20">
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
            <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-600 rounded-xl p-4 shadow-2xl w-80 z-20">
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

        <EditableText
          value={name}
          path="name"
          as="h1"
          className="text-5xl md:text-6xl font-bold mb-4 tracking-tight"
        />

        <EditableText
          value={title}
          path="title"
          as="p"
          className="text-xl md:text-2xl text-blue-300 font-medium mb-6"
        />

        <EditableText
          value={summary}
          path="summary"
          as="p"
          className="text-lg text-slate-300 leading-relaxed mb-10 max-w-2xl mx-auto"
          multiline
        />

        <div className="flex flex-wrap justify-center gap-4 mb-12">
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

        {/* Social links */}
        <div className="flex justify-center gap-6 text-slate-400">
          {(contact.socials ?? []).map((social, i) => (
            <a
              key={i}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              {social.label}
            </a>
          ))}
          {contact.email && (
            <a
              href="#contact"
              className="hover:text-white transition-colors"
            >
              Email
            </a>
          )}
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
