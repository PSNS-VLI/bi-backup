import { type InjectionKey, inject, onDeactivated, onUnmounted } from 'vue'

import type { GxMenuItem } from '../../GxMenu'
import type { GxIconGroupItem } from '../../GxIconGroup'

interface GxLayoutHeaderProps {
  logo?: string
  title?: string
  icons?: Array<GxIconGroupItem>
}

interface GxLayoutAsideProps {
  menus: Array<GxMenuItem>
  collapse?: boolean
}

interface GxLayoutProps extends GxLayoutHeaderProps, GxLayoutAsideProps {
  asideFill?: boolean
  autoCollapse?: boolean | number
}
interface GxLayoutStatus {
  hideHeader: boolean
  hideAside: boolean
  collapse: boolean
}
type GxLayoutStatusKeys = Exclude<keyof GxLayoutStatus, 'collapse'>
type ChageLayoutStatus = (key: GxLayoutStatusKeys, status: boolean) => void
type GetLayoutStatus = (key: GxLayoutStatusKeys) => boolean

const ChageGxLayoutStatusKey = Symbol() as InjectionKey<ChageLayoutStatus>
const GetGxLayoutStatusKey = Symbol() as InjectionKey<GetLayoutStatus>
const injectChageGxLayoutStatus = () => inject(ChageGxLayoutStatusKey)
const injectGetGxLayoutStatus = () => inject(GetGxLayoutStatusKey)

const useLayoutHideOne = (keys: Array<GxLayoutStatusKeys>, reverse: boolean = false) => {
  const changeStatus = injectChageGxLayoutStatus()

  const toggleStatus = (status: boolean) => {
    if (changeStatus) {
      keys.forEach((key) => changeStatus(key, status))
    }
  }

  toggleStatus(!reverse)
  onUnmounted(() => {
    toggleStatus(reverse)
  })
  onDeactivated(() => {
    toggleStatus(reverse)
  })
}

const useLayoutHideHeader = (reverse: boolean = false) => useLayoutHideOne(['hideHeader'], reverse)
const useLayoutHideAside = (reverse: boolean = false) => useLayoutHideOne(['hideAside'], reverse)
const useLayoutFullScreen = (reverse: boolean = false) =>
  useLayoutHideOne(['hideHeader', 'hideAside'], reverse)

export {
  ChageGxLayoutStatusKey,
  GetGxLayoutStatusKey,
  injectChageGxLayoutStatus,
  injectGetGxLayoutStatus,
  useLayoutHideHeader,
  useLayoutHideAside,
  useLayoutFullScreen
}
export type {
  GxLayoutHeaderProps,
  GxLayoutAsideProps,
  GxLayoutProps,
  GxLayoutStatus,
  ChageLayoutStatus,
  GetLayoutStatus
}
