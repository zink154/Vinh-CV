import { useResumeContext } from "../context/ResumeContext"
import EditableText from "./EditableText"
import { AddButton, RemoveButton } from "./EditButtons"
import SortableList from "./SortableList"
import SortableItem from "./SortableItem"
import { useScrollAnimation } from "../hooks/useScrollAnimation"

export default function Skills() {
  const { data, isEditing, addItem, removeItem, reorderItems } = useResumeContext()
  const { ref: animRef, visible } = useScrollAnimation()

  const colors = [
    "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:ring-blue-700",
    "bg-teal-50 text-teal-700 ring-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:ring-teal-700",
    "bg-purple-50 text-purple-700 ring-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:ring-purple-700",
    "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:ring-amber-700",
  ]

  const categoryIds = data.skills.map((_, i) => `skill-cat-${i}`)

  const content = (
    <div className="grid md:grid-cols-2 gap-8">
      {data.skills.map((group, i) => (
        <SortableItem key={categoryIds[i]} id={categoryIds[i]} showHandle={isEditing}>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <EditableText
                value={group.category}
                path={`skills.${i}.category`}
                as="h3"
                className="text-lg font-semibold text-slate-800 dark:text-slate-100"
              />
              {isEditing && (
                <RemoveButton onClick={() => removeItem("skills", i)} />
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {group.items.map((skill, j) => (
                <div key={j} className="flex items-center gap-1">
                  <EditableText
                    value={skill}
                    path={`skills.${i}.items.${j}`}
                    as="span"
                    className={`px-4 py-2 rounded-full text-sm font-medium ring-1 transition-transform hover:scale-105 ${colors[i % colors.length]}`}
                  />
                  {isEditing && (
                    <RemoveButton onClick={() => removeItem(`skills.${i}.items`, j)} />
                  )}
                </div>
              ))}
              {isEditing && (
                <AddButton
                  onClick={() => addItem(`skills.${i}.items`, "New Skill")}
                  label="Add"
                />
              )}
            </div>
          </div>
        </SortableItem>
      ))}
    </div>
  )

  return (
    <section id="skills" className="min-h-screen snap-start py-20 px-6 bg-white dark:bg-slate-900 flex items-center">
      <div ref={animRef} className={`max-w-4xl mx-auto w-full transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Skills</h2>
        <div className="w-12 h-1 bg-blue-500 rounded mb-12" />

        {isEditing ? (
          <SortableList
            items={categoryIds}
            onReorder={(from, to) => reorderItems("skills", from, to)}
          >
            {content}
          </SortableList>
        ) : (
          content
        )}

        {isEditing && (
          <div className="mt-8">
            <AddButton
              onClick={() =>
                addItem("skills", { category: "New Category", items: ["Skill 1"] })
              }
              label="Add category"
            />
          </div>
        )}
      </div>
    </section>
  )
}
