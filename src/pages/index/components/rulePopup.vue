<script setup lang="ts">
import { shallowRef } from 'vue'
import { useTheme } from '@/hooks/useTheme'

interface RuleSection {
  title: string
  items: string[]
}

defineOptions({
  options: {
    styleIsolation: 'shared'
  }
})

const visible = shallowRef(false)
const { themeClass } = useTheme()

const ruleSections: RuleSection[] = [
  {
    title: '基础玩法',
    items: [
      '棋盘为 10 x 20 格，方块堆到顶部且新方块无法生成时游戏结束。',
      '支持左移、右移、旋转、下落、直落、暂停、继续和重开。',
      '等级每累计消除 10 行提升 1 级，等级越高自动下落速度越快。'
    ]
  },
  {
    title: '计分规则',
    items: [
      '手动下落一格 +1 分，直落按下落距离 x 2 加分。',
      '消除 1/2/3/4 行分别获得 100/300/500/800 x 当前等级分。',
      '结束结算分 = 游戏内基础得分 + 时长奖励 + 等级奖励。'
    ]
  },
  {
    title: '评级与积分',
    items: [
      '评级按最终得分或消除行数判定：S/A/B/C/D。',
      '每局获得积分 = 最终得分 / 100 向下取整 + 评级奖励。',
      '评级奖励：S +30，A +20，B +10，C +5，D +0。'
    ]
  },
  {
    title: '次数规则',
    items: [
      '每天免费 5 次，按自然日自动刷新。',
      '从准备或结束状态开始新局会消耗 1 次，暂停和继续不消耗次数。',
      '100 积分可兑换 1 次额外游戏次数。'
    ]
  },
  {
    title: '记录与健康提醒',
    items: [
      '每局结束后自动保存到游戏记录，最多保留最近 50 局。',
      '今日实际游玩累计 30 分钟会弹出健康提醒，之后每增加 15 分钟再次提醒。',
      '健康提醒只做提示，不会强制退出，也不会影响积分和记录。'
    ]
  }
]

function changeShow() {
  visible.value = !visible.value
}

function handleClose() {
  visible.value = false
}

defineExpose({
  changeShow
})
</script>

<template>
  <nut-popup
    v-model:visible="visible"
    position="bottom"
    :pop-class="`rule-popup-shell ${themeClass}`"
    custom-style="border-radius: 30rpx 30rpx 0 0; overflow: hidden; background: transparent;"
  >
    <view class="rule-popup" :class="themeClass">
      <view class="rule-popup__header">
        <view class="rule-popup__title-wrap">
          <text class="rule-popup__title">规则说明</text>
          <text class="rule-popup__subtitle">玩法、计分、积分和健康提醒</text>
        </view>
        <nut-button class="rule-popup__close" size="mini" plain type="default" @click="handleClose">
          关闭
        </nut-button>
      </view>

      <scroll-view class="rule-popup__body" scroll-y>
        <view
          v-for="section in ruleSections"
          :key="section.title"
          class="rule-popup__section"
        >
          <text class="rule-popup__section-title">{{ section.title }}</text>
          <view class="rule-popup__list">
            <view
              v-for="item in section.items"
              :key="item"
              class="rule-popup__item"
            >
              <text class="rule-popup__dot" />
              <text class="rule-popup__item-text">{{ item }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </nut-popup>
</template>

<style lang="scss" scoped>
.rule-popup {
  display: flex;
  flex-direction: column;
  max-height: 82vh;
  padding: 28rpx 24rpx calc(24rpx + env(safe-area-inset-bottom));
  color: var(--tetris-text-primary, #f8fafc);
  background:
    var(
      --tetris-card-bg,
      linear-gradient(180deg, rgba(30, 41, 59, 0.98), rgba(15, 23, 42, 0.98))
    );
  border-radius: 30rpx 30rpx 0 0;
  box-sizing: border-box;
}

.rule-popup__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid var(--tetris-panel-border, rgba(148, 163, 184, 0.18));
}

.rule-popup__title-wrap {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.rule-popup__title {
  color: var(--tetris-text-primary, #f8fafc);
  font-size: 34rpx;
  font-weight: 800;
  line-height: 42rpx;
}

.rule-popup__subtitle {
  margin-top: 4rpx;
  color: var(--tetris-text-secondary, #94a3b8);
  font-size: 22rpx;
  line-height: 30rpx;
}

.rule-popup__body {
  max-height: 62vh;
  margin-top: 6rpx;
}

.rule-popup__section {
  padding: 20rpx 0;
  border-bottom: 1rpx solid var(--tetris-panel-border, rgba(148, 163, 184, 0.12));
}

.rule-popup__section:last-child {
  border-bottom: 0;
}

.rule-popup__section-title {
  color: var(--tetris-accent-text, #bfdbfe);
  font-size: 26rpx;
  font-weight: 800;
  line-height: 34rpx;
}

.rule-popup__list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  margin-top: 14rpx;
}

.rule-popup__item {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
}

.rule-popup__dot {
  width: 10rpx;
  height: 10rpx;
  margin-top: 13rpx;
  flex: 0 0 10rpx;
  background: var(--tetris-accent-dot-bg, linear-gradient(180deg, #67e8f9 0%, #60a5fa 100%));
  border-radius: 999rpx;
}

.rule-popup__item-text {
  flex: 1;
  min-width: 0;
  color: var(--tetris-text-muted, #dbeafe);
  font-size: 24rpx;
  line-height: 36rpx;
}

:deep(.rule-popup__close) {
  flex: 0 0 88rpx;
  height: 42rpx;
  padding: 0;
  color: var(--tetris-text-secondary, #cbd5e1) !important;
  font-size: 22rpx;
  font-weight: 700;
  line-height: 42rpx;
  background: var(--tetris-muted-button-bg, rgba(15, 23, 42, 0.48)) !important;
  border: 1rpx solid var(--tetris-panel-border, rgba(148, 163, 184, 0.3));
  border-radius: 10rpx;
}

:deep(.rule-popup-shell),
:deep(.rule-popup-shell .nut-popup),
:deep(.nut-popup.rule-popup-shell) {
  overflow: hidden !important;
  background-color: transparent !important;
  border-radius: 30rpx 30rpx 0 0 !important;
}
</style>
