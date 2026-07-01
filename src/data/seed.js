import { uid } from '../utils/helpers'

// Default sections every new project starts with (Asana-style workflow).
export const DEFAULT_SECTIONS = () => [
  { id: uid('sec'), name: 'To Do' },
  { id: uid('sec'), name: 'In Progress' },
  { id: uid('sec'), name: 'Done' },
]

function daysFromNow(n) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

// A small, friendly starter workspace so the app isn't empty on first run.
export function buildSeedState() {
  const p1Sections = DEFAULT_SECTIONS()
  const p2Sections = DEFAULT_SECTIONS()

  const [todo1, doing1, done1] = p1Sections.map((s) => s.id)
  const [todo2, doing2] = p2Sections.map((s) => s.id)

  const projects = [
    { id: 'proj_welcome', name: 'Product Launch', color: '#2dd4bf', sections: p1Sections },
    { id: 'proj_personal', name: 'Personal', color: '#a78bfa', sections: p2Sections },
  ]

  let order = 0
  const t = (over) => ({
    id: uid('task'),
    title: '',
    notes: '',
    priority: 'medium',
    dueDate: null,
    completed: false,
    focusSeconds: 0,
    sessions: 0,
    subtasks: [],
    createdAt: new Date().toISOString(),
    order: order++,
    ...over,
  })

  const tasks = [
    t({
      projectId: 'proj_welcome',
      sectionId: todo1,
      title: 'Write launch announcement',
      notes: 'Draft the blog post and email copy.',
      priority: 'high',
      dueDate: daysFromNow(1),
      subtasks: [
        { id: uid('sub'), title: 'Outline key points', done: true },
        { id: uid('sub'), title: 'First draft', done: false },
      ],
    }),
    t({
      projectId: 'proj_welcome',
      sectionId: todo1,
      title: 'Design social graphics',
      priority: 'medium',
      dueDate: daysFromNow(3),
    }),
    t({
      projectId: 'proj_welcome',
      sectionId: doing1,
      title: 'Finalize landing page',
      priority: 'high',
      dueDate: daysFromNow(0),
      focusSeconds: 25 * 60,
      sessions: 1,
    }),
    t({
      projectId: 'proj_welcome',
      sectionId: done1,
      title: 'Set up analytics',
      priority: 'low',
      completed: true,
      focusSeconds: 50 * 60,
      sessions: 2,
    }),
    t({
      projectId: 'proj_personal',
      sectionId: todo2,
      title: 'Plan the week',
      priority: 'medium',
      dueDate: daysFromNow(0),
    }),
    t({
      projectId: 'proj_personal',
      sectionId: doing2,
      title: 'Read 30 minutes',
      priority: 'low',
      dueDate: daysFromNow(1),
    }),
  ]

  return {
    version: 1,
    projects,
    tasks,
    activeProjectId: 'proj_welcome',
    settings: { focusLength: 25, breakLength: 5, longBreakLength: 15 },
    focusLog: {}, // { 'YYYY-MM-DD': secondsFocused }
    streak: { current: 0, best: 0, lastDay: null },
  }
}
