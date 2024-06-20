// @ts-check
import { dirname, resolve, join } from 'node:path'
import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { print, getEntryApp, inquireIntention } from './utils.js'
import minimist from 'minimist'
import { Manager } from 'pont-engine/lib/compatible/Manager.js'
import { Config } from 'pont-engine'

// infrastructure
const require = createRequire(import.meta.url)
const __dirname = dirname(fileURLToPath(import.meta.url))
// resolve CLI arguments
// eslint-disable-next-line no-undef
const args = minimist(process.argv.slice(2))
const mockMode = args.m || args.mock
const diffMode = args.d || args.diff
const listMode = args.l || args.list
const updateMode = args.u || args.update

// create vite server
;(async () => {
  const entryApp = await getEntryApp()
  const appDir = resolve(__dirname, `../packages/${entryApp.dir}`)
  const app = require(`../packages/${entryApp.dir}/package.json`)

  const { swaggerApi, swaggerVersion, outDir = './src/api', mock } = app?.buildOptions?.api || {}
  if (!(swaggerApi && swaggerVersion)) {
    print(
      `api config not found! Please config the "api" filed in the ${appDir}\\package.json first!`,
      'error'
    )
  }

  try {
    if (
      readdirSync(resolve(appDir, outDir)).length &&
      !(await inquireIntention('Whether to overwrite the existing interface?'))
    ) {
      print('operation cancellation', 'warn', true)
    }
  } catch {
    /* empty */
  }

  const baseConfig = {
    originUrl: swaggerApi,
    originType: swaggerVersion,
    outDir: join(`../packages/${entryApp.dir}`, outDir),
    templatePath: './pont-generator'
  }
  if (mockMode) {
    Object.assign(baseConfig, {
      mocks: {
        enable: true,
        basePath: '',
        port: 8080,
        wrapper: '{"code": 0, "data": {response}, "message": ""}',
        ...mock
      }
    })
  }
  // @ts-ignore
  // eslint-disable-next-line no-undef
  const manager = new Manager(process.cwd(), new Config(baseConfig), __dirname)
  await manager.ready()

  if (diffMode || updateMode) {
    manager.calDiffs()
    const { modDiffs, boDiffs } = manager.diffs

    let updated = false
    if (modDiffs.length) {
      console.log('模块：')
      console.log(
        modDiffs
          .map((mod) => `${mod.name}(${(mod.details ?? []).join(',').slice(0, 20)})`)
          .join('\n')
      )
      updated = true
    }

    if (boDiffs.length) {
      console.log('基类：')
      console.log(
        boDiffs.map((bo) => `${bo.name}(${(bo.details ?? []).join(',').slice(0, 20)})`).join('\n')
      )
      updated = true
    }

    if (!updated) {
      console.log('未发现接口与远程存在差异')
    }

    if (updateMode) {
      if (modDiffs.length || boDiffs.length) {
        modDiffs.map((mod) => manager.makeSameMod(mod.name))
        boDiffs.map((bo) => manager.makeSameBase(bo.name))
        manager.regenerateFiles()
      }
    }
  } else if (listMode) {
    console.log(manager.allConfigs.map((conf) => conf.name).join('  '))
  }
})()
