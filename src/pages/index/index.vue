<script setup lang="ts">
import { onHide, onShow } from '@dcloudio/uni-app'
import { onMounted, onUnmounted, shallowRef, watch } from 'vue'
import CreditPanel from './components/creditPanel.vue'
import GameBoard from './components/gameBoard.vue'
import GamePanel from './components/gamePanel.vue'
import MoreMenu from './components/moreMenu.vue'
import RulePopup from './components/rulePopup.vue'
import TouchControls from './components/touchControls.vue'
import { useAntiAddiction } from '@/hooks/useAntiAddiction'
import { PLAY_EXCHANGE_COST, useGameCredits } from '@/hooks/useGameCredits'
import type { GameRecord } from '@/hooks/useGameRecords'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import { useTheme } from '@/hooks/useTheme'
import { useTetris } from './use/useTetris'

defineOptions({
  options: {
    styleIsolation: 'shared'
  }
})

const {
  creditState,
  remainingFreePlays,
  availablePlays,
  canExchangePlay,
  loadGameCredits,
  consumePlay,
  exchangePlay,
  awardCreditsForRecord
} = useGameCredits()

const { loadAntiAddictionState, startPlaySession, stopPlaySession } = useAntiAddiction()
const { themeClass, themeLabel, nextThemeLabel, loadTheme, toggleTheme } = useTheme()
const { soundLabel, nextSoundLabel, loadSoundSetting, toggleSound, playSoundEffect } = useSoundEffects()
const rulePopupRef = shallowRef<InstanceType<typeof RulePopup> | null>(null)
const layoutStyle = shallowRef<Record<string, string>>({
  '--tetris-window-height': '100vh',
  '--tetris-safe-bottom': '0px'
})

const {
  displayBoard,
  previewBoard,
  score,
  lines,
  level,
  status,
  actionLabel,
  statusText,
  startGame,
  resetGame,
  moveLeft,
  moveRight,
  softDrop,
  rotatePiece,
  hardDrop
} = useTetris({
  onGameOver: handleGameOver,
  onLineClear: handleLineClear
})

function handleGameOver(record: GameRecord) {
  playSoundEffect('gameOver')

  const earnedCredits = awardCreditsForRecord(record)
  if (earnedCredits <= 0) return

  uni.showToast({
    title: `获得${earnedCredits}积分`,
    icon: 'none'
  })
}

function handleLineClear() {
  playSoundEffect('clear')
}

function handleReset() {
  resetGame('ready')
  playSoundEffect('menu')
}

function handleToggleGame() {
  const previousStatus = status.value

  if (status.value === 'ready' || status.value === 'gameover') {
    const result = consumePlay()
    if (!result.success) {
      uni.showToast({
        title: '次数不足，可用积分兑换',
        icon: 'none'
      })
      return
    }
  }

  startGame()

  if (previousStatus === 'playing' && status.value === 'paused') {
    playSoundEffect('pause')
    return
  }

  if (status.value === 'playing') {
    playSoundEffect('start')
  }
}

function handleExchangePlay() {
  const exchanged = exchangePlay()
  if (exchanged) {
    playSoundEffect('menu')
  }

  uni.showToast({
    title: exchanged ? '已兑换1次' : '积分不足',
    icon: 'none'
  })
}

function handleShowRecords() {
  playSoundEffect('menu')
  uni.navigateTo({
    url: '/pages/records/index'
  })
}

function handleShowExchangeRecords() {
  playSoundEffect('menu')
  uni.navigateTo({
    url: '/pages/exchangeRecords/index'
  })
}

function handleShowRules() {
  playSoundEffect('menu')
  rulePopupRef.value?.changeShow()
}

function handleToggleTheme() {
  toggleTheme()
  playSoundEffect('menu')
}

function handleToggleSound() {
  const enabled = toggleSound()

  if (enabled) {
    playSoundEffect('menu')
  }

  uni.showToast({
    title: enabled ? '音效已开启' : '音效已关闭',
    icon: 'none'
  })
}

function handleMoveLeft() {
  if (moveLeft()) {
    playSoundEffect('move')
  }
}

function handleMoveRight() {
  if (moveRight()) {
    playSoundEffect('move')
  }
}

function handleSoftDrop() {
  if (softDrop()) {
    playSoundEffect('drop')
  }
}

function handleRotatePiece() {
  if (rotatePiece()) {
    playSoundEffect('rotate')
  }
}

function handleHardDrop() {
  if (hardDrop()) {
    playSoundEffect('drop')
  }
}

function handleAntiAddictionReminder(params: { totalMinutes: number }) {
  uni.showModal({
    title: '健康提醒',
    content: `今日已累计游玩${params.totalMinutes}分钟，建议放下手机休息一会儿。`,
    showCancel: false,
    confirmText: '知道了',
    confirmColor: '#2563eb'
  })
}

function handleKeydown(event: KeyboardEvent) {
  const actionMap: Record<string, () => void> = {
    ArrowLeft: handleMoveLeft,
    ArrowRight: handleMoveRight,
    ArrowDown: handleSoftDrop,
    ArrowUp: handleRotatePiece,
    ' ': handleHardDrop,
    Enter: handleToggleGame
  }

  const action = actionMap[event.key]
  if (!action) return

  event.preventDefault()
  action()
}

