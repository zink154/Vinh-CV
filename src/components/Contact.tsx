import { useEffect, useRef, useState } from "react"
import { useResumeContext } from "../context/ResumeContext"
import EditableText from "./EditableText"
import { AddButton, RemoveButton } from "./EditButtons"
import { useScrollAnimation } from "../hooks/useScrollAnimation"
import type { ReactNode } from "react"

function ContactCard({
  href,
  isEditing,
  className,
  children,
  target,
}: {
  href: string
  isEditing: boolean
  className: string
  children: ReactNode
  target?: string
}) {
  if (isEditing) {
    return <div className={className}>{children}</div>
  }
  return (
    <a href={href} target={target} rel={target ? "noopener noreferrer" : undefined} className={className}>
      {children}
    </a>
  )
}

function RevealCard({ value, path, href, icon, label, isEditing, cardClass }: { value: string; path: string; href: string; icon: ReactNode; label: string; isEditing: boolean; cardClass: string }) {
  const [revealed, setRevealed] = useState(false)

  if (isEditing) {
    return (
      <div className={cardClass}>
        <div className="mb-3">{icon}</div>
        <p className="text-sm text-slate-400 mb-1">{label}</p>
        <EditableText value={value} path={path} as="p" className="text-white font-medium" />
      </div>
    )
  }

  if (!revealed) {
    return (
      <button onClick={() => setRevealed(true)} className={`${cardClass} text-left cursor-pointer`}>
        <div className="mb-3">{icon}</div>
        <p className="text-sm text-slate-400 mb-1">{label}</p>
        <p className="text-blue-400 font-medium">Click to Reveal</p>
      </button>
    )
  }

  return (
    <div className={cardClass}>
      <div className="mb-3">{icon}</div>
      <p className="text-sm text-slate-400 mb-1">{label}</p>
      <a href={href} className="text-white font-medium hover:text-blue-400 transition-colors animate-[revealIn_0.4s_ease-out]">
        {value}
      </a>
    </div>
  )
}

// SVG icons for contact cards
const EmailIcon = () => (
  <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
)

const PhoneIcon = () => (
  <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
)

const LocationIcon = () => (
  <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
)

export default function Contact() {
  const { data, isEditing, addItem, removeItem, updateField } = useResumeContext()
  const { contact } = data
  const initialized = useRef(false)
  const { ref: animRef, visible } = useScrollAnimation()

  // Backward compat: migrate old github/linkedin fields to socials array
  const socials = contact.socials ?? [
    ...(contact.github ? [{ label: "GitHub", url: `https://${contact.github}` }] : []),
    ...(contact.linkedin ? [{ label: "LinkedIn", url: `https://${contact.linkedin}` }] : []),
  ]

  // When entering edit mode, ensure contact.socials exists in data
  useEffect(() => {
    if (isEditing && !contact.socials && !initialized.current) {
      initialized.current = true
      updateField("contact.socials", socials)
    }
    if (!isEditing) {
      initialized.current = false
    }
  }, [isEditing, contact.socials, socials, updateField])

  const cardClass =
    "group p-6 rounded-2xl bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1"
  const socialBtnClass =
    "px-6 py-3 rounded-full border border-white/20 hover:border-blue-400 hover:text-blue-400 transition-all hover:scale-105 hover:shadow-md hover:shadow-blue-500/10"

  return (
    <section
      id="contact"
      className="min-h-screen snap-start py-20 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col justify-center"
    >
      <div ref={animRef} className={`max-w-5xl mx-auto w-full transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          {/* Left — heading + description + social links */}
          <div className="lg:w-2/5 lg:sticky lg:top-24">
            <h2 className="text-3xl font-bold mb-2">Get In Touch</h2>
            <div className="w-12 h-1 bg-blue-500 rounded mb-6" />
            <p className="text-slate-300 text-lg mb-8">
              I'm always open to new opportunities and interesting projects. Feel
              free to reach out!
            </p>

            {/* Social links */}
            <div className="flex flex-wrap gap-3">
              {socials.map((social, i) =>
                isEditing ? (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`${socialBtnClass} flex items-center gap-3 cursor-default`}>
                      <EditableText
                        value={social.label}
                        path={`contact.socials.${i}.label`}
                        as="span"
                        className="text-white"
                      />
                      <span className="text-slate-500">|</span>
                      <EditableText
                        value={social.url}
                        path={`contact.socials.${i}.url`}
                        as="span"
                        className="text-blue-300 text-sm"
                      />
                    </div>
                    <RemoveButton onClick={() => removeItem("contact.socials", i)} />
                  </div>
                ) : (
                  <a
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={socialBtnClass}
                  >
                    {social.label}
                  </a>
                )
              )}

              {isEditing && (
                <AddButton
                  onClick={() =>
                    addItem("contact.socials", { label: "New Link", url: "https://" })
                  }
                  label="Add link"
                />
              )}
            </div>
          </div>

          {/* Right — contact cards */}
          <div className="lg:w-3/5 grid sm:grid-cols-2 gap-5 w-full">
            <RevealCard
              value={contact.email}
              path="contact.email"
              href={`mailto:${contact.email}`}
              icon={<EmailIcon />}
              label="Email"
              isEditing={isEditing}
              cardClass={cardClass}
            />

            <RevealCard
              value={contact.phone}
              path="contact.phone"
              href={`tel:${contact.phone}`}
              icon={<PhoneIcon />}
              label="Phone"
              isEditing={isEditing}
              cardClass={cardClass}
            />

            <ContactCard
              href={`https://maps.google.com/?q=${contact.location}`}
              isEditing={isEditing}
              className={`${cardClass} sm:col-span-2`}
              target="_blank"
            >
              <LocationIcon />
              <div className="mt-3">
                <p className="text-sm text-slate-400 mb-1">Location</p>
                <EditableText
                  value={contact.location}
                  path="contact.location"
                  as="p"
                  className="text-white font-medium"
                />
              </div>
            </ContactCard>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-5xl mx-auto w-full mt-20 pt-8 border-t border-white/10 text-center text-sm text-slate-500">
        <p>
          &copy; {new Date().getFullYear()} {data.name}. Built with React &
          Tailwind CSS.
        </p>
      </div>
    </section>
  )
}
