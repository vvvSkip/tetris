<script setup lang="ts">
import { computed, shallowRef } from 'vue'

interface MenuItem {
  label: string
  desc: string
  event: 'showRules' | 'showRecords' | 'showExchangeRecords' | 'toggleTheme' | 'toggleSound'
}

interface Props {
  themeLabel: string
  nextThemeLabel: string
  soundLabel: string
  nextSoundLabel: string
}

defineOptions({
  options: {
    styleIsolation: 'shared'
  }
})

const props = defineProps<Props>()

const emit = defineEmits<{
  showRules: []
  showRecords: []
  showExchangeRecords: []
  toggleTheme: []
  toggleSound: []
}>()

const visible = shallowRef(false)

const menuItems = computed<MenuItem[]>(() => [
  {
    label: '规则说明',
    desc: '玩法、计分与积分',
    event: 'showRules'
  },
  {
    label: '游戏记录',
    desc: '查看每局结算',
    event: 'showRecords'
  },
  {
    label: '兑换记录',
    desc: '积分兑换明细',
    event: 'showExchangeRecords'
  },
  {
    label: '切换主题',
    desc: `当前${props.themeLabel}，切到${props.nextThemeLabel}`,
    event: 'toggleTheme'
  },
  {
    label: '音效开关',
    desc: `当前${props.soundLabel}，点击${props.nextSoundLabel}`,
    event: 'toggleSound'
  }
])

function toggleMenu() {
  visible.value = !visible.value
}

function closeMenu() {
  visible.value = false
}

function handleChoose(item: MenuItem) {
  visible.value = false
  emit(item.event)
}
</script>

<template>
  <view class="more-menu">
    <nut-button
      class="more-menu__trigger"
      :class="{ 'more-menu__trigger--active': visible }"
      size="small"
      plain
      type="default"
      aria-label="更多"
      @click="toggleMenu"
    >
      <view class="more-menu__icon">
        <view class="more-menu__icon-shine" />
        <view class="more-menu__dots">
          <text class="more-menu__dot" />
          <text class="more-menu__dot" />
          <text class="more-menu__dot" />
        </view>
      </view>
    </nut-button>

    <view v-if="visible" class="more-menu__mask" @click="closeMenu" />

    <view v-if="visible" class="more-menu__panel">
      <nut-button
        v-for="item in menuItems"
        :key="item.event"
        class="more-menu__item"
        type="default"
        @click="handleChoose(item)"
      >
        <view class="more-menu__item-content">
          <text class="more-menu__item-label">{{ item.label }}</text>
          <text class="more-menu__item-desc">{{ item.desc }}</text>
        </view>
      </nut-button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.more-menu {
  position: relative;
  flex: 0 0 58rpx;
  z-index: 8;
}

:deep(.more-menu__trigger) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 58rpx;
  height: 100%;
  min-height: 52rpx;
  padding: 0;
  background:
    var(--tetris-menu-trigger-bg, linear-gradient(180deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.76) 100%)) !important;
  border: 2rpx solid var(--tetris-panel-border, rgba(148, 163, 184, 0.2));
  border-radius: 14rpx !important;
  box-shadow:
    inset 0 1rpx 0 rgba(255, 255, 255, 0.08),
    0 6rpx 16rpx rgba(2, 6, 23, 0.2);
}

:deep(.more-menu__trigger--active) {
  background:
    var(--tetris-menu-trigger-active-bg, linear-gradient(180deg, rgba(37, 99, 235, 0.32) 0%, rgba(15, 23, 42, 0.86) 100%)) !important;
  border-color: rgba(96, 165, 250, 0.38);
}

.more-menu__icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40rpx;
  height: 40rpx;
  overflow: hidden;
  background:
    radial-gradient(circle at 32% 20%, rgba(255, 255, 255, 0.18), transparent 34%),
    linear-gradient(145deg, rgba(59, 130, 246, 0.34) 0%, rgba(34, 211, 238, 0.14) 100%);
  border: 1rpx solid rgba(191, 219, 254, 0.2);
  border-radius: 13rpx;
  box-sizing: border-box;
}

.more-menu__icon-shine {
  position: absolute;
  top: 7rpx;
  left: 8rpx;
  width: 15rpx;
  height: 3rpx;
  background-color: rgba(248, 250, 252, 0.42);
  border-radius: 999rpx;
  transform: rotate(-28deg);
}

.more-menu__dots {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
}

.more-menu__dot {
  width: 6rpx;
  height: 6rpx;
  background: linear-gradient(180deg, #f8fafc 0%, #93c5fd 100%);
  border-radius: 999rpx;
  box-shadow: 0 2rpx 5rpx rgba(15, 23, 42, 0.34);
}

.more-menu__mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 18;
  background: transparent;
}

.more-menu__panel {
  position: absolute;
  top: calc(100% + 8rpx);
  right: 0;
  z-index: 19;
  width: 236rpx;
  padding: 8rpx;
  background: var(--tetris-menu-bg, rgba(15, 23, 42, 0.96));
  border: 2rpx solid var(--tetris-panel-border, rgba(148, 163, 184, 0.18));
  border-radius: 16rpx;
  box-shadow: 0 18rpx 42rpx rgba(2, 6, 23, 0.36);
  box-sizing: border-box;
}

:deep(.more-menu__item) {
  display: block;
  width: 100%;
  height: auto;
  padding: 12rpx 14rpx;
  color: var(--tetris-text-primary, #e2e8f0) !important;
  text-align: left;
  background: transparent !important;
  border: 0;
  border-radius: 10rpx;
}

:deep(.more-menu__item + .more-menu__item) {
  margin-top: 2rpx;
}

:deep(.more-menu__item:active) {
  background: rgba(59, 130, 246, 0.16) !important;
}

.more-menu__item-content,
.more-menu__item-label,
.more-menu__item-desc {
  display: block;
}

.more-menu__item-label {
  color: var(--tetris-text-primary, #f8fafc);
  font-size: 24rpx;
  font-weight: 800;
  line-height: 32rpx;
}

.more-menu__item-desc {
  margin-top: 2rpx;
  color: var(--tetris-text-secondary, #94a3b8);
  font-size: 19rpx;
  line-height: 26rpx;
}

@media screen and (max-height: 700px) {
  .more-menu {
    flex-basis: 54rpx;
  }

  :deep(.more-menu__trigger) {
    width: 54rpx;
    min-height: 52rpx;
    border-radius: 13rpx !important;
  }

  .more-menu__icon {
    width: 38rpx;
    height: 38rpx;
    border-radius: 12rpx;
  }

  .more-menu__dot {
    width: 6rpx;
    height: 6rpx;
  }
}
</style>
