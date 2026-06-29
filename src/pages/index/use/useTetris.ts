import { computed, onUnmounted, readonly, shallowRef } from 'vue'
import { saveGameRecord, type GameRecord } from '@/hooks/useGameRecords'

export type PieceKind = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L'
export type GameStatus = 'ready' | 'playing' | 'paused' | 'gameover'
export type CellValue = PieceKind | ''

export interface BoardCell {
  id: string
  value: CellValue
  isGhost: boolean
}

interface Point {
  row: number
  col: number
}

interface Piece {
  kind: PieceKind
  row: number
  col: number
  rotation: number
}

interface UseTetrisOptions {
  onGameOver?: (record: GameRecord) => void
  onLineClear?: (clearedCount: number) => void
}

const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20
const PREVIEW_SIZE = 4
const SCORE_TABLE = [0, 100, 300, 500, 800]
const PIECES: PieceKind[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L']

const SHAPES: Record<PieceKind, Point[][]> = {
  I: [
    [
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 1, col: 3 }
    ],
    [
      { row: 0, col: 2 },
      { row: 1, col: 2 },
      { row: 2, col: 2 },
      { row: 3, col: 2 }
    ]
  ],
  O: [
    [
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 1, col: 1 },
      { row: 1, col: 2 }
    ]
  ],
  T: [
    [
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 }
    ],
    [
      { row: 0, col: 1 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 2, col: 1 }
    ],
    [
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 2, col: 1 }
    ],
    [
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 2, col: 1 }
    ]
  ],
  S: [
    [
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 1, col: 0 },
      { row: 1, col: 1 }
    ],
    [
      { row: 0, col: 1 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 2, col: 2 }
    ]
  ],
  Z: [
    [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 1 },
      { row: 1, col: 2 }
    ],
    [
      { row: 0, col: 2 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 2, col: 1 }
    ]
  ],
  J: [
    [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 }
    ],
    [
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 1, col: 1 },
      { row: 2, col: 1 }
    ],
    [
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 2, col: 2 }
    ],
    [
      { row: 0, col: 1 },
      { row: 1, col: 1 },
      { row: 2, col: 0 },
      { row: 2, col: 1 }
    ]
  ],
  L: [
    [
      { row: 0, col: 2 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 }
    ],
    [
      { row: 0, col: 1 },
      { row: 1, col: 1 },
      { row: 2, col: 1 },
      { row: 2, col: 2 }
    ],
    [
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 2, col: 0 }
    ],
    [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 1 },
      { row: 2, col: 1 }
    ]
  ]
}

function createEmptyBoard() {
  return Array.from({ length: BOARD_HEIGHT }, () => Array<CellValue>(BOARD_WIDTH).fill(''))
}

function randomKind() {
  return PIECES[Math.floor(Math.random() * PIECES.length)]
}

function createPiece(kind = randomKind()): Piece {
  return {
    kind,
    row: 0,
    col: Math.floor(BOARD_WIDTH / 2) - 2,
    rotation: 0
  }
}

function clonePiece(piece: Piece): Piece {
  return {
    kind: piece.kind,
    row: piece.row,
    col: piece.col,
    rotation: piece.rotation
  }
}

function getBlocks(piece: Piece) {
  return SHAPES[piece.kind][piece.rotation].map((block) => ({
    row: piece.row + block.row,
    col: piece.col + block.col
  }))
}

