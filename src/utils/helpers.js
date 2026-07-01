// ---------------------------------------------------------------------------
// Small pure helpers used across Deep Focus. Kept dependency-free on purpose.
// ---------------------------------------------------------------------------

let idCounter = 0
/** Generate a reasonably-unique id without pulling in a uuid dependency. */
export function uid(prefix = 'id') {
  idCounter += 1
  const rand = Math.random().toString(36).slice(2, 8)
  return `${prefix}_${Date.now().toString(36)}${idCounter.toString(36)}${rand}`
}

export const PRIORITIES = {
  low: { label: 'Low', color: 'text-ink-300', dot: 'bg-ink-400', rank: 0 },
  medium: { label: 'Medium', color: 'text-amber-300', dot: 'bg-amber-400', rank: 1 },
  high: { label: 'High', color: 'text-rose-300', dot: 'bg-rose-400', rank: 2 },
}

/** Format minutes as a compact human string, e.g. 95 -> "1h 35m". */
export function formatMinutes(mins) {
  const m = Math.max(0, Math.round(mins || 0))
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  const rem = m % 60
  return rem ? `${h}h ${rem}m` : `${h}h`
}

/** Format seconds as MM:SS for the focus timer. */
export function formatClock(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds))
  const mm = Math.floor(s / 60)
    .toString()
    .padStart(2, '0')
  const ss = (s % 60).toString().padStart(2, '0')
  return `${mm}:${ss}`
}

function startOfDay(d) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

/** Return a friendly due-date label plus an urgency flag. */
export function describeDue(dueISO) {
  if (!dueISO) return null
  const due = startOfDay(dueISO)
  const today = startOfDay(new Date())
  const diffDays = Math.round((due - today) / 86400000)

  let label
  if (diffDays === 0) label = 'Today'
  else if (diffDays === 1) label = 'Tomorrow'
  else if (diffDays === -1) label = 'Yesterday'
  else if (diffDays < 0) label = `${Math.abs(diffDays)}d overdue`
  else if (diffDays < 7)
    label = due.toLocaleDateString(undefined, { weekday: 'short' })
  else label = due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

  return { label, overdue: diffDays < 0, soon: diffDays >= 0 && diffDays <= 1, diffDays }
}

export function isToday(dueISO) {
  if (!dueISO) return false
  return startOfDay(dueISO).getTime() === startOfDay(new Date()).getTime()
}

/** YYYY-MM-DD key for a date, used for daily focus stats. */
export function dayKey(d = new Date()) {
  const x = new Date(d)
  const y = x.getFullYear()
  const m = (x.getMonth() + 1).toString().padStart(2, '0')
  const day = x.getDate().toString().padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Value for a date input (YYYY-MM-DD) from an ISO string. */
export function toDateInputValue(iso) {
  if (!iso) return ''
  return dayKey(new Date(iso))
}

export function classNames(...parts) {
  return parts.filter(Boolean).join(' ')
}
