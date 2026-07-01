/* eslint-disable react-refresh/only-export-components -- context file intentionally exports a provider and its hook together */
import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { buildSeedState, DEFAULT_SECTIONS } from '../data/seed'
import { uid, dayKey } from '../utils/helpers'

const STORAGE_KEY = 'deep-focus:v1'

const AppContext = createContext(null)

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return buildSeedState()
    const parsed = JSON.parse(raw)
    // Basic shape guard — fall back to seed if the payload looks wrong.
    if (!parsed || !Array.isArray(parsed.projects) || !Array.isArray(parsed.tasks)) {
      return buildSeedState()
    }
    return { ...buildSeedState(), ...parsed }
  } catch {
    return buildSeedState()
  }
}

/** Recompute the focus streak given the day a session was just logged. */
function bumpStreak(streak, todayKey) {
  if (streak.lastDay === todayKey) return streak // already counted today
  const yesterday = dayKey(new Date(Date.now() - 86400000))
  const current = streak.lastDay === yesterday ? streak.current + 1 : 1
  return {
    current,
    best: Math.max(current, streak.best || 0),
    lastDay: todayKey,
  }
}

function reducer(state, action) {
  switch (action.type) {
    // ---- Projects -------------------------------------------------------
    case 'ADD_PROJECT': {
      const project = {
        id: uid('proj'),
        name: action.name.trim() || 'Untitled project',
        color: action.color || '#2dd4bf',
        sections: DEFAULT_SECTIONS(),
      }
      return { ...state, projects: [...state.projects, project], activeProjectId: project.id }
    }
    case 'RENAME_PROJECT':
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.projectId ? { ...p, name: action.name } : p,
        ),
      }
    case 'DELETE_PROJECT': {
      const projects = state.projects.filter((p) => p.id !== action.projectId)
      const tasks = state.tasks.filter((t) => t.projectId !== action.projectId)
      const activeProjectId =
        state.activeProjectId === action.projectId
          ? projects[0]?.id ?? null
          : state.activeProjectId
      return { ...state, projects, tasks, activeProjectId }
    }
    case 'SET_ACTIVE_PROJECT':
      return { ...state, activeProjectId: action.projectId }

    case 'ADD_SECTION':
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.projectId
            ? { ...p, sections: [...p.sections, { id: uid('sec'), name: action.name || 'New section' }] }
            : p,
        ),
      }

    // ---- Tasks ----------------------------------------------------------
    case 'ADD_TASK': {
      const maxOrder = state.tasks.reduce((m, t) => Math.max(m, t.order ?? 0), 0)
      const task = {
        id: uid('task'),
        projectId: action.projectId,
        sectionId: action.sectionId,
        title: action.title.trim() || 'Untitled task',
        notes: '',
        priority: action.priority || 'medium',
        dueDate: action.dueDate || null,
        completed: false,
        focusSeconds: 0,
        sessions: 0,
        subtasks: [],
        createdAt: new Date().toISOString(),
        order: maxOrder + 1,
      }
      return { ...state, tasks: [...state.tasks, task] }
    }
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId ? { ...t, ...action.patch } : t,
        ),
      }
    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId ? { ...t, completed: !t.completed } : t,
        ),
      }
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.taskId) }

    case 'MOVE_TASK': {
      // Move a task to a target section, ordering it before `beforeTaskId`
      // (or at the end when beforeTaskId is null).
      const { taskId, sectionId, beforeTaskId } = action
      const moved = state.tasks.find((t) => t.id === taskId)
      if (!moved) return state
      const rest = state.tasks.filter((t) => t.id !== taskId)
      const updatedMoved = { ...moved, sectionId }

      const inSection = rest
        .filter((t) => t.sectionId === sectionId)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

      const idx = beforeTaskId
        ? inSection.findIndex((t) => t.id === beforeTaskId)
        : inSection.length
      const target = idx === -1 ? inSection.length : idx
      inSection.splice(target, 0, updatedMoved)

      // Reassign sequential order within the section.
      const reordered = inSection.map((t, i) => ({ ...t, order: i }))
      const others = rest.filter((t) => t.sectionId !== sectionId)
      const byId = new Map(reordered.map((t) => [t.id, t]))
      const tasks = [...others, ...reordered].map((t) => byId.get(t.id) ?? t)
      return { ...state, tasks }
    }

    // ---- Subtasks -------------------------------------------------------
    case 'ADD_SUBTASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId
            ? { ...t, subtasks: [...t.subtasks, { id: uid('sub'), title: action.title, done: false }] }
            : t,
        ),
      }
    case 'TOGGLE_SUBTASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId
            ? {
                ...t,
                subtasks: t.subtasks.map((s) =>
                  s.id === action.subtaskId ? { ...s, done: !s.done } : s,
                ),
              }
            : t,
        ),
      }
    case 'DELETE_SUBTASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId
            ? { ...t, subtasks: t.subtasks.filter((s) => s.id !== action.subtaskId) }
            : t,
        ),
      }

    // ---- Focus sessions -------------------------------------------------
    case 'LOG_FOCUS': {
      // seconds of focus completed on a task
      const seconds = Math.max(0, Math.round(action.seconds || 0))
      if (!seconds) return state
      const today = dayKey()
      const focusLog = { ...state.focusLog, [today]: (state.focusLog[today] || 0) + seconds }
      const tasks = state.tasks.map((t) =>
        t.id === action.taskId
          ? { ...t, focusSeconds: (t.focusSeconds || 0) + seconds, sessions: (t.sessions || 0) + 1 }
          : t,
      )
      const streak = bumpStreak(state.streak, today)
      return { ...state, tasks, focusLog, streak }
    }

    // ---- Settings -------------------------------------------------------
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.patch } }

    case 'RESET_ALL':
      return buildSeedState()

    case 'IMPORT_STATE':
      return { ...buildSeedState(), ...action.state }

    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)

  // Persist to localStorage on every change (debounced by the event loop).
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Storage full or unavailable — non-fatal; app keeps working in-memory.
    }
  }, [state])

  const value = useMemo(() => ({ state, dispatch }), [state])
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within an AppProvider')
  return ctx
}
