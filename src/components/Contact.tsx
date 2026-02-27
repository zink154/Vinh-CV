import { useEffect, useRef } from "react"
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

  const cardClass = "p-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:scale-105"
  const socialBtnClass = "px-6 py-3 rounded-full border border-white/20 hover:border-blue-400 hover:text-blue-400 transition-all hover:scale-105"

  return (
    <section
      id="contact"
      className="min-h-screen snap-start py-20 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col justify-center"
    >
      <div ref={animRef} className={`max-w-4xl mx-auto text-center transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <h2 className="text-3xl font-bold mb-2">Get In Touch</h2>
        <div className="w-12 h-1 bg-blue-500 rounded mx-auto mb-8" />

        <p className="text-slate-300 text-lg mb-12 max-w-xl mx-auto">
          I'm always open to new opportunities and interesting projects. Feel
          free to reach out!
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <ContactCard href={`mailto:${contact.email}`} isEditing={isEditing} className={cardClass}>
            <div className="text-2xl mb-3">@</div>
            <p className="text-sm text-slate-400 mb-1">Email</p>
            <EditableText
              value={contact.email}
              path="contact.email"
              as="p"
              className="text-white font-medium"
            />
          </ContactCard>

          <ContactCard href={`tel:${contact.phone}`} isEditing={isEditing} className={cardClass}>
            <div className="text-2xl mb-3">P</div>
            <p className="text-sm text-slate-400 mb-1">Phone</p>
            <EditableText
              value={contact.phone}
              path="contact.phone"
              as="p"
              className="text-white font-medium"
            />
          </ContactCard>

          <ContactCard
            href={`https://maps.google.com/?q=${contact.location}`}
            isEditing={isEditing}
            className={`${cardClass} sm:col-span-2 lg:col-span-1`}
            target="_blank"
          >
            <div className="text-2xl mb-3">L</div>
            <p className="text-sm text-slate-400 mb-1">Location</p>
            <EditableText
              value={contact.location}
              path="contact.location"
              as="p"
              className="text-white font-medium"
            />
          </ContactCard>
        </div>

        {/* Social links */}
        <div className="flex flex-wrap justify-center gap-4">
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

      {/* Footer */}
      <div className="mt-20 pt-8 border-t border-white/10 text-center text-sm text-slate-500">
        <p>
          &copy; {new Date().getFullYear()} {data.name}. Built with React &
          Tailwind CSS.
        </p>
      </div>
    </section>
  )
}
