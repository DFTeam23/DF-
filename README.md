# Deep Focus

**You inspire, we create.**

A focus-first task manager that complements Asana. Plan your work on an
Asana-style board, then drop into a distraction-free **Focus Mode** that runs a
Pomodoro timer and tracks focused time *per task* — so you can see not just what
you did, but where your attention actually went.

## Why Deep Focus

Most task managers help you *plan*. Deep Focus helps you plan **and focus**.
Every task has a one-click focus session, and the app quietly measures the time
you spend concentrating on it. Use it standalone, or alongside Asana as your
personal "heads-down" companion.

## Features

- **Kanban board** — projects with customizable sections (To Do / In Progress /
  Done), drag-and-drop cards, priorities, due dates, and subtasks.
- **List view** — sort by section, due date, or priority; hide completed tasks.
- **Focus Mode** — a full-screen Pomodoro timer (adjustable length, auto
  break, gentle chime) that logs focused time and session counts onto the task.
- **Dashboard** — focus-time-today, daily streak, a 7-day focus chart, tasks
  due today across all projects, and a "where your focus went" breakdown.
- **Local-first** — everything is saved in your browser (localStorage); no
  account, no server, nothing leaves your machine.
- **Accessible** — keyboard navigation, focus traps in dialogs, visible focus
  rings, ARIA labels, a skip-to-content link, and reduced-motion support.

## Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS 3 (dark, calm theme)
- **State:** React Context + `useReducer`, persisted to localStorage
- **Dependencies:** intentionally minimal — no UI/icon/date libraries

## Project Structure

```
DF-/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/          # Sidebar, Header, BoardView, ListView,
│   │                        # TaskCard, TaskModal, FocusMode, Dashboard,
│   │                        # Modal, icons
│   ├── context/
│   │   └── AppContext.jsx   # global store (reducer + persistence)
│   ├── data/
│   │   └── seed.js          # starter workspace
│   ├── utils/
│   │   └── helpers.js       # dates, formatting, priorities
│   ├── App.jsx              # layout + view/modal orchestration
│   ├── main.jsx             # entry point
│   └── index.css            # Tailwind + base styles
├── index.html
├── tailwind.config.js
├── vite.config.js
├── postcss.config.js
├── .eslintrc.cjs
└── package.json
```

## Getting Started

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))

### Installation

```bash
git clone https://github.com/DFTeam23/DF-.git
cd DF-
npm install
```

### Development

```bash
npm run dev
```

The app opens at `http://localhost:5173`.

### Build

```bash
npm run build      # output in dist/
npm run preview    # preview the production build
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## How to use it

1. **Create a project** from the sidebar (name + color).
2. **Add tasks** to a section on the board; open a task to set priority, due
   date, notes, and subtasks.
3. **Drag** cards between sections as work progresses.
4. Hit **Focus** on any task to start a session. Your focused minutes are saved
   to that task.
5. Check the **Dashboard** to see your streak, weekly focus, and where your
   time went.

Keyboard shortcuts in Focus Mode: **Space** play/pause, **Esc** exit.

## Roadmap ideas

- Optional **Asana import** (pull your Asana tasks in to run focus sessions on
  them, then push focused-time back as comments).
- Ambient focus soundscapes.
- Export / import of your data as JSON.

## License

MIT License
