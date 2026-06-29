<script setup lang="ts">
import type { GameRecordSummary } from '@/hooks/useGameRecords'

interface Props {
  summary: GameRecordSummary
}

defineProps<Props>()

defineOptions({
  options: {
    styleIsolation: 'shared'
  }
})
</script>

<template>
  <view class="record-summary">
    <view class="record-summary__item">
      <text class="record-summary__label">总局数</text>
      <text class="record-summary__value">{{ summary.totalGames }}</text>
    </view>
    <view class="record-summary__item">
      <text class="record-summary__label">最高分</text>
      <text class="record-summary__value">{{ summary.bestScore }}</text>
    </view>
    <view class="record-summary__item">
      <text class="record-summary__label">最佳评级</text>
      <text class="record-summary__value">{{ summary.bestRating }}</text>
    </view>
    <view class="record-summary__item">
      <text class="record-summary__label">累计消行</text>
      <text class="record-summary__value">{{ summary.totalLines }}</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.record-summary {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14rpx;
}

.record-summary__item {
  padding: 18rpx;
  background: var(--tetris-panel-bg, rgba(15, 23, 42, 0.76));
  border: 2rpx solid var(--tetris-panel-border, rgba(148, 163, 184, 0.16));
  border-radius: 14rpx;
  box-sizing: border-box;
}

.record-summary__label {
  display: block;
  color: var(--tetris-text-secondary, #94a3b8);
  font-size: 22rpx;
  line-height: 28rpx;
}

.record-summary__value {
  display: block;
  margin-top: 8rpx;
  color: var(--tetris-text-primary, #f8fafc);
  font-size: 38rpx;
  font-weight: 800;
  line-height: 44rpx;
}
</style>
