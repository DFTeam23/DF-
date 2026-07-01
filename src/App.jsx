import { useState } from 'react'
import { useApp } from './context/AppContext'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import BoardView from './components/BoardView'
import ListView from './components/ListView'
import Dashboard from './components/Dashboard'
import TaskModal from './components/TaskModal'
import FocusMode from './components/FocusMode'

export default function App() {
  const { state } = useApp()
  const [view, setView] = useState('board') // 'board' | 'list' | 'dashboard'
  const [query, setQuery] = useState('')
  const [openTaskId, setOpenTaskId] = useState(null)
  const [focusTaskId, setFocusTaskId] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const activeProject = state.projects.find((p) => p.id === state.activeProjectId) || null

  const openTask = (id) => setOpenTaskId(id)
  const startFocus = (id) => {
    setOpenTaskId(null)
    setFocusTaskId(id)
  }

  return (
    <div className="flex h-full overflow-hidden bg-ink-950 text-ink-100">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-focus-600 focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-ink-950"
      >
        Skip to content
      </a>

      <Sidebar
        view={view}
        setView={setView}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          view={view}
          setView={setView}
          query={query}
          setQuery={setQuery}
          activeProject={activeProject}
          onOpenSidebar={() => setSidebarOpen(true)}
          onNewTask={() => {
            const firstSection = activeProject?.sections?.[0]
            if (firstSection) openTask('new:' + firstSection.id)
          }}
        />

        <main id="main-content" className="df-scroll min-h-0 flex-1 overflow-auto">
          {view === 'dashboard' ? (
            <Dashboard onOpenTask={openTask} onStartFocus={startFocus} setView={setView} />
          ) : !activeProject ? (
            <EmptyProjects />
          ) : view === 'board' ? (
            <BoardView
              project={activeProject}
              query={query}
              onOpenTask={openTask}
              onStartFocus={startFocus}
            />
          ) : (
            <ListView
              project={activeProject}
              query={query}
              onOpenTask={openTask}
              onStartFocus={startFocus}
            />
          )}
        </main>
      </div>

      {openTaskId && (
        <TaskModal
          taskRef={openTaskId}
          project={activeProject}
          onClose={() => setOpenTaskId(null)}
          onStartFocus={startFocus}
        />
      )}

      {focusTaskId && (
        <FocusMode taskId={focusTaskId} onClose={() => setFocusTaskId(null)} />
      )}
    </div>
  )
}

function EmptyProjects() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
      <p className="text-lg font-medium text-ink-100">No projects yet</p>
      <p className="max-w-sm text-sm text-ink-400">
        Create a project from the sidebar to start planning and focusing on your work.
      </p>
    </div>
  )
}
