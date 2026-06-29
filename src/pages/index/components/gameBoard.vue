<script setup lang="ts">
import { computed } from 'vue'
import type { BoardCell } from '../use/useTetris'

interface Props {
  cells: BoardCell[][]
}

const props = defineProps<Props>()

defineOptions({
  options: {
    styleIsolation: 'shared'
  }
})

const rows = computed(() => props.cells)

function getCellClass(cell: BoardCell) {
  return {
    'game-board__cell': true,
    'game-board__cell--filled': !!cell.value,
    'game-board__cell--ghost': cell.isGhost,
    [`game-board__cell--${cell.value.toLowerCase()}`]: !!cell.value
  }
}
</script>

<template>
  <view class="game-board">
    <view v-for="row in rows" :key="row[0].id" class="game-board__row">
      <view v-for="cell in row" :key="cell.id" :class="getCellClass(cell)" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.game-board {
  width: 640rpx;
  max-width: calc(100vw - 48rpx);
  padding: 8rpx;
  background-color: var(--tetris-board-bg, #111827);
  border: 2rpx solid var(--tetris-panel-border, rgba(148, 163, 184, 0.28));
  border-radius: 16rpx;
  box-shadow: 0 12rpx 34rpx var(--tetris-shadow, rgba(0, 0, 0, 0.24));
  box-sizing: border-box;
}

.game-board__row {
  display: flex;
}

.game-board__cell {
  width: 60rpx;
  height: 60rpx;
  flex: 0 0 60rpx;
  margin: 1rpx;
  background-color: var(--tetris-cell-bg, #1f2937);
  border-radius: 7rpx;
  box-sizing: border-box;
}

.game-board__cell--filled {
  border: 2rpx solid rgba(255, 255, 255, 0.18);
}

.game-board__cell--ghost {
  opacity: 0.28;
}

.game-board__cell--i {
  background-color: #22d3ee;
}

.game-board__cell--o {
  background-color: #facc15;
}

.game-board__cell--t {
  background-color: #a855f7;
}

.game-board__cell--s {
  background-color: #34d399;
}

.game-board__cell--z {
  background-color: #fb7185;
}

.game-board__cell--j {
  background-color: #60a5fa;
}

.game-board__cell--l {
  background-color: #fb923c;
}

@media screen and (max-height: 780px) {
  .game-board {
    width: 580rpx;
  }

  .game-board__cell {
    width: 54rpx;
    height: 54rpx;
    flex-basis: 54rpx;
  }
}

@media screen and (max-height: 700px) {
  .game-board {
    width: 476rpx;
    padding: 6rpx;
    border-radius: 14rpx;
  }

  .game-board__cell {
    width: 44rpx;
    height: 44rpx;
    flex-basis: 44rpx;
    border-radius: 6rpx;
  }
}
</style>
