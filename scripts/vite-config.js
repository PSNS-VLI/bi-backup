import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Babel from '@rollup/plugin-babel'

import { getApps } from './utils.js'

/** @type {() => import('vite').UserConfig} */
export default () => ({
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      dts: false,
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      dts: false,
      resolvers: [ElementPlusResolver()]
    }),
    Babel({
      extensions: ['.ts'],
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }]
      ]
    })
  ],
  envDir: resolve(fileURLToPath(import.meta.url), '../../env'),
  resolve: {
    alias: getApps().reduce((alias, app) => {
      const absAppDir = resolve(fileURLToPath(import.meta.url), `../../packages/${app.dir}`)
      alias[app.name] = resolve(absAppDir, `${app.package.main || 'src'}`)
      if (app.entry) {
        alias['@'] = resolve(absAppDir, 'src')
      }
      return alias
    }, {})
  }
})
