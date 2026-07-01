import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { IconDashboard, IconPlus, IconClose, IconTrash, IconFocus } from './icons'
import { classNames } from '../utils/helpers'

const PROJECT_COLORS = ['#2dd4bf', '#a78bfa', '#f472b6', '#fbbf24', '#60a5fa', '#34d399']

export default function Sidebar({ view, setView, open, onClose }) {
  const { state, dispatch } = useApp()
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [color, setColor] = useState(PROJECT_COLORS[0])

  const submit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    dispatch({ type: 'ADD_PROJECT', name, color })
    setName('')
    setColor(PROJECT_COLORS[0])
    setAdding(false)
    setView('board')
  }

  const selectProject = (id) => {
    dispatch({ type: 'SET_ACTIVE_PROJECT', projectId: id })
    setView(view === 'dashboard' ? 'board' : view)
    onClose()
  }

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={classNames(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-ink-800 bg-ink-900 transition-transform md:static md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-label="Sidebar"
      >
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-focus-600/15 text-focus-500">
              <IconFocus width={18} height={18} />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-ink-50">Deep Focus</p>
              <p className="text-[11px] text-ink-400">You inspire, we create</p>
            </div>
          </div>
          <button
            className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-800 md:hidden"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <IconClose width={18} height={18} />
          </button>
        </div>

        <nav className="px-3">
          <button
            onClick={() => {
              setView('dashboard')
              onClose()
            }}
            className={classNames(
              'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition',
              view === 'dashboard'
                ? 'bg-focus-600/15 text-focus-400'
                : 'text-ink-200 hover:bg-ink-800',
            )}
            aria-current={view === 'dashboard' ? 'page' : undefined}
          >
            <IconDashboard width={18} height={18} />
            Dashboard
          </button>
        </nav>

        <div className="mt-5 flex items-center justify-between px-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
            Projects
          </p>
          <button
            onClick={() => setAdding((v) => !v)}
            className="rounded p-1 text-ink-400 transition hover:bg-ink-800 hover:text-ink-100"
            aria-label="Add project"
          >
            <IconPlus width={16} height={16} />
          </button>
        </div>

        <div className="df-scroll mt-1 flex-1 overflow-y-auto px-3 pb-4">
          {adding && (
            <form onSubmit={submit} className="mb-2 rounded-lg bg-ink-850 p-2.5">
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Project name"
                aria-label="New project name"
                className="w-full rounded-md border border-ink-700 bg-ink-900 px-2.5 py-1.5 text-sm text-ink-100 placeholder:text-ink-500 focus:border-focus-500"
              />
              <div className="mt-2 flex items-center gap-1.5">
                {PROJECT_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    aria-label={`Color ${c}`}
                    className={classNames(
                      'h-5 w-5 rounded-full transition',
                      color === c ? 'ring-2 ring-ink-100 ring-offset-2 ring-offset-ink-850' : '',
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <div className="mt-2 flex gap-1.5">
                <button
                  type="submit"
                  className="flex-1 rounded-md bg-focus-600 px-2 py-1.5 text-xs font-semibold text-ink-950 hover:bg-focus-500"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setAdding(false)}
                  className="rounded-md px-2 py-1.5 text-xs text-ink-300 hover:bg-ink-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <ul className="space-y-0.5">
            {state.projects.map((p) => {
              const isActive = view !== 'dashboard' && p.id === state.activeProjectId
              const count = state.tasks.filter(
                (t) => t.projectId === p.id && !t.completed,
              ).length
              return (
                <li key={p.id} className="group flex items-center">
                  <button
                    onClick={() => selectProject(p.id)}
                    className={classNames(
                      'flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition',
                      isActive
                        ? 'bg-ink-800 text-ink-50'
                        : 'text-ink-200 hover:bg-ink-800/60',
                    )}
                  >
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="truncate">{p.name}</span>
                    {count > 0 && (
                      <span className="ml-auto rounded-full bg-ink-700/70 px-1.5 py-0.5 text-[10px] font-medium text-ink-300">
                        {count}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `Delete project “${p.name}” and all its tasks? This cannot be undone.`,
                        )
                      ) {
                        dispatch({ type: 'DELETE_PROJECT', projectId: p.id })
                      }
                    }}
                    className="ml-0.5 rounded p-1 text-ink-500 opacity-0 transition hover:bg-ink-800 hover:text-rose-400 focus:opacity-100 group-hover:opacity-100"
                    aria-label={`Delete project ${p.name}`}
                  >
                    <IconTrash width={15} height={15} />
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="border-t border-ink-800 px-4 py-3">
          <p className="text-[11px] text-ink-500">
            Plan tasks, then <span className="text-focus-400">focus</span> on them.
          </p>
        </div>
      </aside>
    </>
  )
}
