// @ts-check
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { getEntryApp } from './utils.js'
import { build, mergeConfig } from 'vite'
import viteConfig from './vite-config.js'
import obfuscator from 'rollup-plugin-obfuscator'

// infrastructure
const require = createRequire(import.meta.url)
const __dirname = dirname(fileURLToPath(import.meta.url))

// create vite server
const generateServer = async () => {
  const entryApp = await getEntryApp()
  const appDir = resolve(__dirname, `../packages/${entryApp.dir}`)
  const app = require(`../packages/${entryApp.dir}/package.json`)

  await build(
    mergeConfig(mergeConfig(app?.buildOptions?.viteOptions, viteConfig()), {
      root: appDir,
      plugins: [
        obfuscator({
          global: true,
          options: {
            rotateUnicodeArray: true, // 旋转 Unicode 数组
            // 压缩代码
            compact: true,
            // // 禁用字符串文字的转换 \s* 就是有0个或多个空格 不能转义空格，很奇怪
            // reservedStrings: ['\\s*'],
            controlFlowFlattening: false, // 是否启用控制流扁平化(降低1.5倍的运行速度)
            deadCodeInjection: false, /// 随机的死代码块(增加了混淆代码的大小)
            debugProtection: false, // 此选项几乎不可能使用开发者工具的控制台选项卡
            debugProtectionInterval: 0, // 如果选中，则会在“控制台”选项卡上使用间隔强制调试模式，从而更难使用“开发人员工具”的其他功能。
            disableConsoleOutput: true, // 通过用空函数替换它们来禁用console.log，console.info，console.error和console.warn。这使得调试器的使用更加困难。
            identifierNamesGenerator: 'hexadecimal', // 标识符的混淆方式 hexadecimal(十六进制) mangled(短标识符)
            log: false,
            renameGlobals: false, // 是否启用全局变量和函数名称的混淆
            rotateStringArray: false, // 通过固定和随机（在代码混淆时生成）的位置移动数组。这使得将删除的字符串的顺序与其原始位置相匹配变得更加困难。如果原始源代码不小，建议使用此选项，因为辅助函数可以引起注意。
            selfDefending: false, // 混淆后的代码,不能使用代码美化,同时需要配置 cpmpat:true;
            stringArray: false, // 删除字符串文字并将它们放在一个特殊的数组中
            // stringArrayEncoding: false,
            stringArrayThreshold: 0.75,
            unicodeEscapeSequence: false // 允许启用/禁用字符串转换为unicode转义序列。Unicode转义序列大大增加了代码大小，并且可以轻松地将字符串恢复为原始视图。建议仅对小型源代码启用此选项。
          }
        })
      ],
      resolve: {
        alias: {
          '@': resolve(appDir, './src')
        }
      }
    })
  )
}

generateServer()
