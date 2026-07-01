import { useCallback, useEffect, useRef, useState } from 'react'
import { useApp } from '../context/AppContext'
import { IconPlay, IconPause, IconReset, IconClose, IconCheck } from './icons'
import { formatClock, formatMinutes, classNames } from '../utils/helpers'

// A gentle two-note chime using the Web Audio API — no audio asset needed.
function playChime() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    const now = ctx.currentTime
    ;[660, 880].forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      const t = now + i * 0.18
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(0.18, t + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.4)
      osc.connect(gain).connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.42)
    })
    setTimeout(() => ctx.close(), 1200)
  } catch {
    /* audio not available — silent fail */
  }
}

export default function FocusMode({ taskId, onClose }) {
  const { state, dispatch } = useApp()
  const task = state.tasks.find((t) => t.id === taskId)
  const { focusLength, breakLength } = state.settings

  const [mode, setMode] = useState('focus') // 'focus' | 'break'
  const [running, setRunning] = useState(true)
  const [secondsLeft, setSecondsLeft] = useState(focusLength * 60)
  const [completedSessions, setCompletedSessions] = useState(0)

  const totalRef = useRef(focusLength * 60)
  const unloggedRef = useRef(0) // focus seconds not yet committed to the store

  // Commit any pending focused seconds to the store.
  const flush = useCallback(() => {
    if (unloggedRef.current >= 1 && task) {
      dispatch({ type: 'LOG_FOCUS', taskId: task.id, seconds: Math.round(unloggedRef.current) })
    }
    unloggedRef.current = 0
  }, [dispatch, task])

  const switchMode = useCallback(
    (next) => {
      flush()
      const mins = next === 'focus' ? focusLength : breakLength
      totalRef.current = mins * 60
      setSecondsLeft(mins * 60)
      setMode(next)
    },
    [flush, focusLength, breakLength],
  )

  // The ticking loop.
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (mode === 'focus') unloggedRef.current += 1
        if (s <= 1) {
          playChime()
          if (mode === 'focus') {
            flush()
            setCompletedSessions((c) => c + 1)
            // move to break automatically
            queueMicrotask(() => switchMode('break'))
          } else {
            queueMicrotask(() => switchMode('focus'))
            setRunning(false) // pause after a break so the user chooses to resume
          }
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [running, mode, flush, switchMode])

  // Flush on unmount (e.g. closing the overlay mid-session).
  useEffect(() => {
    return () => flush()
  }, [flush])

  // Escape closes.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') handleClose()
      if (e.key === ' ') {
        e.preventDefault()
        setRunning((r) => !r)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClose = () => {
    flush()
    onClose()
  }

  const reset = () => {
    flush()
    totalRef.current = (mode === 'focus' ? focusLength : breakLength) * 60
    setSecondsLeft(totalRef.current)
    setRunning(false)
  }

  const adjust = (deltaMin) => {
    if (mode !== 'focus') return
    const next = Math.max(5, Math.min(90, focusLength + deltaMin))
    dispatch({ type: 'UPDATE_SETTINGS', patch: { focusLength: next } })
    if (!running) {
      totalRef.current = next * 60
      setSecondsLeft(next * 60)
    }
  }

  if (!task) {
    onClose()
    return null
  }

  const total = totalRef.current
  const progress = total > 0 ? 1 - secondsLeft / total : 0
  const R = 120
  const C = 2 * Math.PI * R
  const isFocus = mode === 'focus'
  const totalFocusedMin = Math.round(((task.focusSeconds || 0) + unloggedRef.current) / 60)

  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-ink-950 p-6">
      <div
        aria-hidden
        className={classNames(
          'pointer-events-none absolute inset-0 opacity-40 transition-colors duration-1000',
          isFocus
            ? 'bg-[radial-gradient(60%_50%_at_50%_40%,rgba(45,212,191,0.14),transparent)]'
            : 'bg-[radial-gradient(60%_50%_at_50%_40%,rgba(167,139,250,0.14),transparent)]',
        )}
      />

      <button
        onClick={handleClose}
        className="absolute right-5 top-5 flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-ink-400 transition hover:bg-ink-800 hover:text-ink-100"
        aria-label="Exit focus mode"
      >
        <IconClose width={18} height={18} />
        <span className="hidden sm:inline">Exit</span>
      </button>

      <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
        <span
          className={classNames(
            'mb-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider',
            isFocus ? 'bg-focus-600/15 text-focus-400' : 'bg-violet-500/15 text-violet-300',
          )}
        >
          {isFocus ? 'Focus session' : 'Break'}
        </span>

        <h2 className="mb-1 text-balance text-xl font-semibold text-ink-50">{task.title}</h2>
        <p className="mb-8 text-sm text-ink-400">
          {completedSessions} session{completedSessions === 1 ? '' : 's'} this sitting ·{' '}
          {formatMinutes(totalFocusedMin)} total
        </p>

        <div className="relative mb-8 grid place-items-center">
          <svg width="280" height="280" viewBox="0 0 280 280" className="-rotate-90">
            <circle cx="140" cy="140" r={R} fill="none" stroke="#20243a" strokeWidth="10" />
            <circle
              cx="140"
              cy="140"
              r={R}
              fill="none"
              stroke={isFocus ? '#2dd4bf' : '#a78bfa'}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - progress)}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span
              className="font-mono text-5xl font-semibold tabular-nums text-ink-50"
              role="timer"
              aria-live="off"
            >
              {formatClock(secondsLeft)}
            </span>
            {isFocus && (
              <div className="mt-1 flex items-center gap-2 text-ink-500">
                <button
                  onClick={() => adjust(-5)}
                  className="rounded px-1.5 text-lg leading-none hover:text-ink-200"
                  aria-label="Decrease focus length"
                >
                  −
                </button>
                <span className="text-xs">{focusLength} min</span>
                <button
                  onClick={() => adjust(5)}
                  className="rounded px-1.5 text-lg leading-none hover:text-ink-200"
                  aria-label="Increase focus length"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={reset}
            className="grid h-12 w-12 place-items-center rounded-full border border-ink-700 text-ink-300 transition hover:bg-ink-800 hover:text-ink-100"
            aria-label="Reset timer"
          >
            <IconReset width={20} height={20} />
          </button>

          <button
            onClick={() => setRunning((r) => !r)}
            className={classNames(
              'grid h-16 w-16 place-items-center rounded-full text-ink-950 shadow-lg transition',
              isFocus ? 'bg-focus-500 hover:bg-focus-400' : 'bg-violet-400 hover:bg-violet-300',
            )}
            aria-label={running ? 'Pause timer' : 'Start timer'}
          >
            {running ? <IconPause width={26} height={26} /> : <IconPlay width={26} height={26} />}
          </button>

          <button
            onClick={() => switchMode(isFocus ? 'break' : 'focus')}
            className="grid h-12 w-12 place-items-center rounded-full border border-ink-700 text-ink-300 transition hover:bg-ink-800 hover:text-ink-100"
            aria-label={isFocus ? 'Switch to break' : 'Switch to focus'}
            title={isFocus ? 'Skip to break' : 'Skip to focus'}
          >
            {isFocus ? '☕' : <IconCheck width={20} height={20} />}
          </button>
        </div>

        <p className="mt-8 text-xs text-ink-600">
          Space to play/pause · Esc to exit · Time is saved to this task
        </p>
      </div>
    </div>
  )
}
