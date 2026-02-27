import { useResumeContext } from "../context/ResumeContext"
import EditableText from "./EditableText"
import { AddButton, RemoveButton } from "./EditButtons"
import SortableList from "./SortableList"
import SortableItem from "./SortableItem"
import { useScrollAnimation } from "../hooks/useScrollAnimation"

export default function Experience() {
  const { data, isEditing, addItem, reorderItems } = useResumeContext()
  const { ref: animRef, visible } = useScrollAnimation()

  const expIds = data.experience.map((_, i) => `exp-${i}`)

  return (
    <section id="experience" className="min-h-screen snap-start py-20 px-6 bg-white dark:bg-slate-900 flex items-center">
      <div ref={animRef} className={`max-w-4xl mx-auto w-full transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Experience</h2>
        <div className="w-12 h-1 bg-blue-500 rounded mb-12" />

        <div className="relative">
          <div className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-700" />

          {isEditing ? (
            <SortableList
              items={expIds}
              onReorder={(from, to) => reorderItems("experience", from, to)}
            >
              <div className="space-y-12">
                {data.experience.map((exp, i) => (
                  <SortableItem key={expIds[i]} id={expIds[i]} showHandle>
                    <div className="relative pl-8 md:pl-20">
                      <div className="absolute left-0 md:left-8 top-1 w-3 h-3 -translate-x-[5px] rounded-full bg-blue-500 ring-4 ring-blue-50 dark:ring-slate-900" />
                      <ExperienceCard exp={exp} index={i} isEditing />
                    </div>
                  </SortableItem>
                ))}
              </div>
            </SortableList>
          ) : (
            <div className="space-y-12">
              {data.experience.map((exp, i) => (
                <div key={i} className="relative pl-8 md:pl-20">
                  <div className="absolute left-0 md:left-8 top-1 w-3 h-3 -translate-x-[5px] rounded-full bg-blue-500 ring-4 ring-blue-50 dark:ring-slate-900" />
                  <ExperienceCard exp={exp} index={i} isEditing={false} />
                </div>
              ))}
            </div>
          )}
        </div>

        {isEditing && (
          <div className="mt-8 pl-8 md:pl-20">
            <AddButton
              onClick={() =>
                addItem("experience", {
                  company: "Company Name",
                  position: "Position Title",
                  period: "2024 - Present",
                  description: ["Describe your role and achievements"],
                })
              }
              label="Add experience"
            />
          </div>
        )}
      </div>
    </section>
  )
}

function ExperienceCard({
  exp,
  index: i,
  isEditing,
}: {
  exp: { company: string; position: string; period: string; description: string[] }
  index: number
  isEditing: boolean
}) {
  const { addItem, removeItem, reorderItems } = useResumeContext()
  const bulletIds = exp.description.map((_, j) => `exp-${i}-bullet-${j}`)

  return (
    <div className="group p-6 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
      {isEditing && (
        <div className="flex justify-end mb-2">
          <RemoveButton onClick={() => removeItem("experience", i)} />
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
        <EditableText
          value={exp.position}
          path={`experience.${i}.position`}
          as="h3"
          className="text-xl font-semibold text-slate-900 dark:text-white"
        />
        <EditableText
          value={exp.period}
          path={`experience.${i}.period`}
          as="span"
          className="text-sm text-slate-500 dark:text-slate-400 font-medium"
        />
      </div>

      <EditableText
        value={exp.company}
        path={`experience.${i}.company`}
        as="p"
        className="text-blue-600 dark:text-blue-400 font-medium mb-4"
      />

      {isEditing ? (
        <SortableList
          items={bulletIds}
          onReorder={(from, to) => reorderItems(`experience.${i}.description`, from, to)}
        >
          <ul className="space-y-2">
            {exp.description.map((desc, j) => (
              <SortableItem key={bulletIds[j]} id={bulletIds[j]} showHandle>
                <li className="text-slate-600 dark:text-slate-300 flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />
                  <EditableText
                    value={desc}
                    path={`experience.${i}.description.${j}`}
                    as="span"
                    className="flex-1"
                  />
                  <RemoveButton onClick={() => removeItem(`experience.${i}.description`, j)} />
                </li>
              </SortableItem>
            ))}
          </ul>
        </SortableList>
      ) : (
        <ul className="space-y-2">
          {exp.description.map((desc, j) => (
            <li key={j} className="text-slate-600 dark:text-slate-300 flex items-start gap-3">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />
              <EditableText
                value={desc}
                path={`experience.${i}.description.${j}`}
                as="span"
                className="flex-1"
              />
            </li>
          ))}
        </ul>
      )}

      {isEditing && (
        <div className="mt-3">
          <AddButton
            onClick={() => addItem(`experience.${i}.description`, "New description")}
            label="Add bullet"
          />
        </div>
      )}
    </div>
  )
}
