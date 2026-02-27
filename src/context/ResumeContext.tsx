import { createContext, useContext } from "react"
import type { ReactNode } from "react"
import type { ResumeData } from "../data/resume"
import type { User } from "firebase/auth"

interface ResumeContextType {
  data: ResumeData
  isEditing: boolean
  user: User | null
  updateField: (path: string, value: unknown) => void
  addItem: (path: string, defaultValue: unknown) => void
  removeItem: (path: string, index: number) => void
  reorderItems: (path: string, fromIndex: number, toIndex: number) => void
}

const ResumeContext = createContext<ResumeContextType | null>(null)

export function ResumeProvider({
  children,
  data,
  isEditing,
  user,
  onUpdate,
  onAddItem,
  onRemoveItem,
  onReorderItems,
}: {
  children: ReactNode
  data: ResumeData
  isEditing: boolean
  user: User | null
  onUpdate: (path: string, value: unknown) => void
  onAddItem: (path: string, defaultValue: unknown) => void
  onRemoveItem: (path: string, index: number) => void
  onReorderItems: (path: string, fromIndex: number, toIndex: number) => void
}) {
  return (
    <ResumeContext.Provider
      value={{
        data,
        isEditing,
        user,
        updateField: onUpdate,
        addItem: onAddItem,
        removeItem: onRemoveItem,
        reorderItems: onReorderItems,
      }}
    >
      {children}
    </ResumeContext.Provider>
  )
}

export function useResumeContext() {
  const ctx = useContext(ResumeContext)
  if (!ctx) throw new Error("useResumeContext must be inside ResumeProvider")
  return ctx
}
