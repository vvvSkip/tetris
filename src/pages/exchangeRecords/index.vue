<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { computed } from 'vue'
import ExchangeRecordList from './components/exchangeRecordList.vue'
import { useGameCredits } from '@/hooks/useGameCredits'
import { useTheme } from '@/hooks/useTheme'

defineOptions({
  options: {
    styleIsolation: 'shared'
  }
})

const { creditState, exchangeRecords, loadGameCredits } = useGameCredits()
const { themeClass, loadTheme } = useTheme()

const totalCost = computed(() => {
  return exchangeRecords.value.reduce((total, record) => total + record.cost, 0)
})

onShow(() => {
  loadTheme()
  loadGameCredits()
})
</script>

<template>
  <view class="exchange-records-page" :class="themeClass">
    <view class="exchange-records-page__content">
      <view class="exchange-records-page__header">
        <text class="exchange-records-page__title">兑换记录</text>
        <text class="exchange-records-page__subtitle">展示每次积分兑换游戏次数的积分变化</text>
      </view>

      <view class="exchange-records-page__summary">
        <view class="exchange-records-page__summary-item">
          <text class="exchange-records-page__summary-label">兑换次数</text>
          <text class="exchange-records-page__summary-value">{{ exchangeRecords.length }}</text>
        </view>
        <view class="exchange-records-page__summary-item">
          <text class="exchange-records-page__summary-label">累计消耗</text>
          <text class="exchange-records-page__summary-value">{{ totalCost }}</text>
        </view>
        <view class="exchange-records-page__summary-item">
          <text class="exchange-records-page__summary-label">当前积分</text>
          <text class="exchange-records-page__summary-value">{{ creditState.points }}</text>
        </view>
      </view>

      <view class="exchange-records-page__section-title">
        <text>全部兑换记录</text>
      </view>

      <ExchangeRecordList :records="exchangeRecords" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.exchange-records-page {
  min-height: 100vh;
  padding: 24rpx 20rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background: var(--tetris-page-bg-warm);
  box-sizing: border-box;
}

.exchange-records-page__content {
  width: 100%;
  max-width: 720rpx;
  margin: 0 auto;
}

.exchange-records-page__header {
  margin-bottom: 20rpx;
}

.exchange-records-page__title,
.exchange-records-page__subtitle {
  display: block;
}

.exchange-records-page__title {
  color: var(--tetris-text-primary, #f8fafc);
  font-size: 38rpx;
  font-weight: 800;
  line-height: 46rpx;
}

.exchange-records-page__subtitle {
  margin-top: 8rpx;
  color: var(--tetris-text-secondary, #94a3b8);
  font-size: 22rpx;
  line-height: 30rpx;
}

.exchange-records-page__summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12rpx;
}

.exchange-records-page__summary-item {
  min-width: 0;
  padding: 16rpx 10rpx;
  background-color: var(--tetris-panel-bg, rgba(15, 23, 42, 0.72));
  border: 2rpx solid var(--tetris-panel-border, rgba(148, 163, 184, 0.14));
  border-radius: 14rpx;
  box-sizing: border-box;
}

.exchange-records-page__summary-label,
.exchange-records-page__summary-value {
  display: block;
  text-align: center;
}

.exchange-records-page__summary-label {
  color: var(--tetris-text-secondary, #94a3b8);
  font-size: 20rpx;
  line-height: 26rpx;
}

.exchange-records-page__summary-value {
  margin-top: 6rpx;
  color: var(--tetris-text-primary, #f8fafc);
  font-size: 32rpx;
  font-weight: 800;
  line-height: 38rpx;
}

.exchange-records-page__section-title {
  margin: 24rpx 0 12rpx;
  color: var(--tetris-text-primary, #e2e8f0);
  font-size: 26rpx;
  font-weight: 700;
  line-height: 34rpx;
}
</style>
