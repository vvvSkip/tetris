import { computed, readonly, shallowRef } from 'vue'
import { calculateScoreCredits } from '@/hooks/useGameCredits'

const GAME_RECORDS_STORAGE_KEY = 'tetrisGameRecords'
const MAX_RECORD_COUNT = 50

export type GameRating = 'S' | 'A' | 'B' | 'C' | 'D'

export interface GameScoreInput {
  gameplayScore: number
  lines: number
  level: number
  durationSeconds: number
}

export interface GameScoreResult {
  finalScore: number
  durationBonus: number
  levelBonus: number
  rating: GameRating
  ratingText: string
}

export interface GameRecord extends GameScoreResult {
  id: string
  playedAt: number
  gameplayScore: number
  lines: number
  level: number
  durationSeconds: number
  creditsEarned: number
}

export interface GameRecordSummary {
  totalGames: number
  bestScore: number
  bestRating: GameRating | '-'
  totalLines: number
}

const records = shallowRef<GameRecord[]>([])

function createRecordId() {
  return `${Date.now()}-${Math.floor(Math.random() * 100000)}`
}

function getRating(score: number, lines: number): GameRating {
  if (score >= 5000 || lines >= 40) return 'S'
  if (score >= 3000 || lines >= 25) return 'A'
  if (score >= 1500 || lines >= 12) return 'B'
  if (score >= 500 || lines >= 4) return 'C'
  return 'D'
}

function getRatingText(rating: GameRating) {
  const ratingMap: Record<GameRating, string> = {
    S: '方块大师',
    A: '稳定高手',
    B: '进阶玩家',
    C: '熟练上手',
    D: '继续练习'
  }

  return ratingMap[rating]
}

function normalizeRecords(value: unknown): GameRecord[] {
  if (!Array.isArray(value)) return []

  return value
    .filter((item): item is GameRecord => {
      return (
        item &&
        typeof item === 'object' &&
        typeof (item as GameRecord).id === 'string' &&
        typeof (item as GameRecord).playedAt === 'number' &&
        typeof (item as GameRecord).finalScore === 'number'
      )
    })
    .map((item) => ({
      ...item,
      creditsEarned:
        typeof item.creditsEarned === 'number' ? item.creditsEarned : calculateScoreCredits(item)
    }))
    .slice(0, MAX_RECORD_COUNT)
}

export function calculateGameScore(input: GameScoreInput): GameScoreResult {
  const safeDuration = Math.max(0, Math.floor(input.durationSeconds))
  const durationBonus = Math.min(Math.floor(safeDuration / 10) * 10, 600)
  const levelBonus = Math.max(0, input.level - 1) * 150
  const finalScore = input.gameplayScore + durationBonus + levelBonus
  const rating = getRating(finalScore, input.lines)

  return {
    finalScore,
    durationBonus,
    levelBonus,
    rating,
    ratingText: getRatingText(rating)
  }
}

export function formatRecordTime(timestamp: number) {
  const date = new Date(timestamp)
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  const hour = `${date.getHours()}`.padStart(2, '0')
  const minute = `${date.getMinutes()}`.padStart(2, '0')

  return `${month}-${day} ${hour}:${minute}`
}

export function formatDuration(seconds: number) {
  const safeSeconds = Math.max(0, Math.floor(seconds))
  const minute = Math.floor(safeSeconds / 60)
  const second = `${safeSeconds % 60}`.padStart(2, '0')

  return `${minute}:${second}`
}

export function loadGameRecords() {
  records.value = normalizeRecords(uni.getStorageSync(GAME_RECORDS_STORAGE_KEY))
}

export function saveGameRecord(input: GameScoreInput) {
  const scoreResult = calculateGameScore(input)
  const record: GameRecord = {
    id: createRecordId(),
    playedAt: Date.now(),
    gameplayScore: input.gameplayScore,
    lines: input.lines,
    level: input.level,
    durationSeconds: Math.max(0, Math.floor(input.durationSeconds)),
    creditsEarned: calculateScoreCredits(scoreResult),
    ...scoreResult
  }

  const storedRecords = normalizeRecords(uni.getStorageSync(GAME_RECORDS_STORAGE_KEY))
  const nextRecords = [record, ...storedRecords].slice(0, MAX_RECORD_COUNT)
  records.value = nextRecords
  uni.setStorageSync(GAME_RECORDS_STORAGE_KEY, nextRecords)

  return record
}

export function clearGameRecords() {
  records.value = []
  uni.removeStorageSync(GAME_RECORDS_STORAGE_KEY)
}

export function useGameRecords() {
  loadGameRecords()

  const summary = computed<GameRecordSummary>(() => {
    const bestRecord = records.value.reduce<GameRecord | null>((best, record) => {
      if (!best || record.finalScore > best.finalScore) return record
      return best
    }, null)

    return {
      totalGames: records.value.length,
      bestScore: bestRecord?.finalScore || 0,
      bestRating: bestRecord?.rating || '-',
      totalLines: records.value.reduce((total, record) => total + record.lines, 0)
    }
  })

  return {
    records: readonly(records),
    summary,
    loadGameRecords,
    clearGameRecords
  }
}
