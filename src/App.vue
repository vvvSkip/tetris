<script setup lang="ts"></script>

<template>
  <view class="app">
    <slot />
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
  background-color: var(--tetris-page-base-bg, #111827);
  overflow: hidden;
}

.theme-dark {
  --tetris-page-base-bg: #111827;
  --tetris-page-bg:
    radial-gradient(circle at 20% 8%, rgba(34, 211, 238, 0.18), transparent 28%),
    linear-gradient(180deg, #111827 0%, #172033 58%, #0f172a 100%);
  --tetris-page-bg-warm:
    radial-gradient(circle at 20% 8%, rgba(250, 204, 21, 0.14), transparent 28%),
    linear-gradient(180deg, #111827 0%, #172033 58%, #0f172a 100%);
  --tetris-panel-bg: rgba(15, 23, 42, 0.76);
  --tetris-panel-bg-soft: rgba(15, 23, 42, 0.58);
  --tetris-panel-bg-strong: rgba(15, 23, 42, 0.92);
  --tetris-card-bg:
    linear-gradient(180deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.84)),
    radial-gradient(circle at 12% 14%, rgba(34, 211, 238, 0.12), transparent 34%);
  --tetris-card-bg-warm:
    linear-gradient(180deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.84)),
    radial-gradient(circle at 12% 14%, rgba(250, 204, 21, 0.12), transparent 34%);
  --tetris-panel-border: rgba(148, 163, 184, 0.16);
  --tetris-text-primary: #f8fafc;
  --tetris-text-secondary: #94a3b8;
  --tetris-text-muted: #cbd5e1;
  --tetris-board-bg: #111827;
  --tetris-cell-bg: #1f2937;
  --tetris-control-bg:
    linear-gradient(180deg, rgba(30, 41, 59, 0.92), rgba(15, 23, 42, 0.82)),
    radial-gradient(circle at 20% 20%, rgba(34, 211, 238, 0.16), transparent 42%);
  --tetris-menu-bg: rgba(15, 23, 42, 0.96);
  --tetris-menu-trigger-bg:
    linear-gradient(180deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.76) 100%);
  --tetris-menu-trigger-active-bg:
    linear-gradient(180deg, rgba(37, 99, 235, 0.32) 0%, rgba(15, 23, 42, 0.86) 100%);
  --tetris-muted-button-bg: rgba(15, 23, 42, 0.42);
  --tetris-disabled-bg: linear-gradient(180deg, rgba(71, 85, 105, 0.78), rgba(51, 65, 85, 0.74));
  --tetris-accent-text: #bfdbfe;
  --tetris-accent-dot-bg: linear-gradient(180deg, #67e8f9 0%, #60a5fa 100%);
  --tetris-shadow: rgba(2, 6, 23, 0.24);
}

.theme-light {
  --tetris-page-base-bg: #eef8ef;
  --tetris-page-bg:
    radial-gradient(circle at 18% 8%, rgba(102, 187, 106, 0.16), transparent 28%),
    linear-gradient(180deg, #f6fff6 0%, #eef8ef 58%, #dcefd8 100%);
  --tetris-page-bg-warm:
    radial-gradient(circle at 18% 8%, rgba(132, 204, 22, 0.14), transparent 28%),
    linear-gradient(180deg, #f7fff4 0%, #edf8e8 58%, #d9edcf 100%);
  --tetris-panel-bg: rgba(250, 255, 249, 0.82);
  --tetris-panel-bg-soft: rgba(219, 237, 213, 0.58);
  --tetris-panel-bg-strong: rgba(253, 255, 252, 0.94);
  --tetris-card-bg:
    linear-gradient(180deg, rgba(253, 255, 252, 0.94), rgba(231, 245, 226, 0.86)),
    radial-gradient(circle at 12% 14%, rgba(102, 187, 106, 0.12), transparent 34%);
  --tetris-card-bg-warm:
    linear-gradient(180deg, rgba(253, 255, 252, 0.96), rgba(238, 248, 232, 0.88)),
    radial-gradient(circle at 12% 14%, rgba(132, 204, 22, 0.12), transparent 34%);
  --tetris-panel-border: rgba(31, 79, 43, 0.12);
  --tetris-text-primary: #17351f;
  --tetris-text-secondary: #3f6849;
  --tetris-text-muted: #2f5d3a;
  --tetris-board-bg: #dcefd8;
  --tetris-cell-bg: #f7fff4;
  --tetris-control-bg:
    linear-gradient(180deg, rgba(253, 255, 252, 0.94), rgba(231, 245, 226, 0.84)),
    radial-gradient(circle at 20% 20%, rgba(102, 187, 106, 0.16), transparent 42%);
  --tetris-menu-bg: rgba(253, 255, 252, 0.98);
  --tetris-menu-trigger-bg:
    linear-gradient(180deg, rgba(253, 255, 252, 0.94) 0%, rgba(231, 245, 226, 0.88) 100%);
  --tetris-menu-trigger-active-bg:
    linear-gradient(180deg, rgba(222, 241, 214, 0.98) 0%, rgba(198, 224, 190, 0.9) 100%);
  --tetris-muted-button-bg: rgba(219, 237, 213, 0.74);
  --tetris-disabled-bg: linear-gradient(180deg, rgba(201, 221, 195, 0.86), rgba(163, 194, 154, 0.72));
  --tetris-accent-text: #2f6f3c;
  --tetris-accent-dot-bg: linear-gradient(180deg, #8bcf79 0%, #4f9f5d 100%);
  --tetris-shadow: rgba(31, 79, 43, 0.12);
}

.app {
  height: 100vh;
  overflow: hidden;
  color: var(--tetris-text-primary, #f8fafc);
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
}
</style>
