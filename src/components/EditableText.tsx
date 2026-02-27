import { useState, useRef, useEffect } from "react"
import { useResumeContext } from "../context/ResumeContext"

interface EditableTextProps {
  value: string
  path: string
  as?: "p" | "h1" | "h2" | "h3" | "span" | "li"
  className?: string
  multiline?: boolean
}

export default function EditableText({
  value,
  path,
  as: Tag = "p",
  className = "",
  multiline = false,
}: EditableTextProps) {
  const { isEditing, updateField } = useResumeContext()
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(value)
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null)

  useEffect(() => {
    setText(value)
  }, [value])

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [editing])

  if (!isEditing) {
    return <Tag className={className}>{value}</Tag>
  }

  if (editing) {
    const sharedClass =
      "w-full bg-white/90 dark:bg-slate-800/90 border-2 border-blue-400 rounded-lg px-3 py-2 text-inherit font-inherit outline-none focus:border-blue-500 " +
      className

    const handleSave = () => {
      updateField(path, text)
      setEditing(false)
    }

    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Escape") setEditing(false)
          }}
          rows={3}
          className={sharedClass + " resize-y"}
        />
      )
    }

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave()
          if (e.key === "Escape") setEditing(false)
        }}
        className={sharedClass}
      />
    )
  }

  return (
    <Tag
      className={`${className} cursor-pointer ring-2 ring-blue-300/50 ring-offset-2 dark:ring-offset-slate-900 rounded px-1 hover:ring-blue-400 transition-all`}
      onClick={() => setEditing(true)}
      title="Click to edit"
    >
      {value}
    </Tag>
  )
}
