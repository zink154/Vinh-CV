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
      <div ref={animRef} className="max-w-4xl mx-auto w-full">
        {/* Header — fades in immediately */}
        <div className={`transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Experience</h2>
          <div className="w-12 h-1 bg-blue-500 rounded mb-12" />
        </div>

        <div className="relative">
          {/* Timeline line — gradient */}
          <div className="absolute left-[19px] md:left-[39px] top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/40 via-blue-300/20 to-transparent dark:from-blue-400/40 dark:via-blue-500/15" />

          {isEditing ? (
            <SortableList
              items={expIds}
              onReorder={(from, to) => reorderItems("experience", from, to)}
            >
              <div className="space-y-8">
                {data.experience.map((exp, i) => (
                  <SortableItem key={expIds[i]} id={expIds[i]} showHandle>
                    <div className="relative pl-12 md:pl-20">
                      <TimelineDot visible={visible} />
                      <ExperienceCard exp={exp} index={i} isEditing visible delay={0} />
                    </div>
                  </SortableItem>
                ))}
              </div>
            </SortableList>
          ) : (
            <div className="space-y-8">
              {data.experience.map((exp, i) => (
                <div key={i} className="relative pl-12 md:pl-20">
                  <TimelineDot visible={visible} />
                  <ExperienceCard exp={exp} index={i} isEditing={false} visible={visible} delay={i * 150} />
                </div>
              ))}
            </div>
          )}
        </div>

        {isEditing && (
          <div className="mt-8 pl-12 md:pl-20">
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

function TimelineDot({ visible }: { visible: boolean }) {
  return (
    <div className="absolute left-3.5 md:left-8.5 top-8 z-10 flex items-center justify-center">
      {/* Pulse ring — only animates when visible */}
      <div
        className={`absolute w-4 h-4 rounded-full bg-blue-400/40 dark:bg-blue-500/40 ${visible ? "animate-[pulse-ring_2s_ease-out_infinite]" : ""}`}
      />
      {/* Core dot */}
      <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 shadow-md shadow-blue-500/30 ring-[3px] ring-white dark:ring-slate-900" />
    </div>
  )
}

function ExperienceCard({
  exp,
  index: i,
  isEditing,
  visible,
  delay,
}: {
  exp: { company: string; position: string; period: string; description: string[] }
  index: number
  isEditing: boolean
  visible: boolean
  delay: number
}) {
  const { addItem, removeItem, reorderItems } = useResumeContext()
  const bulletIds = exp.description.map((_, j) => `exp-${i}-bullet-${j}`)

  return (
    <article
      className={`group p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-800/50 shadow-sm hover:shadow-lg hover:shadow-blue-500/5 dark:hover:shadow-blue-500/10 hover:border-blue-300/50 dark:hover:border-blue-500/30 hover:-translate-y-0.5 transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {isEditing && (
        <div className="flex justify-end mb-2">
          <RemoveButton onClick={() => removeItem("experience", i)} />
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
        <EditableText
          value={exp.position}
          path={`experience.${i}.position`}
          as="h3"
          className="text-xl font-semibold text-slate-900 dark:text-white"
        />
        <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300 ring-1 ring-blue-200/50 dark:ring-blue-700/50 whitespace-nowrap w-fit">
          <EditableText
            value={exp.period}
            path={`experience.${i}.period`}
            as="span"
          />
        </span>
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
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-400/60 dark:bg-blue-500/60 shrink-0" />
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
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-400/60 dark:bg-blue-500/60 shrink-0" />
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
    </article>
  )
}
