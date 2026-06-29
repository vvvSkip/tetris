<script setup lang="ts">
import type { BoardCell, GameStatus } from '../use/useTetris'

interface Props {
  score: number
  lines: number
  level: number
  status: GameStatus
  statusText: string
  previewCells: BoardCell[][]
}

defineProps<Props>()

defineOptions({
  options: {
    styleIsolation: 'shared'
  }
})

function getPreviewCellClass(cell: BoardCell) {
  return {
    'game-panel__preview-cell': true,
    'game-panel__preview-cell--filled': !!cell.value,
    [`game-panel__preview-cell--${cell.value.toLowerCase()}`]: !!cell.value
  }
}
</script>

<template>
  <view class="game-panel">
    <view class="game-panel__summary">
      <view class="game-panel__item">
        <text class="game-panel__label">分数</text>
        <text class="game-panel__value">{{ score }}</text>
      </view>
      <view class="game-panel__item">
        <text class="game-panel__label">行数</text>
        <text class="game-panel__value">{{ lines }}</text>
      </view>
      <view class="game-panel__item">
        <text class="game-panel__label">等级</text>
        <text class="game-panel__value">{{ level }}</text>
      </view>
    </view>

    <view class="game-panel__side">
      <view class="game-panel__meta">
        <view class="game-panel__status" :class="`game-panel__status--${status}`">
          {{ statusText }}
        </view>
      </view>
      <view class="game-panel__preview">
        <view v-for="row in previewCells" :key="row[0].id" class="game-panel__preview-row">
          <view v-for="cell in row" :key="cell.id" :class="getPreviewCellClass(cell)" />
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.game-panel {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  width: 100%;
  gap: 10rpx;
}

.game-panel__summary {
  display: flex;
  flex: 1;
  min-width: 0;
  gap: 8rpx;
}

.game-panel__item,
.game-panel__side {
  background-color: var(--tetris-panel-bg, rgba(15, 23, 42, 0.76));
  border: 2rpx solid var(--tetris-panel-border, rgba(148, 163, 184, 0.16));
  border-radius: 14rpx;
}

.game-panel__item {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  justify-content: center;
  padding: 10rpx 8rpx;
}

.game-panel__label {
  color: var(--tetris-text-secondary, #94a3b8);
  font-size: 20rpx;
  line-height: 26rpx;
}

.game-panel__value {
  margin-top: 2rpx;
  color: var(--tetris-text-primary, #f8fafc);
  font-size: 28rpx;
  font-weight: 700;
  line-height: 34rpx;
}

.game-panel__side {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 190rpx;
  padding: 8rpx;
  box-sizing: border-box;
}

.game-panel__status {
  width: 82rpx;
  min-width: 0;
  color: var(--tetris-text-muted, #cbd5e1);
  font-size: 20rpx;
  line-height: 26rpx;
}

.game-panel__status--playing {
  color: #34d399;
}

.game-panel__status--paused,
.game-panel__status--ready {
  color: #facc15;
}

.game-panel__status--gameover {
  color: #fb7185;
}

.game-panel__preview {
  width: 76rpx;
}

.game-panel__preview-row {
  display: flex;
}

.game-panel__preview-cell {
  width: 17rpx;
  height: 17rpx;
  flex: 0 0 17rpx;
  margin: 1rpx;
  background-color: var(--tetris-cell-bg, rgba(30, 41, 59, 0.8));
  border-radius: 5rpx;
}

.game-panel__preview-cell--filled {
  border: 1rpx solid rgba(255, 255, 255, 0.18);
}

.game-panel__preview-cell--i {
  background-color: #22d3ee;
}

.game-panel__preview-cell--o {
  background-color: #facc15;
}

.game-panel__preview-cell--t {
  background-color: #a855f7;
}

.game-panel__preview-cell--s {
  background-color: #34d399;
}

.game-panel__preview-cell--z {
  background-color: #fb7185;
}

.game-panel__preview-cell--j {
  background-color: #60a5fa;
}

.game-panel__preview-cell--l {
  background-color: #fb923c;
}
</style>
