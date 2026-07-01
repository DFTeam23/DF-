import { useState } from 'react'
import { useApp } from '../context/AppContext'
import TaskCard from './TaskCard'
import { IconPlus } from './icons'
import { classNames } from '../utils/helpers'

export default function BoardView({ project, query, onOpenTask, onStartFocus }) {
  const { state, dispatch } = useApp()
  const [dragId, setDragId] = useState(null)
  const [dragOver, setDragOver] = useState(null) // { sectionId, beforeTaskId }
  const [addingIn, setAddingIn] = useState(null)
  const [newTitle, setNewTitle] = useState('')

  const q = query.trim().toLowerCase()

  const tasksFor = (sectionId) =>
    state.tasks
      .filter((t) => t.projectId === project.id && t.sectionId === sectionId)
      .filter((t) => !q || t.title.toLowerCase().includes(q))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  const handleDrop = (sectionId, beforeTaskId) => {
    if (!dragId) return
    dispatch({ type: 'MOVE_TASK', taskId: dragId, sectionId, beforeTaskId })
    setDragId(null)
    setDragOver(null)
  }

  const submitNew = (e, sectionId) => {
    e.preventDefault()
    if (!newTitle.trim()) {
      setAddingIn(null)
      return
    }
    dispatch({
      type: 'ADD_TASK',
      projectId: project.id,
      sectionId,
      title: newTitle,
      priority: 'medium',
    })
    setNewTitle('')
  }

  const addSection = () => {
    const name = window.prompt('New section name')
    if (name && name.trim()) {
      dispatch({ type: 'ADD_SECTION', projectId: project.id, name: name.trim() })
    }
  }

  return (
    <div className="df-scroll h-full overflow-x-auto p-4 md:p-6">
      <div className="flex h-full min-h-0 items-start gap-4">
        {project.sections.map((section) => {
          const tasks = tasksFor(section.id)
          const isEmptyDrop = dragOver?.sectionId === section.id && dragOver?.beforeTaskId === null
          return (
            <section
              key={section.id}
              className="flex max-h-full w-72 shrink-0 flex-col rounded-2xl bg-ink-900/50"
              aria-label={section.name}
            >
              <div className="flex items-center justify-between px-3 py-3">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-ink-100">
                  {section.name}
                  <span className="rounded-full bg-ink-700/60 px-1.5 py-0.5 text-[11px] font-medium text-ink-400">
                    {tasks.length}
                  </span>
                </h2>
              </div>

              <div
                className="df-scroll flex min-h-[80px] flex-1 flex-col gap-2 overflow-y-auto px-3 pb-3"
                onDragOver={(e) => {
                  e.preventDefault()
                  if (tasks.length === 0) setDragOver({ sectionId: section.id, beforeTaskId: null })
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  handleDrop(section.id, dragOver?.beforeTaskId ?? null)
                }}
              >
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    onDragOver={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setDragOver({ sectionId: section.id, beforeTaskId: task.id })
                    }}
                    className={classNames(
                      'rounded-xl transition',
                      dragOver?.sectionId === section.id && dragOver?.beforeTaskId === task.id
                        ? 'border-t-2 border-focus-500 pt-1'
                        : '',
                    )}
                  >
                    <TaskCard
                      task={task}
                      onOpen={onOpenTask}
                      onStartFocus={onStartFocus}
                      dragProps={{
                        draggable: true,
                        onDragStart: () => setDragId(task.id),
                        onDragEnd: () => {
                          setDragId(null)
                          setDragOver(null)
                        },
                        'aria-grabbed': dragId === task.id,
                      }}
                    />
                  </div>
                ))}

                {isEmptyDrop && (
                  <div className="rounded-xl border-2 border-dashed border-focus-500/60 py-6 text-center text-xs text-focus-400">
                    Drop here
                  </div>
                )}

                {addingIn === section.id ? (
                  <form onSubmit={(e) => submitNew(e, section.id)}>
                    <textarea
                      autoFocus
                      rows={2}
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) submitNew(e, section.id)
                        if (e.key === 'Escape') setAddingIn(null)
                      }}
                      onBlur={(e) => submitNew(e, section.id)}
                      placeholder="Task title…"
                      aria-label="New task title"
                      className="w-full resize-none rounded-xl border border-ink-700 bg-ink-850 p-3 text-sm text-ink-100 placeholder:text-ink-500 focus:border-focus-500"
                    />
                  </form>
                ) : (
                  <button
                    onClick={() => {
                      setAddingIn(section.id)
                      setNewTitle('')
                    }}
                    className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm text-ink-400 transition hover:bg-ink-800 hover:text-ink-100"
                  >
                    <IconPlus width={16} height={16} />
                    Add task
                  </button>
                )}
              </div>
            </section>
          )
        })}

        <button
          onClick={addSection}
          className="flex w-64 shrink-0 items-center gap-1.5 rounded-2xl border border-dashed border-ink-700 px-4 py-3 text-sm text-ink-400 transition hover:border-ink-600 hover:text-ink-100"
        >
          <IconPlus width={16} height={16} />
          Add section
        </button>
      </div>
    </div>
  )
}
