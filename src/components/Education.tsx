import { useResumeContext } from "../context/ResumeContext"
import EditableText from "./EditableText"
import { AddButton, RemoveButton } from "./EditButtons"
import SortableList from "./SortableList"
import SortableItem from "./SortableItem"
import { useScrollAnimation } from "../hooks/useScrollAnimation"

function GraduationCapIcon() {
  return (
    <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15v-3.75m0 0h-.008v.008H6.75V11.25Z" />
    </svg>
  )
}

function EducationCard({
  edu,
  index: i,
  isEditing,
  visible,
  delay,
}: {
  edu: { degree: string; school: string; period: string; description?: string }
  index: number
  isEditing: boolean
  visible: boolean
  delay: number
}) {
  const { removeItem } = useResumeContext()

  return (
    <article
      className={`group p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-800/50 shadow-sm hover:shadow-lg hover:shadow-blue-500/5 dark:hover:shadow-blue-500/10 hover:border-blue-300/50 dark:hover:border-blue-500/30 hover:-translate-y-0.5 transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {isEditing && (
        <div className="flex justify-end mb-2">
          <RemoveButton onClick={() => removeItem("education", i)} />
        </div>
      )}

      <div className="flex items-start gap-4 mb-3">
        <div className="shrink-0 mt-0.5">
          <GraduationCapIcon />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-1">
            <EditableText
              value={edu.degree}
              path={`education.${i}.degree`}
              as="h3"
              className="text-lg font-semibold text-slate-900 dark:text-white"
            />
            <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300 ring-1 ring-blue-200/50 dark:ring-blue-700/50 whitespace-nowrap w-fit shrink-0">
              <EditableText
                value={edu.period}
                path={`education.${i}.period`}
                as="span"
              />
            </span>
          </div>
          <EditableText
            value={edu.school}
            path={`education.${i}.school`}
            as="p"
            className="text-blue-600 dark:text-blue-400 font-medium"
          />
        </div>
      </div>

      {edu.description && (
        <div className="pl-12">
          <EditableText
            value={edu.description}
            path={`education.${i}.description`}
            as="p"
            className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed"
          />
        </div>
      )}
    </article>
  )
}

export default function Education() {
  const { data, isEditing, addItem, reorderItems } = useResumeContext()
  const { ref: animRef, visible } = useScrollAnimation()

  const eduIds = data.education.map((_, i) => `edu-${i}`)

  const cards = data.education.map((edu, i) => (
    <SortableItem key={eduIds[i]} id={eduIds[i]} showHandle={isEditing}>
      <EducationCard
        edu={edu}
        index={i}
        isEditing={isEditing}
        visible={visible}
        delay={i * 150}
      />
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
            <div className="grid md:grid-cols-2 gap-6">{cards}</div>
          </SortableList>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">{cards}</div>
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
