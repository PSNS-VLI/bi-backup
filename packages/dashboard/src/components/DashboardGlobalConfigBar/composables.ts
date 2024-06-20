import { watch, onUnmounted, type WatchStopHandle } from 'vue'

import { type DashboardGlobalConfigStore } from '../../types/app/dashboard'
import { deepAssign } from '../../utils'

import {
  globalConfigKey,
  themes,
  initGlobalConfigData,
  getGlobalConfigData,
  LogoPosition,
  HeaderAlign
} from './config'

const themeNames = themes.map((theme) => theme.name)

const useWatchHelper = <P extends any, R extends any>(
  watcher: (configStore: DashboardGlobalConfigStore, callback?: (param: P) => R) => WatchStopHandle
) => {
  return (configStore: DashboardGlobalConfigStore, callback?: (param: P) => R) => {
    const watchHandleBuffer: Array<WatchStopHandle> = []

    watchHandleBuffer.push(watcher(configStore, callback))

    onUnmounted(() => {
      watchHandleBuffer.forEach((stopHandle) => stopHandle && stopHandle())
    })
  }
}

export const useThemeConfig = useWatchHelper<void, boolean>((configStore, callback) => {
  return watch(
    () => configStore.theme?.[globalConfigKey.theme]?.[globalConfigKey.themeName],
    (themeName: string) => {
      if (callback && !callback()) return

      if (themeNames.includes(themeName)) {
        deepAssign(
          configStore.theme,
          initGlobalConfigData().theme,
          themes.find((theme) => theme.name === themeName)?.config
        )
      }
    }
  )
})

const getBackground = (
  bgImgs: Array<{
    url: string
    position?: 'top' | 'bottom'
    size?: string
    repeat?: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat'
  }> = [],
  bgColor: string = ''
) => {
  const bgImg = bgImgs.reduce((bg, bgImg) => {
    const { url, position = 'top', size = '100%', repeat = 'no-repeat' } = bgImg

    if (!url) return bg

    return bg + `url('${url}') ${position}/${size} ${repeat},`
  }, '')
  return bgImg + (bgColor || 'transparent')
}

export type DashboardConfigData = {
  wrapper?: {
    style: Record<string, any>
  }
  inner?: {
    style: Record<string, any>
  }
  header?: {
    style: Record<string, any>
    comment: {
      style: Record<string, any>
      value: string
    }
    title: {
      showTitle: boolean
      wrapperStyle: Record<string, any>
      textStyle: Record<string, any>
      logo: string
    }
  }
  footer?: {
    style: Record<string, any>
    comment: {
      style: Record<string, any>
      value: string
    }
  }
}
export const useDashboardConfig = useWatchHelper<DashboardConfigData, void>(
  (configStore, callback) => {
    return watch(
      () => configStore.theme,
      (themeConfigStore) => {
        if (themeConfigStore) {
          const themeConfigData = getGlobalConfigData(configStore)

          const dashboardConfigData: DashboardConfigData = {
            inner: {
              style: {
                padding: themeConfigData.pagePadding,
                background: getBackground(
                  [
                    {
                      url: themeConfigData.dashboardTopBackgroundImage
                    },
                    {
                      url: themeConfigData.dashboardBottomBackgroundImage,
                      position: 'bottom'
                    },
                    {
                      url: themeConfigData.pageBackground.backgroundImage,
                      repeat: 'repeat-y'
                    }
                  ],
                  themeConfigData.pageBackground.backgroundColor
                )
              }
            },
            header: {
              style: {
                background: getBackground(
                  [
                    {
                      url: themeConfigData.pageHeader.background.backgroundImage
                    }
                  ],
                  themeConfigData.pageHeader.background.backgroundColor
                ),
                height: themeConfigData.pageHeader.height
              },
              comment: {
                value: themeConfigData.pageHeader.comment,
                style: {
                  paddingBottom: themeConfigData.pageHeader.padding
                }
              },
              title: {
                showTitle: themeConfigData.pageHeader.showTitle,
                logo: themeConfigData.pageHeader.logo,
                wrapperStyle: {
                  display: 'flex',
                  flexDirection:
                    themeConfigData.pageHeader.logoPosition === LogoPosition.LEFT
                      ? 'row'
                      : 'column',
                  justifyContent:
                    themeConfigData.pageHeader.logoPosition === LogoPosition.LEFT &&
                    themeConfigData.pageHeader.align === HeaderAlign.CENTER
                      ? 'center'
                      : '',
                  alignItems:
                    themeConfigData.pageHeader.logoPosition === LogoPosition.TOP &&
                    themeConfigData.pageHeader.align === HeaderAlign.CENTER
                      ? 'center'
                      : '',
                  columnGap:
                    themeConfigData.pageHeader.logoPosition === LogoPosition.LEFT ? '7px' : '0',
                  rowGap: themeConfigData.pageHeader.logoPosition === LogoPosition.TOP ? '7px' : '0'
                },
                textStyle: {
                  ...themeConfigData.pageHeader.titleStyle,
                  fontSize: themeConfigData.pageHeader.titleStyle.fontSize
                    ? themeConfigData.pageHeader.titleStyle.fontSize + 'px'
                    : '14px'
                }
              }
            },
            footer: {
              style: {
                background: getBackground(
                  [
                    {
                      url: themeConfigData.pageFooter.background.backgroundImage
                    }
                  ],
                  themeConfigData.pageFooter.background.backgroundColor
                ),
                height: themeConfigData.pageFooter.height
              },
              comment: {
                value: themeConfigData.pageFooter.comment,
                style: {
                  paddingTop: themeConfigData.pageFooter.padding
                }
              }
            }
          }

          callback && callback(dashboardConfigData)
        }
      },
      {
        deep: true,
        immediate: true
      }
    )
  }
)

export type ComponentContainerConfigData = {
  cardRadius: number
}
export const useComponentContainerConfig = useWatchHelper<ComponentContainerConfigData, void>(
  (configStore, callback) => {
    return watch(
      () => configStore.theme?.[globalConfigKey.globalStyle]?.[globalConfigKey.cardRadius],
      (cardRadius) => {
        if (cardRadius !== undefined) {
          const componentContainerConfigData: ComponentContainerConfigData = {
            cardRadius: parseInt(cardRadius)
          }

          callback && callback(componentContainerConfigData)
        }
      },
      {
        immediate: true
      }
    )
  }
)
