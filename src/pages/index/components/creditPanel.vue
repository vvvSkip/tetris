<script setup lang="ts">
interface Props {
  points: number
  remainingFreePlays: number
  extraPlays: number
  availablePlays: number
  canExchange: boolean
  exchangeCost: number
}

defineProps<Props>()

defineOptions({
  options: {
    styleIsolation: 'shared'
  }
})

const emit = defineEmits<{
  exchange: []
}>()
</script>

<template>
  <view class="credit-panel">
    <view class="credit-panel__item">
      <text class="credit-panel__label">可玩次数</text>
      <text class="credit-panel__value">
        {{ availablePlays }}
        <text v-if="extraPlays > 0" class="credit-panel__extra">兑{{ extraPlays }}</text>
      </text>
    </view>
    <view class="credit-panel__item">
      <text class="credit-panel__label">今日免费</text>
      <text class="credit-panel__value">{{ remainingFreePlays }}</text>
    </view>
    <view class="credit-panel__item">
      <text class="credit-panel__label">积分</text>
      <text class="credit-panel__value">{{ points }}</text>
    </view>
    <view class="credit-panel__actions">
      <nut-button
        class="credit-panel__exchange"
        size="mini"
        type="primary"
        :disabled="!canExchange"
        @click="emit('exchange')"
      >
        {{ exchangeCost }}兑1次
      </nut-button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.credit-panel {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 8rpx;
  padding: 8rpx;
  background-color: var(--tetris-panel-bg, rgba(15, 23, 42, 0.72));
  border: 2rpx solid var(--tetris-panel-border, rgba(148, 163, 184, 0.14));
  border-radius: 14rpx;
  box-sizing: border-box;
}

.credit-panel__item {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  gap: 6rpx;
}

.credit-panel__label {
  color: var(--tetris-text-secondary, #94a3b8);
  font-size: 19rpx;
  line-height: 24rpx;
  white-space: nowrap;
}

.credit-panel__value {
  color: var(--tetris-text-primary, #f8fafc);
  font-size: 24rpx;
  font-weight: 800;
  line-height: 28rpx;
}

.credit-panel__extra {
  margin-left: 3rpx;
  color: #facc15;
  font-size: 16rpx;
  line-height: 20rpx;
}

.credit-panel__actions {
  display: flex;
  flex: 0 0 110rpx;
}

:deep(.credit-panel__exchange) {
  height: 34rpx;
  width: 100%;
  padding: 0 8rpx;
  font-size: 18rpx;
  font-weight: 800;
  line-height: 34rpx;
  border-radius: 9rpx;
}

:deep(.credit-panel__exchange) {
  color: #0f172a !important;
  background: linear-gradient(180deg, #fde68a 0%, #facc15 100%) !important;
  border: 0;
}

:deep(.nut-button--disabled) {
  color: var(--tetris-text-secondary, rgba(226, 232, 240, 0.46)) !important;
  opacity: 1;
  background: var(--tetris-disabled-bg, rgba(51, 65, 85, 0.7)) !important;
}

@media screen and (max-height: 700px) {
  .credit-panel {
    gap: 6rpx;
    padding: 6rpx 8rpx;
  }

  .credit-panel__label {
    font-size: 18rpx;
    line-height: 22rpx;
  }

  .credit-panel__value {
    font-size: 22rpx;
    line-height: 26rpx;
  }

  .credit-panel__actions {
    flex-basis: 104rpx;
  }

  :deep(.credit-panel__exchange) {
    height: 30rpx;
    font-size: 17rpx;
    line-height: 30rpx;
  }
}
</style>
