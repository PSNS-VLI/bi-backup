import { readdirSync, statSync } from 'node:fs'
import { createRequire } from 'node:module'
import minimist from 'minimist'
import inquirer from 'inquirer'
import pico from 'picocolors'

const capitailize = (/** @type {string} */ str) => str[0].toUpperCase() + str.slice(1)

/**
 * @typedef {'red'|'white'|'black'|'yellow'} Color
 */
/**
 * @typedef PrintTag
 * @property {Color} bg
 * @property {Color} txt
 * @property {string} name
 */
/**
 * @typedef PrintMsg
 * @property {Color} txt
 * @property {string} content
 */

const picoPrint = (/** @type {PrintTag}*/ tag, /** @type {PrintMsg}*/ msg) => {
  console.log()
  console.log(
    `${pico[tag.txt](pico[`bg${capitailize(tag.bg)}`](` ${tag.name.toUpperCase()} `))} ${pico[
      msg.txt
    ](`${capitailize(msg.content)}`)}`
  )
  console.log()
}

const PRINT = {
  error: (/** @type {string} */ msg, /** @type {boolean} */ exit = true) => {
    picoPrint({ name: 'error', bg: 'red', txt: 'black' }, { txt: 'red', content: msg })
    // eslint-disable-next-line no-undef
    exit && process.exit(1)
  },
  warn: (/** @type {string} */ msg, /** @type {boolean} */ exit = false) => {
    picoPrint({ name: 'warn', bg: 'yellow', txt: 'black' }, { txt: 'red', content: msg })
    // eslint-disable-next-line no-undef
    exit && process.exit(1)
  },
  info: (/** @type {string} */ msg) => console.log(msg.toUpperCase())
}

/**
 * print info to the console.
 * @param {string} msg
 * @param {'info'|'warn'|'error'} type
 */
const print = (msg, type = 'info', exit = false) => {
  exit = type === 'error' ? true : false
  if (PRINT[type]) {
    PRINT[type](msg, exit)
  } else {
    console.log(msg)
  }
}

const getApps = () => {
  // infrastructure
  const require = createRequire(import.meta.url)
  const appDirs = readdirSync(new URL('../packages', import.meta.url)).filter((appDir) =>
    statSync(new URL(`../packages/${appDir}`, import.meta.url)).isDirectory()
  )
  return appDirs.reduce((res, appDir) => {
    const app = require(`../packages/${appDir}/package.json`)
    if (!app) return res
    res.push({
      package: app,
      entry: app?.buildOptions?.entry || false,
      dir: appDir,
      name: app.name || appDir
    })
    return res
  }, [])
}

/**
 * get entry app name.
 */
const getEntryApp = async () => {
  // resolve CLI arguments
  // eslint-disable-next-line no-undef
  const args = minimist(process.argv.slice(2))
  const apps = getApps()
  const findEntryApp = () => {
    // find entry app from packages.
    return apps.find((app) => app.entry)?.dir
  }
  const inquireEntryApp = async () => {
    const res = await inquirer.prompt([
      {
        type: 'list',
        message: 'Please select the entry application:',
        name: 'entry',
        default: apps[0].dir,
        choices: apps.map((app) => ({ name: app.dir, value: app.dir }))
      }
    ])
    return res.entry
  }
  const entryApp = args.e || args.entry || findEntryApp() || (await inquireEntryApp())

  if (!entryApp) {
    print('no entry application is specified.', 'error')
  }
  const appDirs = apps.map((app) => app.dir)
  if (!appDirs.includes(entryApp)) {
    print(`entry "${entryApp}" is invalid! Should be one of (${appDirs.join(',')}).`, 'error')
  }
  return apps.find((app) => app.dir === entryApp)
}

const inquireIntention = async (
  /** @type {string} */ msg,
  /** @type {boolean} */ defaultIntention = false
) => {
  const res = await inquirer.prompt([
    {
      type: 'confirm',
      message: msg,
      name: 'intention',
      default: defaultIntention
    }
  ])

  return res.intention
}

export { print, getApps, getEntryApp, inquireIntention }
