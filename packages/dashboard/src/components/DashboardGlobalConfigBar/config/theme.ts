import { getTextConfigKeyMap } from '../../../common'
import { defineConfigKey } from '../../../utils'

import { CardRadius, ColorScheme, LogoPosition } from './enum'
import {
  globalConfigKey,
  backgroundImageKeys,
  backgroundKeys,
  footerItemKeys,
  DashboardTopMaterial,
  DashboardBottomMaterial,
  DashboardBackgroundMaterial
} from './common'

export const enum ThemeName {
  DEFAULT = '默认',
  TECHNOLOGY = '科技',
  ACTIVITY = '活动',
  SIMPLE = '简约',
  INDIGO = '靛蓝'
}

type Theme = {
  name: string
  thumbnail: string
  config: Record<string, any>
}

// keys
const pageBackgroundKey = defineConfigKey(globalConfigKey.pageBackground, backgroundKeys)
const pageBackgroundImageKey = defineConfigKey(pageBackgroundKey.img, backgroundImageKeys)
const pageHeaderTitleTextKey = getTextConfigKeyMap(globalConfigKey.pageHeaderTitleText)

const pageHeaderFooterItemKey = defineConfigKey(globalConfigKey.pageHeader, footerItemKeys)
const pageHeaderBackgroundKey = defineConfigKey(pageHeaderFooterItemKey.background, backgroundKeys)
const pageHeaderBackgroundImageKey = defineConfigKey(
  pageHeaderBackgroundKey.img,
  backgroundImageKeys
)
const pageFooterFooterItemKey = defineConfigKey(globalConfigKey.pageFooter, footerItemKeys)
const pageFooterBackgroundKey = defineConfigKey(pageFooterFooterItemKey.background, backgroundKeys)
const pageFooterBackgroundImageKey = defineConfigKey(
  pageFooterBackgroundKey.img,
  backgroundImageKeys
)

const dashboardTopBackgroundImageKey = defineConfigKey(
  globalConfigKey.dashboardBckgroundTop,
  backgroundImageKeys
)
const dashboardBottomBackgroundImageKey = defineConfigKey(
  globalConfigKey.dashboardBckgroundBottom,
  backgroundImageKeys
)

