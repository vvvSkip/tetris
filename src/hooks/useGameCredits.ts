import { computed, readonly, shallowRef } from 'vue'
import type { GameRating, GameRecord } from '@/hooks/useGameRecords'

const GAME_CREDITS_STORAGE_KEY = 'tetrisGameCredits'

export const DAILY_FREE_PLAYS = 5
export const PLAY_EXCHANGE_COST = 100

interface GameCreditState {
  points: number
  freePlayDate: string
  freePlaysUsed: number
  extraPlays: number
  totalEarnedPoints: number
  totalExchangedPlays: number
  exchangeRecords: ExchangeRecord[]
}

interface ConsumePlayResult {
  success: boolean
  source: 'free' | 'extra' | 'none'
}

export interface ExchangeRecord {
  id: string
  exchangedAt: number
  cost: number
  plays: number
  pointsBefore: number
  pointsAfter: number
  extraPlaysAfter: number
}

const RATING_CREDIT_BONUS: Record<GameRating, number> = {
  S: 30,
  A: 20,
  B: 10,
  C: 5,
  D: 0
}

const defaultState: GameCreditState = {
  points: 0,
  freePlayDate: getTodayKey(),
  freePlaysUsed: 0,
  extraPlays: 0,
  totalEarnedPoints: 0,
  totalExchangedPlays: 0,
  exchangeRecords: []
}

const creditState = shallowRef<GameCreditState>({ ...defaultState })

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

function createExchangeRecordId() {
  return `${Date.now()}-${Math.floor(Math.random() * 100000)}`
}

function normalizeExchangeRecords(value: unknown): ExchangeRecord[] {
  if (!Array.isArray(value)) return []

  return value
    .filter((item): item is ExchangeRecord => {
      return (
        item &&
        typeof item === 'object' &&
        typeof (item as ExchangeRecord).id === 'string' &&
        typeof (item as ExchangeRecord).exchangedAt === 'number' &&
        typeof (item as ExchangeRecord).cost === 'number'
      )
    })
    .map((item) => ({
      id: item.id,
      exchangedAt: item.exchangedAt,
      cost: normalizeNumber(item.cost),
      plays: Math.max(1, normalizeNumber(item.plays)),
      pointsBefore: normalizeNumber(item.pointsBefore),
      pointsAfter: normalizeNumber(item.pointsAfter),
      extraPlaysAfter: normalizeNumber(item.extraPlaysAfter)
    }))
    .sort((prev, next) => next.exchangedAt - prev.exchangedAt)
}

function normalizeCreditState(value: unknown): GameCreditState {
  if (!value || typeof value !== 'object') return { ...defaultState, freePlayDate: getTodayKey() }

  const state = value as Partial<GameCreditState>

  return {
    points: normalizeNumber(state.points),
    freePlayDate: typeof state.freePlayDate === 'string' ? state.freePlayDate : getTodayKey(),
    freePlaysUsed: Math.min(normalizeNumber(state.freePlaysUsed), DAILY_FREE_PLAYS),
    extraPlays: normalizeNumber(state.extraPlays),
    totalEarnedPoints: normalizeNumber(state.totalEarnedPoints),
    totalExchangedPlays: normalizeNumber(state.totalExchangedPlays),
    exchangeRecords: normalizeExchangeRecords(state.exchangeRecords)
  }
}

function persistCreditState() {
  uni.setStorageSync(GAME_CREDITS_STORAGE_KEY, creditState.value)
}

function refreshDailyFreePlays() {
  const today = getTodayKey()
  if (creditState.value.freePlayDate === today) return

  creditState.value = {
    ...creditState.value,
    freePlayDate: today,
    freePlaysUsed: 0
  }
  persistCreditState()
}

export function calculateScoreCredits(record: Pick<GameRecord, 'finalScore' | 'rating'>) {
  const scoreCredits = Math.floor(Math.max(0, record.finalScore) / 100)
  const ratingBonus = record.finalScore > 0 ? RATING_CREDIT_BONUS[record.rating] : 0

  return scoreCredits + ratingBonus
}

export function loadGameCredits() {
  creditState.value = normalizeCreditState(uni.getStorageSync(GAME_CREDITS_STORAGE_KEY))
  refreshDailyFreePlays()
}

export function useGameCredits() {
  loadGameCredits()

  const remainingFreePlays = computed(() => {
    return Math.max(0, DAILY_FREE_PLAYS - creditState.value.freePlaysUsed)
  })

  const exchangeRecords = computed(() => creditState.value.exchangeRecords)
  const availablePlays = computed(() => remainingFreePlays.value + creditState.value.extraPlays)
  const canExchangePlay = computed(() => creditState.value.points >= PLAY_EXCHANGE_COST)

  function consumePlay(): ConsumePlayResult {
    refreshDailyFreePlays()

    if (remainingFreePlays.value > 0) {
      creditState.value = {
        ...creditState.value,
        freePlaysUsed: creditState.value.freePlaysUsed + 1
      }
      persistCreditState()
      return { success: true, source: 'free' }
    }

    if (creditState.value.extraPlays > 0) {
      creditState.value = {
        ...creditState.value,
        extraPlays: creditState.value.extraPlays - 1
      }
      persistCreditState()
      return { success: true, source: 'extra' }
    }

    return { success: false, source: 'none' }
  }

  function exchangePlay() {
    refreshDailyFreePlays()

    if (creditState.value.points < PLAY_EXCHANGE_COST) {
      return false
    }

    const pointsBefore = creditState.value.points
    const pointsAfter = pointsBefore - PLAY_EXCHANGE_COST
    const extraPlaysAfter = creditState.value.extraPlays + 1
    const exchangeRecord: ExchangeRecord = {
      id: createExchangeRecordId(),
      exchangedAt: Date.now(),
      cost: PLAY_EXCHANGE_COST,
      plays: 1,
      pointsBefore,
      pointsAfter,
      extraPlaysAfter
    }

    creditState.value = {
      ...creditState.value,
      points: pointsAfter,
      extraPlays: extraPlaysAfter,
      totalExchangedPlays: creditState.value.totalExchangedPlays + 1,
      exchangeRecords: [exchangeRecord, ...creditState.value.exchangeRecords]
    }
    persistCreditState()

    return true
  }

  function awardCreditsForRecord(record: GameRecord) {
    const earnedCredits = calculateScoreCredits(record)
    if (earnedCredits <= 0) return 0

    creditState.value = {
      ...creditState.value,
      points: creditState.value.points + earnedCredits,
      totalEarnedPoints: creditState.value.totalEarnedPoints + earnedCredits
    }
    persistCreditState()

    return earnedCredits
  }

  return {
    creditState: readonly(creditState),
    exchangeRecords,
    remainingFreePlays,
    availablePlays,
    canExchangePlay,
    loadGameCredits,
    consumePlay,
    exchangePlay,
    awardCreditsForRecord
  }
}
