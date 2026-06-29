<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  actionLabel: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

defineOptions({
  options: {
    styleIsolation: 'shared'
  }
})

const emit = defineEmits<{
  moveLeft: []
  moveRight: []
  softDrop: []
  rotate: []
  hardDrop: []
  toggle: []
  reset: []
}>()

const actionIcon = computed(() => {
  if (props.actionLabel === '暂停') return 'Ⅱ'
  return '▶'
})
</script>

<template>
  <view class="touch-controls">
    <view class="touch-controls__pad">
      <view class="touch-controls__group touch-controls__group--move">
        <nut-button
          class="touch-controls__button touch-controls__button--move"
          type="info"
          :disabled="disabled"
          @click="emit('moveLeft')"
        >
          <text class="touch-controls__icon">←</text>
          <text class="touch-controls__label">左移</text>
        </nut-button>
        <nut-button
          class="touch-controls__button touch-controls__button--rotate"
          type="primary"
          :disabled="disabled"
          @click="emit('rotate')"
        >
          <text class="touch-controls__icon">↻</text>
          <text class="touch-controls__label">旋转</text>
        </nut-button>
        <nut-button
          class="touch-controls__button touch-controls__button--move"
          type="info"
          :disabled="disabled"
          @click="emit('moveRight')"
        >
          <text class="touch-controls__icon">→</text>
          <text class="touch-controls__label">右移</text>
        </nut-button>
      </view>

      <view class="touch-controls__group touch-controls__group--action">
        <nut-button
          class="touch-controls__button touch-controls__button--drop"
          type="warning"
          :disabled="disabled"
          @click="emit('softDrop')"
        >
          <text class="touch-controls__icon">↓</text>
          <text class="touch-controls__label">下落</text>
        </nut-button>
        <nut-button
          class="touch-controls__button touch-controls__button--toggle"
          type="success"
          @click="emit('toggle')"
        >
          <text class="touch-controls__icon">{{ actionIcon }}</text>
          <text class="touch-controls__label">{{ actionLabel }}</text>
        </nut-button>
        <nut-button
          class="touch-controls__button touch-controls__button--hard"
          type="danger"
          :disabled="disabled"
          @click="emit('hardDrop')"
        >
          <text class="touch-controls__icon">⇣</text>
          <text class="touch-controls__label">直落</text>
        </nut-button>
        <nut-button
          class="touch-controls__button touch-controls__button--reset"
          plain
          type="default"
          @click="emit('reset')"
        >
          <text class="touch-controls__reset-icon">↺</text>
          <text class="touch-controls__label">重开</text>
        </nut-button>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.touch-controls {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8rpx;
}

.touch-controls__pad {
  flex-direction: column;
  display: flex;
  width: 100%;
  gap: 12rpx;
  padding: 14rpx;
  background: var(--tetris-control-bg, linear-gradient(180deg, rgba(30, 41, 59, 0.92), rgba(15, 23, 42, 0.82)));
  border: 2rpx solid var(--tetris-panel-border, rgba(148, 163, 184, 0.18));
  border-radius: 20rpx;
  box-shadow: 0 18rpx 36rpx var(--tetris-shadow, rgba(2, 6, 23, 0.24));
  box-sizing: border-box;
}

.touch-controls__group {
  display: flex;
  width: 100%;
  gap: 12rpx;
}

.touch-controls__button {
  flex: 1;
  min-width: 0;
}

.touch-controls__button--toggle {
  flex: 1;
}

.touch-controls__button--reset {
  flex: 1;
}

.touch-controls__icon,
.touch-controls__label,
.touch-controls__reset-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.touch-controls__icon {
  margin-right: 6rpx;
  font-size: 28rpx;
  font-weight: 800;
  line-height: 1;
}

.touch-controls__label {
  font-size: 23rpx;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
}

.touch-controls__reset-icon {
  margin-right: 6rpx;
  font-size: 22rpx;
  line-height: 1;
}

:deep(.nut-button) {
  width: 100%;
  height: 68rpx;
  border-width: 0;
  border-radius: 14rpx;
  color: #f8fafc;
  font-size: 23rpx;
  font-weight: 700;
  box-shadow: inset 0 2rpx 0 rgba(255, 255, 255, 0.18), 0 8rpx 18rpx rgba(2, 6, 23, 0.24);
}

:deep(.nut-button__wrap) {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  width: 100%;
  padding: 0 6rpx;
  color: inherit;
  box-sizing: border-box;
}

:deep(.nut-button__wrap uni-text),
:deep(.nut-button__wrap text) {
  color: inherit;
}

:deep(.touch-controls__button--move) {
  background: linear-gradient(180deg, #38bdf8 0%, #2563eb 100%) !important;
}

:deep(.touch-controls__button--rotate) {
  background: linear-gradient(180deg, #c084fc 0%, #7c3aed 100%) !important;
}

:deep(.touch-controls__button--drop) {
  background: linear-gradient(180deg, #fbbf24 0%, #f97316 100%) !important;
}

:deep(.touch-controls__button--toggle) {
  background: linear-gradient(180deg, #34d399 0%, #059669 100%) !important;
}

:deep(.touch-controls__button--hard) {
  background: linear-gradient(180deg, #fb7185 0%, #e11d48 100%) !important;
}

:deep(.touch-controls__button--reset) {
  color: var(--tetris-text-muted, #cbd5e1) !important;
  background: var(--tetris-muted-button-bg, rgba(15, 23, 42, 0.42)) !important;
  border: 2rpx solid var(--tetris-panel-border, rgba(148, 163, 184, 0.2));
  box-shadow: inset 0 2rpx 0 rgba(255, 255, 255, 0.08);
}

:deep(.nut-button--disabled) {
  color: var(--tetris-text-secondary, rgba(226, 232, 240, 0.62)) !important;
  opacity: 1;
  background: var(--tetris-disabled-bg, linear-gradient(180deg, rgba(71, 85, 105, 0.78), rgba(51, 65, 85, 0.74))) !important;
  box-shadow: inset 0 2rpx 0 rgba(255, 255, 255, 0.08);
}

@media screen and (max-height: 700px) {
  .touch-controls {
    gap: 4rpx;
  }

  .touch-controls__pad {
    gap: 10rpx;
    padding: 12rpx;
    border-radius: 18rpx;
  }

  .touch-controls__group {
    gap: 8rpx;
  }

  .touch-controls__icon {
    margin-right: 4rpx;
    font-size: 25rpx;
  }

  .touch-controls__label {
    font-size: 21rpx;
  }

  :deep(.nut-button) {
    height: 60rpx;
    border-radius: 12rpx;
  }

  :deep(.nut-button__wrap) {
    padding: 0 4rpx;
  }
}
</style>
