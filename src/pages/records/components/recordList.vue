<script setup lang="ts">
import type { GameRecord } from '@/hooks/useGameRecords'
import { formatDuration, formatRecordTime } from '@/hooks/useGameRecords'

interface Props {
  records: readonly GameRecord[]
}

defineProps<Props>()

defineOptions({
  options: {
    styleIsolation: 'shared'
  }
})
</script>

<template>
  <view class="record-list">
    <nut-empty v-if="records.length === 0" description="暂无游戏记录" />

    <view v-else class="record-list__items">
      <view v-for="record in records" :key="record.id" class="record-list__item">
        <view class="record-list__header">
          <view class="record-list__score">
            <text class="record-list__score-label">最终得分</text>
            <text class="record-list__score-value">{{ record.finalScore }}</text>
          </view>
          <view class="record-list__rating" :class="`record-list__rating--${record.rating.toLowerCase()}`">
            <text class="record-list__rating-level">{{ record.rating }}</text>
            <text class="record-list__rating-text">{{ record.ratingText }}</text>
          </view>
        </view>

        <view class="record-list__detail">
          <view class="record-list__detail-item">
            <text class="record-list__detail-label">基础分</text>
            <text class="record-list__detail-value">{{ record.gameplayScore }}</text>
          </view>
          <view class="record-list__detail-item">
            <text class="record-list__detail-label">时长奖励</text>
            <text class="record-list__detail-value">+{{ record.durationBonus }}</text>
          </view>
          <view class="record-list__detail-item">
            <text class="record-list__detail-label">等级奖励</text>
            <text class="record-list__detail-value">+{{ record.levelBonus }}</text>
          </view>
          <view class="record-list__detail-item record-list__detail-item--credit">
            <text class="record-list__detail-label">获得积分</text>
            <text class="record-list__detail-value">+{{ record.creditsEarned }}</text>
          </view>
        </view>

        <view class="record-list__meta">
          <text>消行 {{ record.lines }}</text>
          <text>等级 {{ record.level }}</text>
          <text>用时 {{ formatDuration(record.durationSeconds) }}</text>
          <text>{{ formatRecordTime(record.playedAt) }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.record-list {
  width: 100%;
}

.record-list__items {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.record-list__item {
  padding: 18rpx;
  background: var(--tetris-card-bg, linear-gradient(180deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.84)));
  border: 2rpx solid var(--tetris-panel-border, rgba(148, 163, 184, 0.16));
  border-radius: 16rpx;
  box-sizing: border-box;
}

.record-list__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.record-list__score {
  min-width: 0;
}

.record-list__score-label {
  display: block;
  color: var(--tetris-text-secondary, #94a3b8);
  font-size: 22rpx;
  line-height: 28rpx;
}

.record-list__score-value {
  display: block;
  margin-top: 4rpx;
  color: var(--tetris-text-primary, #f8fafc);
  font-size: 42rpx;
  font-weight: 800;
  line-height: 48rpx;
}

.record-list__rating {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  gap: 8rpx;
  padding: 8rpx 12rpx;
  border-radius: 999rpx;
}

.record-list__rating--s {
  color: #fde68a;
  background: rgba(245, 158, 11, 0.16);
}

.record-list__rating--a {
  color: #86efac;
  background: rgba(34, 197, 94, 0.16);
}

.record-list__rating--b {
  color: #93c5fd;
  background: rgba(59, 130, 246, 0.16);
}

.record-list__rating--c {
  color: #c4b5fd;
  background: rgba(124, 58, 237, 0.16);
}

.record-list__rating--d {
  color: #cbd5e1;
  background: rgba(148, 163, 184, 0.14);
}

.record-list__rating-level {
  font-size: 28rpx;
  font-weight: 800;
  line-height: 32rpx;
}

.record-list__rating-text {
  font-size: 20rpx;
  font-weight: 700;
  line-height: 26rpx;
}

.record-list__detail {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10rpx;
  margin-top: 18rpx;
}

.record-list__detail-item {
  padding: 12rpx 8rpx;
  background-color: var(--tetris-panel-bg-soft, rgba(15, 23, 42, 0.58));
  border-radius: 12rpx;
}

.record-list__detail-label,
.record-list__detail-value {
  display: block;
  text-align: center;
}

.record-list__detail-label {
  color: var(--tetris-text-secondary, #94a3b8);
  font-size: 20rpx;
  line-height: 26rpx;
}

.record-list__detail-value {
  margin-top: 4rpx;
  color: var(--tetris-text-primary, #e2e8f0);
  font-size: 24rpx;
  font-weight: 700;
  line-height: 30rpx;
}

.record-list__detail-item--credit .record-list__detail-value {
  color: #facc15;
}

.record-list__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx 16rpx;
  margin-top: 16rpx;
  color: var(--tetris-text-secondary, #94a3b8);
  font-size: 20rpx;
  line-height: 26rpx;
}

:deep(.nut-empty) {
  padding: 64rpx 0;
}

:deep(.nut-empty__description) {
  color: var(--tetris-text-secondary, #94a3b8);
}
</style>
