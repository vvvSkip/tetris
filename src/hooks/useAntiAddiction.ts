import { readonly, shallowRef } from 'vue'

const ANTI_ADDICTION_STORAGE_KEY = 'tetrisAntiAddiction'
const CHECK_INTERVAL_MS = 60 * 1000

export const FIRST_REMINDER_MINUTES = 30
export const REMINDER_INTERVAL_MINUTES = 15

interface AntiAddictionState {
  playDate: string
  accumulatedSeconds: number
  lastReminderMinutes: number
}

interface AntiAddictionReminder {
  totalMinutes: number
}

const defaultState: AntiAddictionState = {
  playDate: getTodayKey(),
  accumulatedSeconds: 0,
  lastReminderMinutes: 0
}

const antiAddictionState = shallowRef<AntiAddictionState>({ ...defaultState })
const sessionStartedAt = shallowRef(0)
const checkTimer = shallowRef<ReturnType<typeof setInterval> | null>(null)

function getTodayKey() {
  const date = new Date()
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')

  return `${year}-${month}-${day}`
}

function normalizeNumber(value: unknown) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 0
  return Math.max(0, Math.floor(value))
}

function normalizeState(value: unknown): AntiAddictionState {
  if (!value || typeof value !== 'object') return { ...defaultState, playDate: getTodayKey() }

  const state = value as Partial<AntiAddictionState>

  return {
    playDate: typeof state.playDate === 'string' ? state.playDate : getTodayKey(),
    accumulatedSeconds: normalizeNumber(state.accumulatedSeconds),
    lastReminderMinutes: normalizeNumber(state.lastReminderMinutes)
  }
}

function persistState() {
  uni.setStorageSync(ANTI_ADDICTION_STORAGE_KEY, antiAddictionState.value)
}

function refreshDailyState() {
  const today = getTodayKey()
  if (antiAddictionState.value.playDate === today) return

  antiAddictionState.value = {
    playDate: today,
    accumulatedSeconds: 0,
    lastReminderMinutes: 0
  }
  sessionStartedAt.value = 0
  persistState()
}

function getActiveSeconds() {
  if (!sessionStartedAt.value) return antiAddictionState.value.accumulatedSeconds

  return (
    antiAddictionState.value.accumulatedSeconds +
    Math.floor((Date.now() - sessionStartedAt.value) / 1000)
  )
}

function getNextReminderMinutes() {
  if (antiAddictionState.value.lastReminderMinutes < FIRST_REMINDER_MINUTES) {
    return FIRST_REMINDER_MINUTES
  }

  return antiAddictionState.value.lastReminderMinutes + REMINDER_INTERVAL_MINUTES
}

function commitActiveSeconds() {
  if (!sessionStartedAt.value) return

  antiAddictionState.value = {
    ...antiAddictionState.value,
    accumulatedSeconds: getActiveSeconds()
  }
  sessionStartedAt.value = 0
  persistState()
}

export function loadAntiAddictionState() {
  antiAddictionState.value = normalizeState(uni.getStorageSync(ANTI_ADDICTION_STORAGE_KEY))
  refreshDailyState()
}

export function useAntiAddiction() {
  loadAntiAddictionState()

  function stopReminderTimer() {
    if (!checkTimer.value) return

    clearInterval(checkTimer.value)
    checkTimer.value = null
  }

  function checkReminder(onReminder: (reminder: AntiAddictionReminder) => void) {
    refreshDailyState()

    const totalMinutes = Math.floor(getActiveSeconds() / 60)
    const nextReminderMinutes = getNextReminderMinutes()

    if (totalMinutes < nextReminderMinutes) return

    antiAddictionState.value = {
      ...antiAddictionState.value,
      lastReminderMinutes: nextReminderMinutes
    }
    persistState()
    onReminder({ totalMinutes })
  }

  function startPlaySession(onReminder: (reminder: AntiAddictionReminder) => void) {
    refreshDailyState()

    if (!sessionStartedAt.value) {
      sessionStartedAt.value = Date.now()
    }

    stopReminderTimer()
    checkTimer.value = setInterval(() => {
      checkReminder(onReminder)
    }, CHECK_INTERVAL_MS)
    checkReminder(onReminder)
  }

  function stopPlaySession() {
    stopReminderTimer()
    commitActiveSeconds()
  }

  return {
    antiAddictionState: readonly(antiAddictionState),
    loadAntiAddictionState,
    startPlaySession,
    stopPlaySession
  }
}
