import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { IconCheck, IconClock, IconFocus, IconCalendar, IconTrash } from './icons'
import { PRIORITIES, describeDue, formatMinutes, classNames } from '../utils/helpers'

const SORTS = {
  manual: { label: 'Section' },
  due: { label: 'Due date' },
  priority: { label: 'Priority' },
}

export default function ListView({ project, query, onOpenTask, onStartFocus }) {
  const { state, dispatch } = useApp()
  const [sort, setSort] = useState('manual')
  const [hideDone, setHideDone] = useState(false)
  const q = query.trim().toLowerCase()

  const sectionName = useMemo(() => {
    const map = {}
    project.sections.forEach((s) => (map[s.id] = s.name))
    return map
  }, [project])

  const rows = useMemo(() => {
    let list = state.tasks
      .filter((t) => t.projectId === project.id)
      .filter((t) => !q || t.title.toLowerCase().includes(q))
      .filter((t) => !hideDone || !t.completed)

    if (sort === 'due') {
      list = [...list].sort((a, b) => {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate) - new Date(b.dueDate)
      })
    } else if (sort === 'priority') {
      list = [...list].sort(
        (a, b) => (PRIORITIES[b.priority]?.rank ?? 0) - (PRIORITIES[a.priority]?.rank ?? 0),
      )
    } else {
      const secOrder = new Map(project.sections.map((s, i) => [s.id, i]))
      list = [...list].sort((a, b) => {
        const sa = secOrder.get(a.sectionId) ?? 0
        const sb = secOrder.get(b.sectionId) ?? 0
        return sa - sb || (a.order ?? 0) - (b.order ?? 0)
      })
    }
    return list
  }, [state.tasks, project, q, sort, hideDone])

  return (
    <div className="p-4 md:p-6">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-ink-300">
          Sort
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-ink-700 bg-ink-850 px-2 py-1.5 text-sm text-ink-100 focus:border-focus-500"
          >
            {Object.entries(SORTS).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-300">
          <input
            type="checkbox"
            checked={hideDone}
            onChange={(e) => setHideDone(e.target.checked)}
            className="h-4 w-4 rounded border-ink-600 bg-ink-850 accent-focus-500"
          />
          Hide completed
        </label>
        <span className="ml-auto text-sm text-ink-500">{rows.length} tasks</span>
      </div>

      <div className="overflow-hidden rounded-xl border border-ink-800">
        {rows.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-ink-500">No tasks to show.</p>
        )}
        <ul className="divide-y divide-ink-800">
          {rows.map((task) => {
            const due = describeDue(task.dueDate)
            const prio = PRIORITIES[task.priority] || PRIORITIES.medium
            const focusMinutes = Math.round((task.focusSeconds || 0) / 60)
            return (
              <li
                key={task.id}
                className="group flex items-center gap-3 bg-ink-900/40 px-3 py-2.5 transition hover:bg-ink-850"
              >
                <button
                  onClick={() => dispatch({ type: 'TOGGLE_TASK', taskId: task.id })}
                  aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
                  aria-pressed={task.completed}
                  className={classNames(
                    'grid h-5 w-5 shrink-0 place-items-center rounded-full border transition',
                    task.completed
                      ? 'border-focus-500 bg-focus-500 text-ink-950'
                      : 'border-ink-500 text-transparent hover:border-focus-500',
                  )}
                >
                  <IconCheck width={13} height={13} />
                </button>

                <button
                  onClick={() => onOpenTask(task.id)}
                  className="min-w-0 flex-1 text-left"
                >
                  <span
                    className={classNames(
                      'block truncate text-sm text-ink-100',
                      task.completed && 'text-ink-500 line-through',
                    )}
                  >
                    {task.title}
                  </span>
                  <span className="text-[11px] text-ink-500">{sectionName[task.sectionId]}</span>
                </button>

                <span className={classNames('hidden items-center gap-1.5 text-xs sm:flex', prio.color)}>
                  <span className={classNames('h-1.5 w-1.5 rounded-full', prio.dot)} />
                  {prio.label}
                </span>

                {focusMinutes > 0 && (
                  <span className="hidden items-center gap-1 text-xs text-focus-400 md:flex">
                    <IconClock width={13} height={13} />
                    {formatMinutes(focusMinutes)}
                  </span>
                )}

                {due && (
                  <span
                    className={classNames(
                      'hidden items-center gap-1 whitespace-nowrap text-xs sm:flex',
                      due.overdue ? 'text-rose-300' : due.soon ? 'text-amber-300' : 'text-ink-400',
                    )}
                  >
                    <IconCalendar width={13} height={13} />
                    {due.label}
                  </span>
                )}

                <div className="flex items-center gap-0.5 opacity-0 transition focus-within:opacity-100 group-hover:opacity-100">
                  <button
                    onClick={() => onStartFocus(task.id)}
                    className="rounded-md p-1.5 text-ink-400 hover:bg-focus-600/15 hover:text-focus-400"
                    aria-label={`Focus on ${task.title}`}
                  >
                    <IconFocus width={15} height={15} />
                  </button>
                  <button
                    onClick={() => dispatch({ type: 'DELETE_TASK', taskId: task.id })}
                    className="rounded-md p-1.5 text-ink-400 hover:bg-ink-800 hover:text-rose-400"
                    aria-label={`Delete ${task.title}`}
                  >
                    <IconTrash width={15} height={15} />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
