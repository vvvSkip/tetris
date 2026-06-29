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
  // #ifdef H5
  window.addEventListener('keydown', handleKeydown)
  // #endif
})

onShow(() => {
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
  // #endif
})
</script>

<template>
  <view class="tetris-page" :class="themeClass">
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

      <GameBoard :cells="displayBoard" />

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
  height: 100vh;
  padding: 8rpx 20rpx;
  padding-bottom: calc(8rpx + env(safe-area-inset-bottom));
  background: var(--tetris-page-bg);
  box-sizing: border-box;
  overflow: hidden;
}

/* #ifdef H5 */
.tetris-page {
  height: 100vh;
}
/* #endif */

.tetris-page__content {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  max-width: 720rpx;
  margin: 0 auto;
  gap: 4rpx;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}

.tetris-page__top {
  display: flex;
  align-items: stretch;
  width: 100%;
  gap: 8rpx;
}

@media screen and (max-height: 700px) {
  .tetris-page {
    padding-top: 6rpx;
    padding-bottom: calc(6rpx + env(safe-area-inset-bottom));
  }

  .tetris-page__content {
    gap: 2rpx;
  }

  .tetris-page__top {
    gap: 6rpx;
  }
}
</style>
