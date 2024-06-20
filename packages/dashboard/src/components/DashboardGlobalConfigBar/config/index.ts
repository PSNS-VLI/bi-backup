import { defineAsyncComponent } from 'vue'

import type {
  DashboardGlobalConfig,
  DashboardGlobalConfigStore
} from '../../../types/app/dashboard'
import {
  deepAssign,
  initCollapseConfigData,
  defineCollapse,
  defineSubCollapse,
  defineSelect,
  defineRadioGroup,
  defineCheckboxWrapper,
  defineCustom
} from '../../../utils'
import { defineTextConfig, getTextConfigData } from '../../../common'

import {
  globalConfigKey,
  defineImagePicker,
  defineBackground,
  defineBackgroundImage,
  defineFooterItems,
  getBackgroundConfigData,
  getBackgroundImageConfigData,
  getFooterItemsConfigData,
  dashboardTopMaterials,
  dashboardBottomMaterials,
  dashboardBackgroundMaterials
} from './common'
import { ThemeName, themes, defineDefaultTheme } from './theme'
import {
  ColorScheme,
  CardRadius,
  CardSpacing,
  PagePadding,
  LogoPosition,
  HeaderAlign
} from './enum'

export { globalConfigKey }
export * from './theme'
export * from './enum'

// common

// [common] themePicker
const defineThemePicker = (wrapperKey: string) => {
  return defineCustom({
    key: wrapperKey,
    label: '',
    component: defineAsyncComponent(() => import('./custom-components/theme-picker.vue')),
    attributes: {
      themes
    },
    default: ThemeName.DEFAULT
  })
}

export const defineGlobalConfig = () => {
  const globalConfig: DashboardGlobalConfig = {
    theme: [
      defineCollapse({
        key: globalConfigKey.theme,
        label: '应用服务主题',
        children: [defineThemePicker(globalConfigKey.themeName)]
      }),
      defineCollapse({
        key: globalConfigKey.globalStyle,
        label: '全局样式',
        children: [
          defineSelect({
            key: globalConfigKey.chartColorSchemes,
            label: '图表色系',
            inline: true,
            options: [{ label: '智能', value: ColorScheme.SMART }],
            default: ColorScheme.SMART
          }),
          defineRadioGroup({
            key: globalConfigKey.cardRadius,
            label: '卡片圆角',
            inline: true,
            options: [
              {
                label: '无',
                value: CardRadius.NONE
              },
              {
                label: '小',
                value: CardRadius.SMALL
              },
              {
                label: '大',
                value: CardRadius.BIG
              }
            ],
            default: CardRadius.NONE
          }),
          defineRadioGroup({
            key: globalConfigKey.cardSpacing,
            label: '间距',
            inline: true,
            options: [
              {
                label: '紧凑',
                value: CardSpacing.COMPACT
              },
              {
                label: '常规',
                value: CardSpacing.NORMAL
              }
            ],
            default: CardSpacing.COMPACT
          })
        ]
      }),
      defineCollapse({
        key: globalConfigKey.pageLayout,
        label: '页面布局',
        children: [
          defineBackground(globalConfigKey.pageBackground, {
            label: '页面背景',
            materials: dashboardBackgroundMaterials
          }),
          defineSelect({
            key: globalConfigKey.pagePadding,
            label: '页面边距',
            inline: true,
            options: [
              {
                label: '常规（上下10像素，左右12像素）',
                value: PagePadding.NORMAL
              },
              {
                label: '超宽页面（8像素）',
                value: PagePadding.WIDE_LAYOUT
              }
            ],
            default: PagePadding.NORMAL
          }),
          defineSubCollapse({
            type: 'collapse',
            key: globalConfigKey.pageHeader,
            label: '页面标题区',
            children: [
              defineCheckboxWrapper({
                key: globalConfigKey.pageHeaderTitle,
                label: '显示主标题',
                checkboxKey: globalConfigKey.pageHeaderShowTitle,
                children: [
                  defineTextConfig(globalConfigKey.pageHeaderTitleText, {
                    maxFontSize: 75
                  }),
                  defineCheckboxWrapper({
                    key: globalConfigKey.pageHeaderLogo,
                    checkboxKey: globalConfigKey.pageHeaderShowLogo,
                    label: 'Logo图',
                    children: [
                      defineImagePicker(globalConfigKey.pageHeaderLogoImgSrc),
                      defineSelect({
                        key: globalConfigKey.pageHeaderLogoPosition,
                        label: '',
                        inline: true,
                        options: [
                          {
                            label: '标题左侧',
                            value: LogoPosition.LEFT
                          },
                          {
                            label: '标题上方',
                            value: LogoPosition.TOP
                          }
                        ],
                        default: LogoPosition.LEFT
                      })
                    ]
                  }),
                  defineRadioGroup({
                    key: globalConfigKey.pageHeaderAlign,
                    label: '对齐方式',
                    options: [
                      {
                        label: '左对齐',
                        value: HeaderAlign.LEFT
                      },
                      {
                        label: '居中对齐',
                        value: HeaderAlign.CENTER
                      }
                    ],
                    default: HeaderAlign.LEFT
                  })
                ]
              }),
              ...defineFooterItems(globalConfigKey.pageHeader, {
                materials: dashboardTopMaterials
              })
            ]
          }),
          defineSubCollapse({
            type: 'collapse',
            key: globalConfigKey.pageFooter,
            label: '页尾',
            children: defineFooterItems(globalConfigKey.pageFooter, {
              materials: dashboardBottomMaterials
            })
          })
        ]
      }),
      defineCollapse({
        key: globalConfigKey.dashboardBckground,
        label: '应用服务背景',
        children: [
          defineBackgroundImage(globalConfigKey.dashboardBckgroundTop, {
            label: '顶部图片',
            materials: dashboardTopMaterials
          }),
          defineBackgroundImage(globalConfigKey.dashboardBckgroundBottom, {
            label: '底部图片',
            materials: dashboardBottomMaterials
          })
        ]
      })
    ],
    advance: []
  }

  return globalConfig
}

