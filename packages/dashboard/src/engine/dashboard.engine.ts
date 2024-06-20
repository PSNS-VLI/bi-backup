import { type DashboardContainer } from '../blocks/Dashboard'
import type { ChartConfigStore } from '../types/configuration'
import { constWithReverse } from '../utils'

type EngineLabel = 'Beta' | 'Canary' | 'Release'
type EngineBrowserInfo = {
  name: string
  codeInEngine: number
  version: number
}
type BrowserName = 'CHROME' | 'SAFARI' | 'FIREFOX' | 'IE' | 'OPERA' | 'EDGE' | 'OTHER'

const EngineBrowserName = constWithReverse<Record<BrowserName, string>>({
  CHROME: 'Chrome',
  SAFARI: 'Safari',
  FIREFOX: 'Firefox',
  IE: 'Internet Explorer',
  OPERA: 'Opera',
  EDGE: 'Microsoft Edge',
  OTHER: 'Other'
})
const EngineBrowserCode = constWithReverse<Record<BrowserName, number>>({
  CHROME: 1,
  SAFARI: 2,
  FIREFOX: 3,
  IE: 4,
  OPERA: 5,
  EDGE: 6,
  OTHER: 0
})

export class BIDashboardEngine {
  readonly ENGINE_HISTORY_VERSIONS = [
    this.genVersion({
      major: 0,
      minor: 1,
      patch: 0,
      label: 'Beta'
    })
  ]
  readonly ENGINE_NAME = 'OpenBI'
  readonly ENGINE_VERSION = '0.2.0'
  readonly ENGINE_LABEL: EngineLabel = 'Beta'

  get version() {
    return `${this.ENGINE_NAME}-${this.ENGINE_VERSION}.${this.genBuildVersion()}(${this.ENGINE_LABEL})`
  }

  private readonly ConfigDataKeyMap = {
    VERSION: 'version',
    CANVAS: 'canvas',
    GLOBAL: 'global'
  }
  private container: DashboardContainer

  constructor(container: DashboardContainer) {
    this.container = container
  }

  inject(content: string) {
    const configData = this.parse(content)

    if (configData?.canvas) {
      const canvas = this.container.content

      canvas?.importCanvas(configData.canvas, {
        clearElements: true
      })
    }

    if (configData?.global) {
      const globalConfigBar = this.container.globalConfigBar
      globalConfigBar?.inject({
        configData: configData.global
      })
    }
  }

  generate(
    options: {
      justifySpace?: number
    } = {}
  ) {
    const { justifySpace = 0 } = options

    const canvas = this.container.content
    const globalConfigBar = this.container.globalConfigBar
    const configData: Record<string, any> = {
      [this.ConfigDataKeyMap.VERSION]: this.version
    }

    if (canvas) {
      configData[this.ConfigDataKeyMap.CANVAS] = canvas.exportCanvas()
    }

    if (globalConfigBar) {
      configData[this.ConfigDataKeyMap.GLOBAL] = globalConfigBar.configData
    }

    return JSON.stringify(configData, null, justifySpace)
  }

  parse(content: string) {
    const configData = this.ifComplyWithCurrentVersion(content)

    // identify version
    if (configData) {
      return configData as {
        version: string
        canvas: ChartConfigStore
        global: Record<string | number | symbol, any>
      }
    } else {
      return this.parseWithHistoryVersion(content)
    }
  }

  parseVersion(versionStr: string) {
    const regex = /(\w+)-(\d+)\.(\d+)\.(\d+)\.(\d+)\((\w+)\)/

    const versionObj = {
      version: '',
      engineName: this.ENGINE_NAME,
      major: NaN,
      minor: NaN,
      patch: NaN,
      build: NaN,
      label: '',
      browserName: '',
      browserVersion: NaN
    }

    if (regex.test(versionStr)) {
      const regexArray = regex.exec(versionStr)
      if (regexArray) {
        Object.assign(versionObj, {
          version: regexArray[0],
          engineName: regexArray[1] || this.ENGINE_NAME,
          major: regexArray[2],
          minor: regexArray[3],
          patch: regexArray[4],
          build: regexArray[5],
          label: regexArray[6]
        })

        try {
          const browserCodeStr = new String(regexArray[5])
          const browserNameCodeStr = browserCodeStr.slice(0, 1)
          const browserVersionCodeStr = browserCodeStr.slice(1)

          const browserNameCode = EngineBrowserCode[Number(browserNameCodeStr)]
          const browserName = EngineBrowserName[browserNameCode]
          const browserVersion = Number(browserVersionCodeStr)

          Object.assign(versionObj, {
            browserName: browserName ?? '',
            browserVersion: browserVersion ?? NaN
          })
        } catch (err) {
          console.log()
        }
      }
    }

    return versionObj
  }

