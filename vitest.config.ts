import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './scripts/vite-config.js'

export default mergeConfig(
  viteConfig(),
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, '**/e2e/**'],
      coverage: {
        reporter: ['text', 'json', 'html']
      }
    }
  })
)
