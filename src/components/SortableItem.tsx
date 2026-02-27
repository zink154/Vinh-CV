import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { ReactNode } from "react"

export default function SortableItem({
  id,
  children,
  showHandle,
}: {
  id: string
  children: ReactNode
  showHandle?: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {showHandle && (
        <button
          {...attributes}
          {...listeners}
          className="absolute -left-7 top-1/2 -translate-y-1/2 w-5 h-8 flex flex-col items-center justify-center gap-0.5 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400 transition-colors"
          title="Drag to reorder"
        >
          <span className="w-3 h-0.5 bg-current rounded" />
          <span className="w-3 h-0.5 bg-current rounded" />
          <span className="w-3 h-0.5 bg-current rounded" />
        </button>
      )}
      {children}
    </div>
  )
}
