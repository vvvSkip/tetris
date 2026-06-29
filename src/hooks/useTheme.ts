import { computed, shallowRef } from 'vue'

export type AppTheme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'tetris-theme'
const theme = shallowRef<AppTheme>('dark')
let isThemeLoaded = false

function normalizeTheme(value: unknown): AppTheme {
  return value === 'light' ? 'light' : 'dark'
}

function applyThemeChrome() {
  const isLight = theme.value === 'light'

  uni.setNavigationBarColor({
    frontColor: isLight ? '#000000' : '#ffffff',
    backgroundColor: isLight ? '#eef8ef' : '#111827'
  })

  // #ifdef H5
  document.body.setAttribute('data-theme', theme.value)
  // #endif
}

export function loadTheme() {
  if (!isThemeLoaded) {
    theme.value = normalizeTheme(uni.getStorageSync(THEME_STORAGE_KEY))
    isThemeLoaded = true
  }

  applyThemeChrome()
}

export function setTheme(nextTheme: AppTheme) {
  theme.value = nextTheme
  isThemeLoaded = true
  uni.setStorageSync(THEME_STORAGE_KEY, nextTheme)
  applyThemeChrome()
}

export function useTheme() {
  loadTheme()

  const themeClass = computed(() => `theme-${theme.value}`)
  const themeLabel = computed(() => (theme.value === 'dark' ? '深色' : '浅色'))
  const nextThemeLabel = computed(() => (theme.value === 'dark' ? '浅色' : '深色'))

  function toggleTheme() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  return {
    theme,
    themeClass,
    themeLabel,
    nextThemeLabel,
    loadTheme,
    setTheme,
    toggleTheme
  }
}
