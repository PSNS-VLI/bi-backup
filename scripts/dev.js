// @ts-check
import { dirname, resolve } from 'node:path'
import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { getEntryApp, print } from './utils.js'
import { createServer, preview, mergeConfig } from 'vite'
import viteConfig from './vite-config.js'
import minimist from 'minimist'

// infrastructure
const require = createRequire(import.meta.url)
const __dirname = dirname(fileURLToPath(import.meta.url))
// resolve CLI arguments
// eslint-disable-next-line no-undef
const args = minimist(process.argv.slice(2))
const previewMode = args.p || args.preview

// create vite server
const generateServer = async () => {
  const entryApp = await getEntryApp()
  const appDir = resolve(__dirname, `../packages/${entryApp.dir}`)
  const app = require(`../packages/${entryApp.dir}/package.json`)
  const config = mergeConfig(mergeConfig(app?.buildOptions?.viteOptions, viteConfig()), {
    root: appDir,
    resolve: {
      alias: {
        '@': resolve(appDir, './src')
      }
    },
    server: {
      host: true
    }
  })

  let server = null
  if (previewMode) {
    const appOutDir = config.build?.outDir || 'dist'
    if (!readdirSync(appDir).includes(appOutDir)) {
      print('Application unpackaged! Please pack the app with "pnpm run build" first!', 'error')
    }
    server = await preview(config)
  } else {
    server = await createServer(config)
    await server.listen()
  }

  server.printUrls()
  server.bindCLIShortcuts({ print: true })
}

generateServer()
