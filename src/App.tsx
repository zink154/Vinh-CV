import { useState, useCallback, lazy, Suspense } from "react"
import { useAuth } from "./hooks/useAuth"
import { useResume } from "./hooks/useResume"
import { useDarkMode } from "./hooks/useDarkMode"
import { ResumeProvider } from "./context/ResumeContext"
import type { ResumeData } from "./data/resume"
import Hero from "./components/Hero"
import AdminBar from "./components/AdminBar"
import Navbar from "./components/Navbar"
import DotNav from "./components/DotNav"

const Experience = lazy(() => import("./components/Experience"))
const Projects = lazy(() => import("./components/Projects"))
const Skills = lazy(() => import("./components/Skills"))
const Education = lazy(() => import("./components/Education"))
const Contact = lazy(() => import("./components/Contact"))

function SectionSkeleton() {
  return (
    <div className="min-h-screen snap-start flex items-center justify-center bg-white dark:bg-slate-900">
      <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function getNestedValue(obj: Record<string, unknown>, keys: string[]): unknown {
  let current: unknown = obj
  for (const key of keys) {
    current = (current as Record<string, unknown>)[key]
  }
  return current
}

function setNestedValue(obj: ResumeData, path: string, value: unknown): ResumeData {
  const clone = JSON.parse(JSON.stringify(obj))
  const keys = path.split(".")
  let current: Record<string, unknown> = clone

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    const nextKey = keys[i + 1]
    if (current[key] === undefined) {
      current[key] = isNaN(Number(nextKey)) ? {} : []
    }
    current = current[key] as Record<string, unknown>
  }

  current[keys[keys.length - 1]] = value
  return clone
}

function addToArray(obj: ResumeData, path: string, defaultValue: unknown): ResumeData {
  const clone = JSON.parse(JSON.stringify(obj))
  const keys = path.split(".")
  const arr = getNestedValue(clone, keys) as unknown[]
  arr.push(defaultValue)
  return clone
}

function removeFromArray(obj: ResumeData, path: string, index: number): ResumeData {
  const clone = JSON.parse(JSON.stringify(obj))
  const keys = path.split(".")
  const arr = getNestedValue(clone, keys) as unknown[]
  arr.splice(index, 1)
  return clone
}

function reorderArray(obj: ResumeData, path: string, fromIndex: number, toIndex: number): ResumeData {
  const clone = JSON.parse(JSON.stringify(obj))
  const keys = path.split(".")
  const arr = getNestedValue(clone, keys) as unknown[]
  const [item] = arr.splice(fromIndex, 1)
  arr.splice(toIndex, 0, item)
  return clone
}

function App() {
  const { user } = useAuth()
  const { data, loading, saveResume } = useResume()
  const { dark, toggle: toggleDark } = useDarkMode()
  const [localData, setLocalData] = useState<ResumeData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const currentData = localData ?? data

  const handleUpdate = useCallback(
    (path: string, value: unknown) => {
      setLocalData((prev) => setNestedValue(prev ?? data, path, value))
    },
    [data]
  )

  const handleAddItem = useCallback(
    (path: string, defaultValue: unknown) => {
      setLocalData((prev) => addToArray(prev ?? data, path, defaultValue))
    },
    [data]
  )

  const handleRemoveItem = useCallback(
    (path: string, index: number) => {
      setLocalData((prev) => removeFromArray(prev ?? data, path, index))
    },
    [data]
  )

  const handleReorderItems = useCallback(
    (path: string, fromIndex: number, toIndex: number) => {
      setLocalData((prev) => reorderArray(prev ?? data, path, fromIndex, toIndex))
    },
    [data]
  )

  const handleSave = async () => {
    if (!localData) return
    setSaving(true)
    try {
      await saveResume(localData)
      setLocalData(null)
      setIsEditing(false)
    } catch {
      alert("Failed to save. Check console for details.")
    }
    setSaving(false)
  }

  const handleToggleEdit = () => {
    if (isEditing) {
      setLocalData(null)
    }
    setIsEditing(!isEditing)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <ResumeProvider
      data={currentData}
      isEditing={isEditing}
      user={user}
      onUpdate={handleUpdate}
      onAddItem={handleAddItem}
      onRemoveItem={handleRemoveItem}
      onReorderItems={handleReorderItems}
    >
      <a href="#hero" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-blue-500 focus:text-white focus:rounded-lg focus:text-sm">
        Skip to content
      </a>
      <Navbar dark={dark} onToggleDark={toggleDark} hasAdminBar={!!user} />
      <DotNav />
      <div className={`h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth bg-white dark:bg-slate-900 ${isEditing ? "pt-12" : ""}`}>
        <AdminBar
          isEditing={isEditing}
          onToggleEdit={handleToggleEdit}
          onSave={handleSave}
          saving={saving}
        />
        <Hero />
        <Suspense fallback={<SectionSkeleton />}><Experience /></Suspense>
        <Suspense fallback={<SectionSkeleton />}><Projects /></Suspense>
        <Suspense fallback={<SectionSkeleton />}><Skills /></Suspense>
        <Suspense fallback={<SectionSkeleton />}><Education /></Suspense>
        <Suspense fallback={<SectionSkeleton />}><Contact /></Suspense>
      </div>
    </ResumeProvider>
  )
}

export default App
