import { useResumeContext } from "../context/ResumeContext"
import EditableText from "./EditableText"
import { AddButton, RemoveButton } from "./EditButtons"
import SortableList from "./SortableList"
import SortableItem from "./SortableItem"
import { useScrollAnimation } from "../hooks/useScrollAnimation"

export default function Education() {
  const { data, isEditing, addItem, removeItem, reorderItems } = useResumeContext()
  const { ref: animRef, visible } = useScrollAnimation()

  const eduIds = data.education.map((_, i) => `edu-${i}`)

  const cards = data.education.map((edu, i) => (
    <SortableItem key={eduIds[i]} id={eduIds[i]} showHandle={isEditing}>
      <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        {isEditing && (
          <div className="flex justify-end mb-2">
            <RemoveButton onClick={() => removeItem("education", i)} />
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
          <EditableText
            value={edu.degree}
            path={`education.${i}.degree`}
            as="h3"
            className="text-xl font-semibold text-slate-900 dark:text-white"
          />
          <EditableText
            value={edu.period}
            path={`education.${i}.period`}
            as="span"
            className="text-sm text-slate-500 dark:text-slate-400 font-medium"
          />
        </div>
        <EditableText
          value={edu.school}
          path={`education.${i}.school`}
          as="p"
          className="text-blue-600 dark:text-blue-400 font-medium"
        />
        {edu.description && (
          <EditableText
            value={edu.description}
            path={`education.${i}.description`}
            as="p"
            className="text-slate-600 dark:text-slate-300 mt-2"
          />
        )}
      </div>
    </SortableItem>
  ))

  return (
    <section id="education" className="min-h-screen snap-start py-20 px-6 bg-slate-50 dark:bg-slate-900 flex items-center">
      <div ref={animRef} className={`max-w-4xl mx-auto w-full transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Education</h2>
        <div className="w-12 h-1 bg-blue-500 rounded mb-12" />

        {isEditing ? (
          <SortableList
            items={eduIds}
            onReorder={(from, to) => reorderItems("education", from, to)}
          >
            <div className="space-y-6">{cards}</div>
          </SortableList>
        ) : (
          <div className="space-y-6">{cards}</div>
        )}

        {isEditing && (
          <div className="mt-6">
            <AddButton
              onClick={() =>
                addItem("education", {
                  school: "School Name",
                  degree: "Degree Title",
                  period: "2020 - 2024",
                  description: "Description",
                })
              }
              label="Add education"
            />
          </div>
        )}
      </div>
    </section>
  )
}
