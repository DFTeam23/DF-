import { useEffect, useMemo, useRef, useState } from 'react'
import { useApp } from '../context/AppContext'
import Modal from './Modal'
import { IconCheck, IconTrash, IconFocus, IconPlus, IconClock } from './icons'
import {
  PRIORITIES,
  toDateInputValue,
  formatMinutes,
  classNames,
} from '../utils/helpers'

export default function TaskModal({ taskRef, project, onClose, onStartFocus }) {
  const { state, dispatch } = useApp()
  const isNew = typeof taskRef === 'string' && taskRef.startsWith('new:')
  const newSectionId = isNew ? taskRef.slice(4) : null

  const existing = useMemo(
    () => (isNew ? null : state.tasks.find((t) => t.id === taskRef)),
    [state.tasks, taskRef, isNew],
  )

  // Local draft for the "new task" flow.
  const [draft, setDraft] = useState({
    title: '',
    notes: '',
    priority: 'medium',
    dueDate: '',
    sectionId: newSectionId || project?.sections?.[0]?.id,
  })
  const [newSub, setNewSub] = useState('')
  const subInputRef = useRef(null)

  // If the underlying task disappears (deleted elsewhere), close.
  useEffect(() => {
    if (!isNew && !existing) onClose()
  }, [isNew, existing, onClose])

  if (!isNew && !existing) return null

  const task = existing
  const patch = (p) => dispatch({ type: 'UPDATE_TASK', taskId: task.id, patch: p })

  const createTask = () => {
    if (!draft.title.trim()) {
      onClose()
      return
    }
    dispatch({
      type: 'ADD_TASK',
      projectId: project.id,
      sectionId: draft.sectionId,
      title: draft.title,
      priority: draft.priority,
      dueDate: draft.dueDate ? new Date(draft.dueDate).toISOString() : null,
    })
    onClose()
  }

  // ---- Field values (unified for new/existing) ----
  const val = isNew
    ? draft
    : {
        title: task.title,
        notes: task.notes,
        priority: task.priority,
        dueDate: toDateInputValue(task.dueDate),
        sectionId: task.sectionId,
      }

  const setField = (field, value) => {
    if (isNew) {
      setDraft((d) => ({ ...d, [field]: value }))
    } else if (field === 'dueDate') {
      patch({ dueDate: value ? new Date(value).toISOString() : null })
    } else {
      patch({ [field]: value })
    }
  }

  const addSubtask = (e) => {
    e.preventDefault()
    if (isNew || !newSub.trim()) return
    dispatch({ type: 'ADD_SUBTASK', taskId: task.id, title: newSub.trim() })
    setNewSub('')
    subInputRef.current?.focus()
  }

  const focusMinutes = task ? Math.round((task.focusSeconds || 0) / 60) : 0

  const footer = isNew ? (
    <>
      <button
        onClick={onClose}
        className="rounded-lg px-3 py-2 text-sm text-ink-300 hover:bg-ink-800"
      >
        Cancel
      </button>
      <button
        onClick={createTask}
        className="rounded-lg bg-focus-600 px-4 py-2 text-sm font-semibold text-ink-950 hover:bg-focus-500"
      >
        Create task
      </button>
    </>
  ) : (
    <>
      <button
        onClick={() => {
          dispatch({ type: 'DELETE_TASK', taskId: task.id })
          onClose()
        }}
        className="mr-auto flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-ink-400 hover:bg-ink-800 hover:text-rose-400"
      >
        <IconTrash width={15} height={15} />
        Delete
      </button>
      <button
        onClick={() => onStartFocus(task.id)}
        className="flex items-center gap-1.5 rounded-lg bg-focus-600 px-4 py-2 text-sm font-semibold text-ink-950 hover:bg-focus-500"
      >
        <IconFocus width={15} height={15} />
        Focus on this
      </button>
    </>
  )

  return (
    <Modal title={isNew ? 'New task' : 'Task details'} onClose={onClose} footer={footer}>
      <div className="space-y-4">
        <div>
          <label htmlFor="task-title" className="mb-1 block text-xs font-medium text-ink-400">
            Title
          </label>
          <input
            id="task-title"
            value={val.title}
            onChange={(e) => setField('title', e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && isNew) createTask()
            }}
            placeholder="What needs to be done?"
            className="w-full rounded-lg border border-ink-700 bg-ink-850 px-3 py-2 text-sm text-ink-100 placeholder:text-ink-500 focus:border-focus-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div>
            <label htmlFor="task-section" className="mb-1 block text-xs font-medium text-ink-400">
              Section
            </label>
            <select
              id="task-section"
              value={val.sectionId}
              onChange={(e) => setField('sectionId', e.target.value)}
              className="w-full rounded-lg border border-ink-700 bg-ink-850 px-2.5 py-2 text-sm text-ink-100 focus:border-focus-500"
            >
              {project.sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="task-priority" className="mb-1 block text-xs font-medium text-ink-400">
              Priority
            </label>
            <select
              id="task-priority"
              value={val.priority}
              onChange={(e) => setField('priority', e.target.value)}
              className="w-full rounded-lg border border-ink-700 bg-ink-850 px-2.5 py-2 text-sm text-ink-100 focus:border-focus-500"
            >
              {Object.entries(PRIORITIES).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="task-due" className="mb-1 block text-xs font-medium text-ink-400">
              Due date
            </label>
            <input
              id="task-due"
              type="date"
              value={val.dueDate}
              onChange={(e) => setField('dueDate', e.target.value)}
              className="w-full rounded-lg border border-ink-700 bg-ink-850 px-2.5 py-2 text-sm text-ink-100 focus:border-focus-500 [color-scheme:dark]"
            />
          </div>
        </div>

        <div>
          <label htmlFor="task-notes" className="mb-1 block text-xs font-medium text-ink-400">
            Notes
          </label>
          <textarea
            id="task-notes"
            rows={3}
            value={val.notes}
            onChange={(e) => setField('notes', e.target.value)}
            placeholder="Add details, links, or context…"
            className="df-scroll w-full resize-y rounded-lg border border-ink-700 bg-ink-850 px-3 py-2 text-sm text-ink-100 placeholder:text-ink-500 focus:border-focus-500"
          />
        </div>

        {/* Subtasks + focus stats only make sense for a saved task */}
        {!isNew && (
          <>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs font-medium text-ink-400">
                  Subtasks
                  {task.subtasks.length > 0 && (
                    <span className="ml-1.5 text-ink-500">
                      {task.subtasks.filter((s) => s.done).length}/{task.subtasks.length}
                    </span>
                  )}
                </span>
              </div>
              <ul className="space-y-1">
                {task.subtasks.map((s) => (
                  <li key={s.id} className="group flex items-center gap-2">
                    <button
                      onClick={() =>
                        dispatch({ type: 'TOGGLE_SUBTASK', taskId: task.id, subtaskId: s.id })
                      }
                      aria-pressed={s.done}
                      aria-label={s.done ? 'Mark subtask incomplete' : 'Mark subtask complete'}
                      className={classNames(
                        'grid h-4 w-4 shrink-0 place-items-center rounded border transition',
                        s.done
                          ? 'border-focus-500 bg-focus-500 text-ink-950'
                          : 'border-ink-500 text-transparent hover:border-focus-500',
                      )}
                    >
                      <IconCheck width={11} height={11} />
                    </button>
                    <span
                      className={classNames(
                        'flex-1 text-sm',
                        s.done ? 'text-ink-500 line-through' : 'text-ink-200',
                      )}
                    >
                      {s.title}
                    </span>
                    <button
                      onClick={() =>
                        dispatch({ type: 'DELETE_SUBTASK', taskId: task.id, subtaskId: s.id })
                      }
                      className="rounded p-0.5 text-ink-500 opacity-0 hover:text-rose-400 group-hover:opacity-100"
                      aria-label="Delete subtask"
                    >
                      <IconTrash width={13} height={13} />
                    </button>
                  </li>
                ))}
              </ul>
              <form onSubmit={addSubtask} className="mt-1.5 flex items-center gap-2">
                <IconPlus width={15} height={15} className="text-ink-500" />
                <input
                  ref={subInputRef}
                  value={newSub}
                  onChange={(e) => setNewSub(e.target.value)}
                  placeholder="Add a subtask…"
                  className="flex-1 bg-transparent text-sm text-ink-100 placeholder:text-ink-500 focus:outline-none"
                />
              </form>
            </div>

            {(focusMinutes > 0 || task.sessions > 0) && (
              <div className="flex items-center gap-4 rounded-lg bg-ink-850 px-3 py-2.5">
                <span className="flex items-center gap-1.5 text-sm text-focus-400">
                  <IconClock width={15} height={15} />
                  {formatMinutes(focusMinutes)} focused
                </span>
                <span className="text-sm text-ink-400">
                  {task.sessions} session{task.sessions === 1 ? '' : 's'}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  )
}