  private parseWithHistoryVersion(content: string) {
    const configData = JSON.parse(content)

    // 2024.6.13 night v0.1.0 to v0.2.0 patch
    if (!configData[this.ConfigDataKeyMap.VERSION]) {
      return {
        [this.ConfigDataKeyMap.VERSION]: this.version,
        [this.ConfigDataKeyMap.CANVAS]: configData
      }
    }

    if (this.ENGINE_HISTORY_VERSIONS.includes(configData[this.ConfigDataKeyMap.VERSION])) {
      return
    }

    return
  }

  private ifComplyWithCurrentVersion(content: string) {
    const configData = JSON.parse(content)
    const versionObj = this.parseVersion(configData?.[this.ConfigDataKeyMap.VERSION])
    const contentVersion = `${versionObj.major}.${versionObj.minor}.${versionObj.patch}`

    if (
      contentVersion === this.ENGINE_VERSION &&
      configData?.[this.ConfigDataKeyMap.CANVAS] &&
      configData?.[this.ConfigDataKeyMap.GLOBAL]
    ) {
      return configData
    }

    return false
  }

  private genVersion(options: { major: number; minor: number; patch: number; label: EngineLabel }) {
    const { major, minor, patch, label } = options

    return `${this.ENGINE_NAME}-${major}.${minor}.${patch}.${this.genBuildVersion()}-(${label})`
  }

  private genBuildVersion() {
    const browser = this.getBrowserInfo()

    return `${browser.codeInEngine}${browser.version}`
  }

  private getBrowserInfo(): EngineBrowserInfo {
    const userAgent = navigator.userAgent
    const browserInfo: {
      name: BrowserName
      version: string | undefined
    } = {
      name: 'OTHER',
      version: undefined
    }

    // Check for different browser engines
    if (userAgent.indexOf('Chrome') !== -1 && userAgent.indexOf('Edge') === -1) {
      browserInfo.name = 'CHROME'
      browserInfo.version = userAgent.match(/Chrome\/(\d+)/)?.[1]
    } else if (
      userAgent.indexOf('Safari') !== -1 &&
      userAgent.indexOf('Chrome') === -1 &&
      userAgent.indexOf('Edge') === -1
    ) {
      browserInfo.name = 'SAFARI'
      browserInfo.version = userAgent.match(/Version\/(\d+)/)?.[1]
    } else if (userAgent.indexOf('Firefox') !== -1) {
      browserInfo.name = 'FIREFOX'
      browserInfo.version = userAgent.match(/Firefox\/(\d+)/)?.[1]
    } else if (userAgent.indexOf('MSIE') !== -1 || userAgent.indexOf('Trident/') !== -1) {
      browserInfo.name = 'IE'
      if (userAgent.indexOf('MSIE') !== -1) {
        browserInfo.version = userAgent.match(/MSIE (\d+)/)?.[1]
      } else {
        browserInfo.version = userAgent.match(/rv:(\d+)/)?.[1]
      }
    } else if (userAgent.indexOf('Opera') !== -1 || userAgent.indexOf('OPR') !== -1) {
      browserInfo.name = 'OPERA'
      if (userAgent.indexOf('OPR') !== -1) {
        browserInfo.version = userAgent.match(/OPR\/(\d+)/)?.[1]
      } else {
        browserInfo.version = userAgent.match(/Version\/(\d+)/)?.[1]
      }
    } else if (userAgent.indexOf('Edge') !== -1) {
      browserInfo.name = 'EDGE'
      browserInfo.version = userAgent.match(/Edge\/(\d+)/)?.[1]
    }

    return {
      name: EngineBrowserName[browserInfo.name] ?? EngineBrowserName.OTHER,
      version: parseInt(browserInfo.version || '0'),
      codeInEngine: EngineBrowserCode[browserInfo.name] ?? EngineBrowserCode.OTHER
    }
  }
}