export function useTetris(options: UseTetrisOptions = {}) {
  const board = shallowRef(createEmptyBoard())
  const currentPiece = shallowRef<Piece | null>(null)
  const nextPiece = shallowRef(createPiece())
  const score = shallowRef(0)
  const lines = shallowRef(0)
  const level = shallowRef(1)
  const status = shallowRef<GameStatus>('ready')
  const intervalId = shallowRef<ReturnType<typeof setInterval> | null>(null)
  const startedAt = shallowRef(0)
  const playedSeconds = shallowRef(0)
  const latestRecord = shallowRef<GameRecord | null>(null)

  const dropInterval = computed(() => Math.max(120, 760 - (level.value - 1) * 70))
  const isPlaying = computed(() => status.value === 'playing')
  const actionLabel = computed(() => {
    if (status.value === 'playing') return '暂停'
    if (status.value === 'paused') return '继续'
    return '开始'
  })

  const ghostPiece = computed(() => {
    if (!currentPiece.value) return null

    const piece = clonePiece(currentPiece.value)
    while (canPlace({ ...piece, row: piece.row + 1 })) {
      piece.row += 1
    }

    return piece
  })

  const displayBoard = computed<BoardCell[][]>(() => {
    const cells = board.value.map((row, rowIndex) =>
      row.map((value, colIndex) => ({
        id: `${rowIndex}-${colIndex}`,
        value,
        isGhost: false
      }))
    )

    if (ghostPiece.value) {
      getBlocks(ghostPiece.value).forEach((block) => {
        const cell = cells[block.row]?.[block.col]
        if (cell && !cell.value) {
          cell.value = ghostPiece.value?.kind || ''
          cell.isGhost = true
        }
      })
    }

    if (currentPiece.value) {
      getBlocks(currentPiece.value).forEach((block) => {
        const cell = cells[block.row]?.[block.col]
        if (cell) {
          cell.value = currentPiece.value?.kind || ''
          cell.isGhost = false
        }
      })
    }

    return cells
  })

  const previewBoard = computed<BoardCell[][]>(() => {
    const cells = Array.from({ length: PREVIEW_SIZE }, (_, rowIndex) =>
      Array.from({ length: PREVIEW_SIZE }, (_, colIndex) => ({
        id: `preview-${rowIndex}-${colIndex}`,
        value: '' as CellValue,
        isGhost: false
      }))
    )

    getBlocks({ ...nextPiece.value, row: 0, col: 0 }).forEach((block) => {
      const cell = cells[block.row]?.[block.col]
      if (cell) {
        cell.value = nextPiece.value.kind
      }
    })

    return cells
  })

  const statusText = computed(() => {
    const textMap: Record<GameStatus, string> = {
      ready: '准备开始',
      playing: '游戏中',
      paused: '已暂停',
      gameover: '游戏结束'
    }

    return textMap[status.value]
  })

  function canPlace(piece: Piece) {
    return getBlocks(piece).every((block) => {
      if (block.col < 0 || block.col >= BOARD_WIDTH || block.row >= BOARD_HEIGHT) {
        return false
      }

      if (block.row < 0) {
        return true
      }

      return !board.value[block.row][block.col]
    })
  }

  function stopTimer() {
    if (!intervalId.value) return

    clearInterval(intervalId.value)
    intervalId.value = null
  }

  function startTimer() {
    stopTimer()
    intervalId.value = setInterval(() => {
      stepDown()
    }, dropInterval.value)
  }

  function resetGame(nextStatus: GameStatus = 'ready') {
    stopTimer()
    board.value = createEmptyBoard()
    currentPiece.value = createPiece()
    nextPiece.value = createPiece()
    score.value = 0
    lines.value = 0
    level.value = 1
    status.value = nextStatus
    startedAt.value = nextStatus === 'playing' ? Date.now() : 0
    playedSeconds.value = 0
    latestRecord.value = null
  }

  function getActiveDurationSeconds() {
    if (!startedAt.value) return playedSeconds.value

    return playedSeconds.value + Math.floor((Date.now() - startedAt.value) / 1000)
  }

  function pauseDurationTimer() {
    playedSeconds.value = getActiveDurationSeconds()
    startedAt.value = 0
  }

  function finishGame() {
    if (status.value === 'gameover') return

    const durationSeconds = getActiveDurationSeconds()
    const record = saveGameRecord({
      gameplayScore: score.value,
      lines: lines.value,
      level: level.value,
      durationSeconds
    })

    latestRecord.value = record
    score.value = record.finalScore
    status.value = 'gameover'
    startedAt.value = 0
    playedSeconds.value = 0
    stopTimer()
    options.onGameOver?.(record)
  }

  function startGame() {
    if (status.value === 'ready' || status.value === 'gameover') {
      resetGame('playing')
    } else if (status.value === 'paused') {
      status.value = 'playing'
      startedAt.value = Date.now()
    } else {
      status.value = 'paused'
      pauseDurationTimer()
      stopTimer()
      return
    }

    if (currentPiece.value && canPlace(currentPiece.value)) {
      startTimer()
      return
    }

    finishGame()
  }

  function movePiece(rowOffset: number, colOffset: number) {
    if (!currentPiece.value || status.value !== 'playing') return false

    const next = {
      ...currentPiece.value,
      row: currentPiece.value.row + rowOffset,
      col: currentPiece.value.col + colOffset
    }

    if (!canPlace(next)) return false

    currentPiece.value = next
    return true
  }

  function moveLeft() {
    return movePiece(0, -1)
  }

  function moveRight() {
    return movePiece(0, 1)
  }

  function softDrop() {
    if (movePiece(1, 0)) {
      score.value += 1
      return true
    }

    stepDown()
    return false
  }

  function rotatePiece() {
    if (!currentPiece.value || status.value !== 'playing') return false

    const rotationCount = SHAPES[currentPiece.value.kind].length
    const nextRotation = (currentPiece.value.rotation + 1) % rotationCount
    const offsets = [0, -1, 1, -2, 2]

    for (const colOffset of offsets) {
      const next = {
        ...currentPiece.value,
        rotation: nextRotation,
        col: currentPiece.value.col + colOffset
      }

      if (canPlace(next)) {
        currentPiece.value = next
        return true
      }
    }

    return false
  }

  function hardDrop() {
    if (!currentPiece.value || status.value !== 'playing') return false

    let distance = 0
    while (movePiece(1, 0)) {
      distance += 1
    }

    score.value += distance * 2
    lockPiece()
    return true
  }

  function stepDown() {
    if (status.value !== 'playing') return false

    if (movePiece(1, 0)) {
      return true
    }

    lockPiece()
    return false
  }

  function lockPiece() {
    if (!currentPiece.value) return

    const nextBoard = board.value.map((row) => [...row])
    getBlocks(currentPiece.value).forEach((block) => {
      if (block.row >= 0 && block.row < BOARD_HEIGHT) {
        nextBoard[block.row][block.col] = currentPiece.value?.kind || ''
      }
    })

    board.value = clearCompletedLines(nextBoard)
    spawnPiece()
  }

  function clearCompletedLines(nextBoard: CellValue[][]) {
    const remainingRows = nextBoard.filter((row) => row.some((cell) => !cell))
    const clearedCount = BOARD_HEIGHT - remainingRows.length

    if (clearedCount > 0) {
      const emptyRows = Array.from({ length: clearedCount }, () => Array<CellValue>(BOARD_WIDTH).fill(''))
      lines.value += clearedCount
      level.value = Math.floor(lines.value / 10) + 1
      score.value += SCORE_TABLE[clearedCount] * level.value
      options.onLineClear?.(clearedCount)

      if (status.value === 'playing') {
        startTimer()
      }

      return [...emptyRows, ...remainingRows]
    }

    return nextBoard
  }

  function spawnPiece() {
    const next = clonePiece(nextPiece.value)
    currentPiece.value = next
    nextPiece.value = createPiece()

    if (!canPlace(next)) {
      finishGame()
    }
  }

  function pauseGame() {
    if (status.value !== 'playing') return

    status.value = 'paused'
    pauseDurationTimer()
    stopTimer()
  }

  onUnmounted(() => {
    stopTimer()
  })

  resetGame()

  return {
    displayBoard,
    previewBoard,
    score: readonly(score),
    lines: readonly(lines),
    level: readonly(level),
    status: readonly(status),
    latestRecord: readonly(latestRecord),
    isPlaying,
    actionLabel,
    statusText,
    startGame,
    pauseGame,
    resetGame,
    moveLeft,
    moveRight,
    softDrop,
    rotatePiece,
    hardDrop
  }
}
