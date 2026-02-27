import { useResumeContext } from "../context/ResumeContext"
import EditableText from "./EditableText"
import { AddButton, RemoveButton } from "./EditButtons"
import SortableList from "./SortableList"
import SortableItem from "./SortableItem"
import { useScrollAnimation } from "../hooks/useScrollAnimation"

export default function Projects() {
  const { data, isEditing, addItem, removeItem, reorderItems, updateField } = useResumeContext()
  const { ref: animRef, visible } = useScrollAnimation()

  const projectIds = data.projects.map((_, i) => `proj-${i}`)

  return (
    <section id="projects" className="min-h-screen snap-start py-20 px-6 bg-slate-50 dark:bg-slate-900 flex items-center">
      <div ref={animRef} className={`max-w-5xl mx-auto w-full transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Projects</h2>
        <div className="w-12 h-1 bg-blue-500 rounded mb-12" />

        {isEditing ? (
          <SortableList
            items={projectIds}
            onReorder={(from, to) => reorderItems("projects", from, to)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.projects.map((project, i) => (
                <SortableItem key={projectIds[i]} id={projectIds[i]} showHandle>
                  <ProjectCard project={project} index={i} isEditing onRemove={() => removeItem("projects", i)} onUpdateTech={(tech) => updateField(`projects.${i}.tech`, tech)} />
                </SortableItem>
              ))}
            </div>
          </SortableList>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.projects.map((project, i) => (
              <ProjectCard key={i} project={project} index={i} isEditing={false} />
            ))}
          </div>
        )}

        {isEditing && (
          <div className="mt-8">
            <AddButton
              onClick={() =>
                addItem("projects", {
                  name: "Project Name",
                  description: "Describe your project here.",
                  tech: ["React"],
                  demo: "",
                  github: "",
                })
              }
              label="Add project"
            />
          </div>
        )}
      </div>
    </section>
  )
}

function ProjectCard({
  project,
  index: i,
  isEditing,
  onRemove,
  onUpdateTech,
}: {
  project: { name: string; description: string; tech: string[]; demo?: string; github?: string }
  index: number
  isEditing: boolean
  onRemove?: () => void
  onUpdateTech?: (tech: string[]) => void
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-100 dark:border-slate-700 flex flex-col">
      {isEditing && onRemove && (
        <div className="flex justify-end mb-2">
          <RemoveButton onClick={onRemove} />
        </div>
      )}

      <EditableText
        value={project.name}
        path={`projects.${i}.name`}
        as="h3"
        className="text-lg font-semibold text-slate-900 dark:text-white mb-2"
      />

      <EditableText
        value={project.description}
        path={`projects.${i}.description`}
        as="p"
        className="text-slate-600 dark:text-slate-300 text-sm mb-4 flex-1"
      />

      {/* Tech tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tech.map((t, j) => (
          <span
            key={j}
            className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
          >
            {t}
          </span>
        ))}
      </div>

      {isEditing && onUpdateTech && (
        <div className="mb-4">
          <input
            type="text"
            defaultValue={project.tech.join(", ")}
            onBlur={(e) => onUpdateTech(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
            placeholder="Tech (comma separated)"
            className="w-full text-xs px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      )}

      {/* Links */}
      <div className="flex gap-4 mt-auto">
        {isEditing ? (
          <>
            <EditableText value={project.demo || "Demo URL"} path={`projects.${i}.demo`} as="span" className="text-xs text-blue-600 dark:text-blue-400" />
            <EditableText value={project.github || "GitHub URL"} path={`projects.${i}.github`} as="span" className="text-xs text-blue-600 dark:text-blue-400" />
          </>
        ) : (
          <>
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" /><path strokeLinecap="round" strokeLinejoin="round" d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                Demo
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:underline flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795 .945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                GitHub
              </a>
            )}
          </>
        )}
      </div>
    </div>
  )
}