// define macro
const defineTheme = (options: {
  name: ThemeName
  thumbnail: string

  chartColorScheme?: ColorScheme
  cardRadius?: CardRadius

  pageBackgroundColor?: string
  pageBackgroundImage?: string

  pageHeaderTitleStyle?: {
    color?: string
    fontSize?: number
    fontWeight?: string
    fontStyle?: string
  }
  pageHeaderLogo?: string
  pageHeaderBackgroundColor?: string
  pageHeaderBackgroundImage?: string
  pageHeaderBackgroundHeight?: number

  pageFooterBackgroundColor?: string
  pageFooterBackgroundImage?: string
  pageFooterBackgroundHeight?: number

  dashboardTopBackgroundImage?: string
  dashboardBottomBackgroundImage?: string
}) => {
  const {
    name,
    thumbnail,
    chartColorScheme = ColorScheme.SMART,
    cardRadius = CardRadius.NONE,
    pageBackgroundColor = '',
    pageBackgroundImage = '',
    pageHeaderTitleStyle = undefined,
    pageHeaderLogo = '',
    pageHeaderBackgroundColor = '',
    pageHeaderBackgroundImage = '',
    pageHeaderBackgroundHeight = 100,

    pageFooterBackgroundColor = '',
    pageFooterBackgroundImage = '',
    pageFooterBackgroundHeight = 100,

    dashboardTopBackgroundImage = '',
    dashboardBottomBackgroundImage = ''
  } = options

  const config: Record<string, any> = {
    [globalConfigKey.theme]: {
      [globalConfigKey.themeName]: name
    },
    [globalConfigKey.globalStyle]: {
      [globalConfigKey.chartColorSchemes]: chartColorScheme,
      [globalConfigKey.cardRadius]: cardRadius
    },
    [globalConfigKey.pageLayout]: {
      [globalConfigKey.pageBackground]: {
        [pageBackgroundKey.color]: pageBackgroundColor,
        [pageBackgroundKey.img]: {
          [pageBackgroundImageKey.showImg]: !!pageBackgroundImage,
          [pageBackgroundImageKey.imgSrc]: pageBackgroundImage
        }
      },
      [globalConfigKey.pageHeader]: {
        [globalConfigKey.pageHeaderTitle]: {
          [globalConfigKey.pageHeaderShowTitle]: !!pageHeaderTitleStyle,
          [globalConfigKey.pageHeaderTitleText]: {
            [pageHeaderTitleTextKey.color]: pageHeaderTitleStyle?.color,
            [pageHeaderTitleTextKey.fontSize]: pageHeaderTitleStyle?.fontSize,
            [pageHeaderTitleTextKey.textStyle]: {
              fontWeight: pageHeaderTitleStyle?.fontWeight,
              fontStyle: pageHeaderTitleStyle?.fontStyle
            }
          }
        },
        [globalConfigKey.pageHeaderLogo]: {
          [globalConfigKey.pageHeaderShowLogo]: pageHeaderLogo ? true : false,
          [globalConfigKey.pageHeaderLogoImgSrc]: pageHeaderLogo,
          [globalConfigKey.pageHeaderLogoPosition]: LogoPosition.LEFT
        },
        [globalConfigKey.pageHeader]: {
          [pageHeaderFooterItemKey.background]: {
            [pageHeaderBackgroundKey.color]: pageHeaderBackgroundColor,
            [pageHeaderBackgroundKey.img]: {
              [pageHeaderBackgroundKey.img]: {
                [pageHeaderBackgroundImageKey.imgSrc]: pageHeaderBackgroundImage
              }
            }
          },
          [pageHeaderFooterItemKey.backgroundHeight]: pageHeaderBackgroundHeight
        }
      },
      [globalConfigKey.pageFooter]: {
        [pageFooterFooterItemKey.background]: {
          [pageFooterBackgroundKey.color]: pageFooterBackgroundColor,
          [pageFooterBackgroundKey.img]: {
            [pageFooterBackgroundKey.img]: {
              [pageFooterBackgroundImageKey.showImg]: !!pageFooterBackgroundImage,
              [pageFooterBackgroundImageKey.imgSrc]: pageFooterBackgroundImage
            }
          }
        },
        [pageFooterFooterItemKey.backgroundHeight]: pageFooterBackgroundHeight
      }
    },
    [globalConfigKey.dashboardBckground]: {
      [globalConfigKey.dashboardBckgroundTop]: {
        [dashboardTopBackgroundImageKey.showImg]: !!dashboardTopBackgroundImage,
        [dashboardTopBackgroundImageKey.imgSrc]: dashboardTopBackgroundImage
      },
      [globalConfigKey.dashboardBckgroundBottom]: {
        [dashboardBottomBackgroundImageKey.showImg]: !!dashboardBottomBackgroundImage,
        [dashboardBottomBackgroundImageKey.imgSrc]: dashboardBottomBackgroundImage
      }
    }
  }

  return { name, thumbnail, config }
}

// THEME
// [THEME] DEFAULT
export const defineDefaultTheme = () =>
  defineTheme({
    name: ThemeName.DEFAULT,
    thumbnail:
      'https://img.alicdn.com/imgextra/i2/O1CN01kAmRu51CJWb7yNhUl_!!6000000000060-49-tps-2068-3188.webp'
  })
// [THEME] TECHNOLOGY
export const defineTechnologyTheme = () =>
  defineTheme({
    name: ThemeName.TECHNOLOGY,
    thumbnail:
      'https://img.alicdn.com/imgextra/i2/O1CN01xyMcIo1IlolC5Iypc_!!6000000000934-49-tps-2068-3246.webp',

    cardRadius: CardRadius.SMALL,
    pageBackgroundColor: 'rgba(10, 103, 223)',

    dashboardTopBackgroundImage: DashboardTopMaterial.TECHNOLOGY_ONE.url,
    dashboardBottomBackgroundImage: DashboardBottomMaterial.TECHNOLOGY_ONE.url
  })

export const defineActivityTheme = () =>
  defineTheme({
    name: ThemeName.ACTIVITY,
    thumbnail:
      'https://img.alicdn.com/imgextra/i2/O1CN01vGDPrL1sh4pPdkowC_!!6000000005797-49-tps-2068-3228.webp',

    cardRadius: CardRadius.BIG,
    pageBackgroundImage: DashboardBackgroundMaterial.ACTIVITY.url,

    dashboardTopBackgroundImage: DashboardTopMaterial.ACTIVITY_ONE.url,
    dashboardBottomBackgroundImage: DashboardBottomMaterial.ACTIVITY_ONE.url
  })

export const themes: Array<Theme> = [
  defineDefaultTheme(),
  defineTechnologyTheme(),
  defineActivityTheme()
]
