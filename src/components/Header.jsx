import { IconBoard, IconList, IconPlus, IconMenu, IconSearch } from './icons'
import { classNames } from '../utils/helpers'

export default function Header({
  view,
  setView,
  query,
  setQuery,
  activeProject,
  onOpenSidebar,
  onNewTask,
}) {
  const showProjectControls = view !== 'dashboard'

  return (
    <header className="z-10 flex flex-col gap-3 border-b border-ink-800 bg-ink-900/60 px-4 py-3 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="rounded-lg p-2 text-ink-300 hover:bg-ink-800 md:hidden"
          aria-label="Open sidebar"
        >
          <IconMenu width={20} height={20} />
        </button>

        <div className="flex min-w-0 items-center gap-2.5">
          {showProjectControls && activeProject && (
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: activeProject.color }}
              aria-hidden
            />
          )}
          <h1 className="truncate text-lg font-semibold text-ink-50">
            {view === 'dashboard' ? 'Dashboard' : activeProject?.name || 'Deep Focus'}
          </h1>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {showProjectControls && (
            <>
              <div className="hidden items-center rounded-lg border border-ink-700 bg-ink-850 p-0.5 sm:flex">
                <TabButton
                  active={view === 'board'}
                  onClick={() => setView('board')}
                  icon={<IconBoard width={16} height={16} />}
                  label="Board"
                />
                <TabButton
                  active={view === 'list'}
                  onClick={() => setView('list')}
                  icon={<IconList width={16} height={16} />}
                  label="List"
                />
              </div>
              <button
                onClick={onNewTask}
                className="flex items-center gap-1.5 rounded-lg bg-focus-600 px-3 py-2 text-sm font-semibold text-ink-950 transition hover:bg-focus-500"
              >
                <IconPlus width={16} height={16} />
                <span className="hidden sm:inline">New task</span>
              </button>
            </>
          )}
        </div>
      </div>

      {showProjectControls && (
        <div className="flex items-center gap-2">
          <div className="relative max-w-xs flex-1">
            <IconSearch
              width={16}
              height={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-500"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tasks…"
              aria-label="Search tasks"
              className="w-full rounded-lg border border-ink-700 bg-ink-850 py-2 pl-9 pr-3 text-sm text-ink-100 placeholder:text-ink-500 focus:border-focus-500"
            />
          </div>
          {/* Mobile view toggle */}
          <div className="flex items-center rounded-lg border border-ink-700 bg-ink-850 p-0.5 sm:hidden">
            <TabButton
              active={view === 'board'}
              onClick={() => setView('board')}
              icon={<IconBoard width={16} height={16} />}
              label="Board"
              compact
            />
            <TabButton
              active={view === 'list'}
              onClick={() => setView('list')}
              icon={<IconList width={16} height={16} />}
              label="List"
              compact
            />
          </div>
        </div>
      )}
    </header>
  )
}

function TabButton({ active, onClick, icon, label, compact }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={classNames(
        'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition',
        active ? 'bg-ink-700 text-ink-50' : 'text-ink-300 hover:text-ink-100',
      )}
    >
      {icon}
      {!compact && <span>{label}</span>}
    </button>
  )
}