function updateLayoutStyle() {
  let windowHeight = 0
  let safeBottom = 0
  let isH5Runtime = false

  try {
    const systemInfo = uni.getSystemInfoSync()
    windowHeight = Number(systemInfo.windowHeight || windowHeight)
    safeBottom = Number(systemInfo.safeAreaInsets?.bottom || 0)

    if (!safeBottom && systemInfo.screenHeight && systemInfo.safeArea?.bottom) {
      safeBottom = Math.max(0, Number(systemInfo.screenHeight) - Number(systemInfo.safeArea.bottom))
    }
  } catch (error) {
    console.warn('update layout failed', error)
  }

  // #ifdef H5
  isH5Runtime = true
  if (typeof window !== 'undefined') {
    const visualViewport = window.visualViewport
    const visualHeight = Math.floor(visualViewport?.height || 0)

    windowHeight = visualHeight || windowHeight || Math.floor(window.innerHeight || 0)
  }
  // #endif

  const bottomInset = isH5Runtime ? 0 : Math.max(0, safeBottom)

  layoutStyle.value = {
    '--tetris-window-height': windowHeight > 0 ? `${windowHeight}px` : '100vh',
    '--tetris-safe-bottom': `${bottomInset}px`
  }
}

watch(
  status,
  (nextStatus) => {
    if (nextStatus === 'playing') {
      startPlaySession(handleAntiAddictionReminder)
      return
    }

    stopPlaySession()
  },
  { immediate: true }
)

onMounted(() => {
  updateLayoutStyle()

  // #ifdef H5
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('resize', updateLayoutStyle)
  window.visualViewport?.addEventListener('resize', updateLayoutStyle)
  window.visualViewport?.addEventListener('scroll', updateLayoutStyle)
  // #endif
})

onShow(() => {
  updateLayoutStyle()
  loadTheme()
  loadSoundSetting()
  loadGameCredits()
  loadAntiAddictionState()
  if (status.value === 'playing') {
    startPlaySession(handleAntiAddictionReminder)
  }
})

onHide(() => {
  stopPlaySession()
})

onUnmounted(() => {
  stopPlaySession()

  // #ifdef H5
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', updateLayoutStyle)
  window.visualViewport?.removeEventListener('resize', updateLayoutStyle)
  window.visualViewport?.removeEventListener('scroll', updateLayoutStyle)
  // #endif
})
</script>

<template>
  <view class="tetris-page" :class="themeClass" :style="layoutStyle">
    <view class="tetris-page__content">
      <view class="tetris-page__top">
        <CreditPanel
          :points="creditState.points"
          :remaining-free-plays="remainingFreePlays"
          :extra-plays="creditState.extraPlays"
          :available-plays="availablePlays"
          :can-exchange="canExchangePlay"
          :exchange-cost="PLAY_EXCHANGE_COST"
          @exchange="handleExchangePlay"
        />

        <MoreMenu
          :theme-label="themeLabel"
          :next-theme-label="nextThemeLabel"
          :sound-label="soundLabel"
          :next-sound-label="nextSoundLabel"
          @show-rules="handleShowRules"
          @show-records="handleShowRecords"
          @show-exchange-records="handleShowExchangeRecords"
          @toggle-theme="handleToggleTheme"
          @toggle-sound="handleToggleSound"
        />
      </view>

      <GamePanel
        :score="score"
        :lines="lines"
        :level="level"
        :status="status"
        :status-text="statusText"
        :preview-cells="previewBoard"
      />

      <view class="tetris-page__board-area">
        <GameBoard :cells="displayBoard" />
      </view>

      <TouchControls
        :action-label="actionLabel"
        :disabled="status !== 'playing'"
        @move-left="handleMoveLeft"
        @move-right="handleMoveRight"
        @soft-drop="handleSoftDrop"
        @rotate="handleRotatePiece"
        @hard-drop="handleHardDrop"
        @toggle="handleToggleGame"
        @reset="handleReset"
      />

      <RulePopup ref="rulePopupRef" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.tetris-page {
  height: var(--tetris-window-height, 100vh);
  padding: 8rpx 20rpx;
  padding-bottom: calc(8rpx + var(--tetris-safe-bottom, 0px));
  background: var(--tetris-page-bg);
  box-sizing: border-box;
  overflow: hidden;
}

/* #ifdef H5 */
.tetris-page {
  height: var(--tetris-window-height, 100dvh);
  padding-bottom: calc(8rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(8rpx + env(safe-area-inset-bottom));
}
/* #endif */

.tetris-page__content {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  max-width: 720rpx;
  margin: 0 auto;
  gap: 6rpx;
  flex-direction: column;
  justify-content: flex-start;
  overflow: hidden;
}

.tetris-page__top {
  display: flex;
  align-items: stretch;
  width: 100%;
  gap: 8rpx;
}

.tetris-page__top,
:deep(.game-panel),
:deep(.touch-controls) {
  flex-shrink: 0;
}

.tetris-page__board-area {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 0;
  flex: 1 1 auto;
  padding: 2rpx 0;
  box-sizing: border-box;
  overflow: hidden;
}

@media screen and (max-height: 700px) {
  .tetris-page {
    padding-top: 6rpx;
    padding-bottom: calc(6rpx + var(--tetris-safe-bottom, 0px));
  }

  /* #ifdef H5 */
  .tetris-page {
    padding-bottom: calc(6rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(6rpx + env(safe-area-inset-bottom));
  }
  /* #endif */

  .tetris-page__content {
    gap: 4rpx;
  }

  .tetris-page__top {
    gap: 6rpx;
  }
}
</style>
