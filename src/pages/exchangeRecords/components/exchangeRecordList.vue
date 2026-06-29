<script setup lang="ts">
import type { ExchangeRecord } from '@/hooks/useGameCredits'
import { formatRecordTime } from '@/hooks/useGameRecords'

interface Props {
  records: readonly ExchangeRecord[]
}

defineProps<Props>()

defineOptions({
  options: {
    styleIsolation: 'shared'
  }
})
</script>

<template>
  <view class="exchange-record-list">
    <nut-empty v-if="records.length === 0" description="暂无兑换记录" />

    <view v-else class="exchange-record-list__items">
      <view v-for="record in records" :key="record.id" class="exchange-record-list__item">
        <view class="exchange-record-list__header">
          <view>
            <text class="exchange-record-list__title">兑换{{ record.plays }}次游戏次数</text>
            <text class="exchange-record-list__time">{{ formatRecordTime(record.exchangedAt) }}</text>
          </view>
          <view class="exchange-record-list__badge">
            <text>-{{ record.cost }}积分</text>
          </view>
        </view>

        <view class="exchange-record-list__detail">
          <view class="exchange-record-list__detail-item">
            <text class="exchange-record-list__label">兑换前</text>
            <text class="exchange-record-list__value">{{ record.pointsBefore }}</text>
          </view>
          <view class="exchange-record-list__detail-item">
            <text class="exchange-record-list__label">兑换后</text>
            <text class="exchange-record-list__value">{{ record.pointsAfter }}</text>
          </view>
          <view class="exchange-record-list__detail-item exchange-record-list__detail-item--play">
            <text class="exchange-record-list__label">兑换次数</text>
            <text class="exchange-record-list__value">+{{ record.plays }}</text>
          </view>
          <view class="exchange-record-list__detail-item">
            <text class="exchange-record-list__label">剩余兑换</text>
            <text class="exchange-record-list__value">{{ record.extraPlaysAfter }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.exchange-record-list {
  width: 100%;
}

.exchange-record-list__items {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.exchange-record-list__item {
  padding: 18rpx;
  background: var(--tetris-card-bg-warm, linear-gradient(180deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.84)));
  border: 2rpx solid var(--tetris-panel-border, rgba(148, 163, 184, 0.16));
  border-radius: 16rpx;
  box-sizing: border-box;
}

.exchange-record-list__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16rpx;
}

.exchange-record-list__title,
.exchange-record-list__time {
  display: block;
}

.exchange-record-list__title {
  color: var(--tetris-text-primary, #f8fafc);
  font-size: 30rpx;
  font-weight: 800;
  line-height: 38rpx;
}

.exchange-record-list__time {
  margin-top: 4rpx;
  color: var(--tetris-text-secondary, #94a3b8);
  font-size: 21rpx;
  line-height: 28rpx;
}

.exchange-record-list__badge {
  flex: 0 0 auto;
  padding: 8rpx 12rpx;
  color: #facc15;
  font-size: 22rpx;
  font-weight: 800;
  line-height: 28rpx;
  background-color: rgba(245, 158, 11, 0.14);
  border-radius: 999rpx;
}

.exchange-record-list__detail {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10rpx;
  margin-top: 18rpx;
}

.exchange-record-list__detail-item {
  min-width: 0;
  padding: 12rpx 8rpx;
  background-color: var(--tetris-panel-bg-soft, rgba(15, 23, 42, 0.58));
  border-radius: 12rpx;
  box-sizing: border-box;
}

.exchange-record-list__label,
.exchange-record-list__value {
  display: block;
  text-align: center;
}

.exchange-record-list__label {
  color: var(--tetris-text-secondary, #94a3b8);
  font-size: 20rpx;
  line-height: 26rpx;
}

.exchange-record-list__value {
  margin-top: 4rpx;
  color: var(--tetris-text-primary, #e2e8f0);
  font-size: 24rpx;
  font-weight: 700;
  line-height: 30rpx;
}

.exchange-record-list__detail-item--play .exchange-record-list__value {
  color: #86efac;
}

:deep(.nut-empty) {
  padding: 80rpx 0;
}

:deep(.nut-empty__description) {
  color: var(--tetris-text-secondary, #94a3b8);
}
</style>