export const initGlobalConfigData = (
  globalConfig: DashboardGlobalConfig = defineGlobalConfig()
) => {
  return {
    theme: deepAssign({}, initCollapseConfigData(globalConfig.theme), defineDefaultTheme().config),
    advance: initCollapseConfigData(globalConfig.advance)
  } as DashboardGlobalConfigStore
}

export const getGlobalConfigData = (configStore: DashboardGlobalConfigStore) => {
  const configKey = globalConfigKey
  const themeConfigWrapper = configStore.theme

  const globalStyleConfigWrapper = themeConfigWrapper?.[configKey.globalStyle]
  const pageLayoutConfigWrapper = themeConfigWrapper?.[configKey.pageLayout]
  const dashboardConfigWrapper = themeConfigWrapper?.[configKey.dashboardBckground]

  const pageHeaderConfigWrapper = pageLayoutConfigWrapper?.[configKey.pageHeader]
  const pageHeaderTitleConfigWrapper = pageHeaderConfigWrapper?.[configKey.pageHeaderTitle]
  const pageHeaderLogoConfigWrapper = pageHeaderTitleConfigWrapper?.[configKey.pageHeaderLogo]

  const themeConfigData = {
    theme: themeConfigWrapper?.[configKey.theme]?.[configKey.themeName] ?? ThemeName.DEFAULT,
    chartColorSchemes: globalStyleConfigWrapper?.[configKey.chartColorSchemes],
    cardRadius: globalStyleConfigWrapper?.[configKey.cardRadius],
    cardSpacing: globalStyleConfigWrapper?.[configKey.cardSpacing],
    pageBackground: getBackgroundConfigData(configKey.pageBackground, pageLayoutConfigWrapper),
    pagePadding: pageLayoutConfigWrapper?.[configKey.pagePadding],
    pageHeader: {
      showTitle: pageHeaderTitleConfigWrapper?.[configKey.pageHeaderShowTitle],
      titleStyle: getTextConfigData(configKey.pageHeaderTitleText, pageHeaderTitleConfigWrapper),
      logo: pageHeaderLogoConfigWrapper?.[configKey.pageHeaderShowLogo]
        ? pageHeaderLogoConfigWrapper?.[configKey.pageHeaderLogoImgSrc]
        : '',
      logoPosition: pageHeaderLogoConfigWrapper?.[configKey.pageHeaderLogoPosition],
      align: pageHeaderTitleConfigWrapper?.[configKey.pageHeaderAlign],
      ...getFooterItemsConfigData(configKey.pageHeader, pageHeaderConfigWrapper)
    },
    pageFooter: getFooterItemsConfigData(
      configKey.pageFooter,
      pageLayoutConfigWrapper?.[configKey.pageFooter]
    ),
    dashboardTopBackgroundImage: getBackgroundImageConfigData(
      configKey.dashboardBckgroundTop,
      dashboardConfigWrapper
    ),
    dashboardBottomBackgroundImage: getBackgroundImageConfigData(
      configKey.dashboardBckgroundBottom,
      dashboardConfigWrapper
    )
  }

  return themeConfigData
}
