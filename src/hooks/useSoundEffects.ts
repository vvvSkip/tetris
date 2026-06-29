import { computed, readonly, shallowRef } from 'vue'

export type SoundEffectType = 'move' | 'rotate' | 'drop' | 'clear' | 'start' | 'pause' | 'gameOver' | 'menu'

interface SoundTone {
  frequency: number
  start: number
  duration: number
  gain?: number
  type?: OscillatorType
}

declare const wx: any

const SOUND_STORAGE_KEY = 'tetris-sound-enabled'
const soundEnabled = shallowRef(true)
let isSoundLoaded = false
let h5AudioContext: AudioContext | null = null
let miniAudioContext: any = null

const SOUND_PATTERNS: Record<SoundEffectType, SoundTone[]> = {
  move: [{ frequency: 360, start: 0, duration: 0.045, gain: 0.028, type: 'square' }],
  rotate: [{ frequency: 520, start: 0, duration: 0.06, gain: 0.035, type: 'triangle' }],
  drop: [
    { frequency: 280, start: 0, duration: 0.045, gain: 0.036, type: 'sawtooth' },
    { frequency: 180, start: 0.04, duration: 0.055, gain: 0.032, type: 'square' }
  ],
  clear: [
    { frequency: 520, start: 0, duration: 0.065, gain: 0.04, type: 'triangle' },
    { frequency: 680, start: 0.06, duration: 0.07, gain: 0.04, type: 'triangle' },
    { frequency: 860, start: 0.13, duration: 0.09, gain: 0.036, type: 'triangle' }
  ],
  start: [
    { frequency: 420, start: 0, duration: 0.06, gain: 0.035, type: 'sine' },
    { frequency: 620, start: 0.06, duration: 0.08, gain: 0.035, type: 'sine' }
  ],
  pause: [{ frequency: 220, start: 0, duration: 0.09, gain: 0.032, type: 'sine' }],
  gameOver: [
    { frequency: 340, start: 0, duration: 0.1, gain: 0.04, type: 'sawtooth' },
    { frequency: 250, start: 0.09, duration: 0.12, gain: 0.036, type: 'sawtooth' },
    { frequency: 160, start: 0.2, duration: 0.16, gain: 0.032, type: 'sine' }
  ],
  menu: [{ frequency: 660, start: 0, duration: 0.055, gain: 0.03, type: 'triangle' }]
}

function normalizeSoundEnabled(value: unknown) {
  if (value === false || value === 'false' || value === 0 || value === '0') {
    return false
  }

  return true
}

function loadSoundSetting() {
  if (!isSoundLoaded) {
    soundEnabled.value = normalizeSoundEnabled(uni.getStorageSync(SOUND_STORAGE_KEY))
    isSoundLoaded = true
  }
}

function getH5AudioContext() {
  // #ifdef H5
  if (h5AudioContext) return h5AudioContext

  const audioWindow = window as Window & {
    webkitAudioContext?: typeof AudioContext
  }
  const AudioContextConstructor = audioWindow.AudioContext || audioWindow.webkitAudioContext

  if (!AudioContextConstructor) return null

  h5AudioContext = new AudioContextConstructor()
  return h5AudioContext
  // #endif

  return null
}

function playH5Pattern(pattern: SoundTone[]) {
  // #ifdef H5
  const audioContext = getH5AudioContext()
  if (!audioContext) return

  if (audioContext.state === 'suspended') {
    void audioContext.resume()
  }

  pattern.forEach((tone) => {
    const startAt = audioContext.currentTime + tone.start
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    const maxGain = tone.gain ?? 0.035

    oscillator.type = tone.type ?? 'sine'
    oscillator.frequency.setValueAtTime(tone.frequency, startAt)
    gainNode.gain.setValueAtTime(0.0001, startAt)
    gainNode.gain.exponentialRampToValueAtTime(maxGain, startAt + 0.012)
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startAt + tone.duration)

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    oscillator.start(startAt)
    oscillator.stop(startAt + tone.duration + 0.03)
  })
  // #endif
}

function getMiniAudioContext() {
  // #ifdef MP-WEIXIN
  const wxRuntime = typeof wx !== 'undefined' ? wx : null

  if (!wxRuntime?.createWebAudioContext) return null
  if (!miniAudioContext) {
    miniAudioContext = wxRuntime.createWebAudioContext()
  }

  return miniAudioContext
  // #endif

  return null
}

function playMiniProgramPattern(pattern: SoundTone[]) {
  // #ifdef MP-WEIXIN
  const audioContext = getMiniAudioContext()
  if (!audioContext) return false

  if (audioContext.state === 'suspended' && audioContext.resume) {
    void audioContext.resume()
  }

  pattern.forEach((tone) => {
    const startAt = audioContext.currentTime + tone.start
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    const maxGain = tone.gain ?? 0.035

    oscillator.type = tone.type ?? 'sine'
    oscillator.frequency.setValueAtTime(tone.frequency, startAt)
    gainNode.gain.setValueAtTime(0.0001, startAt)
    gainNode.gain.exponentialRampToValueAtTime(maxGain, startAt + 0.012)
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startAt + tone.duration)

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    oscillator.start(startAt)
    oscillator.stop(startAt + tone.duration + 0.03)
  })

  return true
  // #endif

  return false
}

function playFallbackFeedback(effect: SoundEffectType) {
  // #ifndef H5
  if (effect === 'menu') return

  uni.vibrateShort({
    type: effect === 'gameOver' ? 'heavy' : 'light'
  })
  // #endif
}

function setSoundEnabled(nextEnabled: boolean) {
  soundEnabled.value = nextEnabled
  isSoundLoaded = true
  uni.setStorageSync(SOUND_STORAGE_KEY, nextEnabled)
}

function playSoundEffect(effect: SoundEffectType) {
  loadSoundSetting()
  if (!soundEnabled.value) return

  const pattern = SOUND_PATTERNS[effect]

  // #ifdef H5
  playH5Pattern(pattern)
  // #endif

  // #ifdef MP-WEIXIN
  if (!playMiniProgramPattern(pattern)) {
    playFallbackFeedback(effect)
  }
  // #endif
}

export function useSoundEffects() {
  loadSoundSetting()

  const soundLabel = computed(() => (soundEnabled.value ? '开启' : '关闭'))
  const nextSoundLabel = computed(() => (soundEnabled.value ? '关闭' : '开启'))

  function toggleSound() {
    const nextEnabled = !soundEnabled.value
    setSoundEnabled(nextEnabled)
    return nextEnabled
  }

  return {
    soundEnabled: readonly(soundEnabled),
    soundLabel,
    nextSoundLabel,
    loadSoundSetting,
    setSoundEnabled,
    toggleSound,
    playSoundEffect
  }
}
