// Lightweight inline SVG icon set (no icon-library dependency).
// All icons inherit `currentColor` and accept standard svg props.

const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const IconBoard = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="7" height="18" rx="1.5" />
    <rect x="14" y="3" width="7" height="11" rx="1.5" />
  </svg>
)

export const IconList = (p) => (
  <svg {...base} {...p}>
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <circle cx="3.5" cy="6" r="1" fill="currentColor" stroke="none" />
    <circle cx="3.5" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="3.5" cy="18" r="1" fill="currentColor" stroke="none" />
  </svg>
)

export const IconDashboard = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="8" height="8" rx="1.5" />
    <rect x="13" y="3" width="8" height="5" rx="1.5" />
    <rect x="13" y="11" width="8" height="10" rx="1.5" />
    <rect x="3" y="14" width="8" height="7" rx="1.5" />
  </svg>
)

export const IconFocus = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3.5" />
  </svg>
)

export const IconPlus = (p) => (
  <svg {...base} {...p}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

export const IconClose = (p) => (
  <svg {...base} {...p}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

export const IconCheck = (p) => (
  <svg {...base} {...p}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export const IconClock = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15 14" />
  </svg>
)

export const IconFlag = (p) => (
  <svg {...base} {...p}>
    <path d="M4 21V4h11l-1.5 4L15 12H4" />
  </svg>
)

export const IconCalendar = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="16" y1="2" x2="16" y2="6" />
  </svg>
)

export const IconTrash = (p) => (
  <svg {...base} {...p}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
)

export const IconPlay = (p) => (
  <svg {...base} {...p}>
    <polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="none" />
  </svg>
)

export const IconPause = (p) => (
  <svg {...base} {...p}>
    <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none" />
    <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none" />
  </svg>
)

export const IconReset = (p) => (
  <svg {...base} {...p}>
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.5 15a9 9 0 1 0 2.1-9.4L1 10" />
  </svg>
)

export const IconMenu = (p) => (
  <svg {...base} {...p}>
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

export const IconSearch = (p) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

export const IconFire = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3s5 4 5 9a5 5 0 0 1-10 0c0-2 1-3 1-3s0 2 1.5 2S12 8 12 6c0-1-.5-2-.5-2S12 3 12 3z" />
  </svg>
)
