<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import RecordList from './components/recordList.vue'
import RecordSummary from './components/recordSummary.vue'
import { useGameRecords } from '@/hooks/useGameRecords'
import { useTheme } from '@/hooks/useTheme'

defineOptions({
  options: {
    styleIsolation: 'shared'
  }
})

const { records, summary, loadGameRecords, clearGameRecords } = useGameRecords()
const { themeClass, loadTheme } = useTheme()

function handleClearRecords() {
  if (records.value.length === 0) return

  uni.showModal({
    title: '清空记录',
    content: '确认删除全部游戏记录吗？',
    confirmText: '清空',
    confirmColor: '#ef4444',
    success(result) {
      if (!result.confirm) return
      clearGameRecords()
      uni.showToast({
        title: '已清空',
        icon: 'none'
      })
    }
  })
}

onShow(() => {
  loadTheme()
  loadGameRecords()
})
</script>

<template>
  <view class="records-page" :class="themeClass">
    <view class="records-page__content">
      <view class="records-page__header">
        <view>
          <text class="records-page__title">游戏记录</text>
          <text class="records-page__subtitle">评分由基础得分、时长奖励和等级奖励组成</text>
        </view>
        <nut-button
          v-if="records.length > 0"
          class="records-page__clear"
          size="small"
          plain
          type="default"
          @click="handleClearRecords"
        >
          清空
        </nut-button>
      </view>

      <RecordSummary :summary="summary" />

      <view class="records-page__section-title">
        <text>最近 50 局</text>
      </view>

      <RecordList :records="records" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.records-page {
  min-height: 100vh;
  padding: 24rpx 20rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background: var(--tetris-page-bg);
  box-sizing: border-box;
}

.records-page__content {
  width: 100%;
  max-width: 720rpx;
  margin: 0 auto;
}

.records-page__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.records-page__title,
.records-page__subtitle {
  display: block;
}

.records-page__title {
  color: var(--tetris-text-primary, #f8fafc);
  font-size: 38rpx;
  font-weight: 800;
  line-height: 46rpx;
}

.records-page__subtitle {
  margin-top: 8rpx;
  color: var(--tetris-text-secondary, #94a3b8);
  font-size: 22rpx;
  line-height: 30rpx;
}

.records-page__section-title {
  margin: 24rpx 0 12rpx;
  color: var(--tetris-text-primary, #e2e8f0);
  font-size: 26rpx;
  font-weight: 700;
  line-height: 34rpx;
}

:deep(.records-page__clear) {
  flex: 0 0 auto;
  min-width: 96rpx;
  color: #fecaca !important;
  background: rgba(127, 29, 29, 0.18) !important;
  border: 1rpx solid rgba(248, 113, 113, 0.32);
  border-radius: 10rpx;
}
</style>
