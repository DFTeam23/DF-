import { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { IconClock, IconFire, IconCheck, IconFocus } from './icons'
import {
  formatMinutes,
  dayKey,
  describeDue,
  isToday,
  PRIORITIES,
  classNames,
} from '../utils/helpers'

export default function Dashboard({ onStartFocus, setView }) {
  const { state, dispatch } = useApp()

  const projectName = useMemo(() => {
    const m = {}
    state.projects.forEach((p) => (m[p.id] = p))
    return m
  }, [state.projects])

  // Last 7 days of focus, oldest → newest.
  const week = useMemo(() => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = dayKey(d)
      days.push({
        key,
        label: d.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 2),
        seconds: state.focusLog[key] || 0,
        isToday: i === 0,
      })
    }
    return days
  }, [state.focusLog])

  const todaySeconds = state.focusLog[dayKey()] || 0
  const weekSeconds = week.reduce((s, d) => s + d.seconds, 0)
  const maxSeconds = Math.max(1, ...week.map((d) => d.seconds))

  const totalSessions = state.tasks.reduce((s, t) => s + (t.sessions || 0), 0)
  const completedCount = state.tasks.filter((t) => t.completed).length

  const dueToday = useMemo(
    () =>
      state.tasks
        .filter((t) => !t.completed && isToday(t.dueDate))
        .sort((a, b) => (PRIORITIES[b.priority]?.rank ?? 0) - (PRIORITIES[a.priority]?.rank ?? 0)),
    [state.tasks],
  )

  const overdue = useMemo(
    () =>
      state.tasks.filter((t) => {
        if (t.completed || !t.dueDate) return false
        const d = describeDue(t.dueDate)
        return d?.overdue
      }),
    [state.tasks],
  )

  const mostFocused = useMemo(
    () =>
      [...state.tasks]
        .filter((t) => (t.focusSeconds || 0) > 0)
        .sort((a, b) => (b.focusSeconds || 0) - (a.focusSeconds || 0))
        .slice(0, 5),
    [state.tasks],
  )

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={<IconClock width={18} height={18} />}
          label="Focused today"
          value={formatMinutes(Math.round(todaySeconds / 60))}
          accent="text-focus-400"
        />
        <StatCard
          icon={<IconFire width={18} height={18} />}
          label="Focus streak"
          value={`${state.streak.current} day${state.streak.current === 1 ? '' : 's'}`}
          sub={state.streak.best ? `best ${state.streak.best}` : undefined}
          accent="text-amber-400"
        />
        <StatCard
          icon={<IconFocus width={18} height={18} />}
          label="Sessions"
          value={String(totalSessions)}
          sub={`${formatMinutes(Math.round(weekSeconds / 60))} this week`}
          accent="text-violet-400"
        />
        <StatCard
          icon={<IconCheck width={18} height={18} />}
          label="Completed"
          value={String(completedCount)}
          sub="tasks done"
          accent="text-emerald-400"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {/* Weekly focus chart */}
        <section className="rounded-2xl border border-ink-800 bg-ink-900/50 p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink-100">Focus this week</h2>
            <span className="text-xs text-ink-500">
              {formatMinutes(Math.round(weekSeconds / 60))} total
            </span>
          </div>
          <div className="flex h-40 items-end justify-between gap-2">
            {week.map((d) => {
              const pct = Math.round((d.seconds / maxSeconds) * 100)
              const mins = Math.round(d.seconds / 60)
              return (
                <div key={d.key} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className={classNames(
                        'w-full rounded-t-md transition-all',
                        d.isToday ? 'bg-focus-500' : 'bg-ink-600',
                        d.seconds === 0 && 'min-h-[3px] bg-ink-800',
                      )}
                      style={{ height: d.seconds ? `${Math.max(6, pct)}%` : undefined }}
                      title={`${mins} min`}
                      aria-label={`${d.label}: ${mins} minutes focused`}
                    />
                  </div>
                  <span
                    className={classNames(
                      'text-[11px]',
                      d.isToday ? 'font-semibold text-focus-400' : 'text-ink-500',
                    )}
                  >
                    {d.label}
                  </span>
                </div>
              )
            })}
          </div>
        </section>

        {/* Due today */}
        <section className="rounded-2xl border border-ink-800 bg-ink-900/50 p-5">
          <h2 className="mb-3 text-sm font-semibold text-ink-100">
            Due today
            {overdue.length > 0 && (
              <span className="ml-2 rounded-full bg-rose-500/15 px-2 py-0.5 text-[11px] font-medium text-rose-300">
                {overdue.length} overdue
              </span>
            )}
          </h2>
          {dueToday.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-500">
              Nothing due today. Nice and clear. 🌤️
            </p>
          ) : (
            <ul className="space-y-1.5">
              {dueToday.slice(0, 6).map((t) => {
                const prio = PRIORITIES[t.priority] || PRIORITIES.medium
                return (
                  <li key={t.id} className="group flex items-center gap-2.5">
                    <button
                      onClick={() => dispatch({ type: 'TOGGLE_TASK', taskId: t.id })}
                      className="grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full border border-ink-500 text-transparent transition hover:border-focus-500"
                      aria-label={`Complete ${t.title}`}
                    >
                      <IconCheck width={12} height={12} />
                    </button>
                    <span className="min-w-0 flex-1 truncate text-sm text-ink-200">{t.title}</span>
                    <span className={classNames('h-1.5 w-1.5 shrink-0 rounded-full', prio.dot)} />
                    <button
                      onClick={() => onStartFocus(t.id)}
                      className="rounded p-1 text-ink-500 opacity-0 transition hover:text-focus-400 focus:opacity-100 group-hover:opacity-100"
                      aria-label={`Focus on ${t.title}`}
                    >
                      <IconFocus width={14} height={14} />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>

      {/* Most focused tasks */}
      <section className="mt-4 rounded-2xl border border-ink-800 bg-ink-900/50 p-5">
        <h2 className="mb-3 text-sm font-semibold text-ink-100">Where your focus went</h2>
        {mostFocused.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <p className="text-sm text-ink-500">
              No focus sessions yet. Pick a task and start your first one.
            </p>
            <button
              onClick={() => setView('board')}
              className="rounded-lg bg-focus-600 px-4 py-2 text-sm font-semibold text-ink-950 hover:bg-focus-500"
            >
              Go to board
            </button>
          </div>
        ) : (
          <ul className="space-y-2.5">
            {mostFocused.map((t) => {
              const mins = Math.round((t.focusSeconds || 0) / 60)
              const pct = Math.round(
                ((t.focusSeconds || 0) / (mostFocused[0].focusSeconds || 1)) * 100,
              )
              const proj = projectName[t.projectId]
              return (
                <li key={t.id}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="flex min-w-0 items-center gap-2">
                      {proj && (
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: proj.color }}
                        />
                      )}
                      <span className="truncate text-ink-200">{t.title}</span>
                    </span>
                    <span className="ml-3 shrink-0 text-xs text-ink-400">
                      {formatMinutes(mins)} · {t.sessions}×
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-ink-800">
                    <div
                      className="h-full rounded-full bg-focus-500/80"
                      style={{ width: `${Math.max(4, pct)}%` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <p className="mt-6 text-center text-xs text-ink-600">
        Deep Focus keeps everything in your browser. Plan in the board, then focus — your time is
        tracked per task.
      </p>
    </div>
  )
}

function StatCard({ icon, label, value, sub, accent }) {
  return (
    <div className="rounded-2xl border border-ink-800 bg-ink-900/50 p-4">
      <div className={classNames('mb-2 flex items-center gap-2', accent)}>
        {icon}
        <span className="text-xs font-medium text-ink-400">{label}</span>
      </div>
      <p className="text-2xl font-semibold text-ink-50">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-ink-500">{sub}</p>}
    </div>
  )
}
