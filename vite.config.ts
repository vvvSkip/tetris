import { defineConfig } from 'vite'
import uniPlugin from '@dcloudio/vite-plugin-uni'

const uni = typeof uniPlugin === 'function' ? uniPlugin : uniPlugin.default

export default defineConfig({
  base: 'html/tetris/',
   plugins: [uni()],
  server: {
    host: '0.0.0.0'
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "nutui-uniapp/styles/variables.scss";\n'
      }
    }
  }
})
