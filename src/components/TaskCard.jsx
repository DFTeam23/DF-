import { useApp } from '../context/AppContext'
import { IconCheck, IconClock, IconFocus, IconCalendar } from './icons'
import { PRIORITIES, describeDue, formatMinutes, classNames } from '../utils/helpers'

export default function TaskCard({ task, onOpen, onStartFocus, dragProps }) {
  const { dispatch } = useApp()
  const due = describeDue(task.dueDate)
  const prio = PRIORITIES[task.priority] || PRIORITIES.medium
  const focusMinutes = Math.round((task.focusSeconds || 0) / 60)
  const subDone = task.subtasks.filter((s) => s.done).length

  return (
    <div
      {...dragProps}
      onClick={() => onOpen(task.id)}
      className={classNames(
        'group cursor-pointer rounded-xl border border-ink-700/60 bg-ink-850 p-3 shadow-sm transition hover:border-ink-600 hover:bg-ink-800',
        task.completed && 'opacity-60',
      )}
    >
      <div className="flex items-start gap-2.5">
        <button
          onClick={(e) => {
            e.stopPropagation()
            dispatch({ type: 'TOGGLE_TASK', taskId: task.id })
          }}
          aria-label={task.completed ? 'Mark task incomplete' : 'Mark task complete'}
          aria-pressed={task.completed}
          className={classNames(
            'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border transition',
            task.completed
              ? 'border-focus-500 bg-focus-500 text-ink-950'
              : 'border-ink-500 text-transparent hover:border-focus-500',
          )}
        >
          <IconCheck width={13} height={13} />
        </button>

        <div className="min-w-0 flex-1">
          <p
            className={classNames(
              'text-sm leading-snug text-ink-100',
              task.completed && 'line-through',
            )}
          >
            {task.title}
          </p>

          {(due || focusMinutes > 0 || task.subtasks.length > 0) && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {due && (
                <span
                  className={classNames(
                    'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium',
                    due.overdue
                      ? 'bg-rose-500/15 text-rose-300'
                      : due.soon
                        ? 'bg-amber-500/15 text-amber-300'
                        : 'bg-ink-700/60 text-ink-300',
                  )}
                >
                  <IconCalendar width={12} height={12} />
                  {due.label}
                </span>
              )}
              {task.subtasks.length > 0 && (
                <span className="inline-flex items-center gap-1 rounded-md bg-ink-700/60 px-1.5 py-0.5 text-[11px] font-medium text-ink-300">
                  <IconCheck width={12} height={12} />
                  {subDone}/{task.subtasks.length}
                </span>
              )}
              {focusMinutes > 0 && (
                <span className="inline-flex items-center gap-1 rounded-md bg-focus-600/15 px-1.5 py-0.5 text-[11px] font-medium text-focus-400">
                  <IconClock width={12} height={12} />
                  {formatMinutes(focusMinutes)}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between">
        <span className={classNames('inline-flex items-center gap-1.5 text-[11px]', prio.color)}>
          <span className={classNames('h-1.5 w-1.5 rounded-full', prio.dot)} />
          {prio.label}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onStartFocus(task.id)
          }}
          className="flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] font-medium text-ink-400 opacity-0 transition hover:bg-focus-600/15 hover:text-focus-400 focus:opacity-100 group-hover:opacity-100"
          aria-label={`Start a focus session on ${task.title}`}
        >
          <IconFocus width={13} height={13} />
          Focus
        </button>
      </div>
    </div>
  )
}
