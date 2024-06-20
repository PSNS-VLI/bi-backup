import type { Component as VueComponent } from 'vue'

import type { Tooltip, Key, Nullable } from './common'

export interface ItemsInterface<T extends { key: Key }> {
  readonly items: Array<T>

  addItem(item: T): Key
  delItem(itemKey: Key): void
  getItem(itemKey: Key): T | undefined
}

export interface ContainerBarItem {
  readonly key: Key
}

export interface ContainerBarClickItem extends ContainerBarItem {
  onClick(): void
}

export interface ContainerBarMenu extends ContainerBarClickItem {
  icon?: string
  title?: string
  tooltip?: Tooltip
}

export interface ContainerBarButton extends ContainerBarClickItem {
  title?: string
}

export interface ContainerBarCustom extends ContainerBarItem {
  component: VueComponent
}

export interface ContainerBarInterface<
  T extends ContainerInterface = ContainerInterface,
  U extends ContainerBarItem = ContainerBarItem
> extends ItemsInterface<U> {
  readonly key: Key
  readonly opened: boolean

  bindContext(context: T): void
  getContext(): Nullable<T>

  collapse(): void
  open(): void
  inject(...args: any[]): void
}

export interface ContainerMenuBarInterface<
  T extends ContainerInterface = ContainerInterface,
  U extends ContainerBarItem = ContainerBarItem
> extends ContainerBarInterface<T, U> {}

export interface ContainerToolBarInterface<
  T extends ContainerInterface = ContainerInterface,
  U extends ContainerBarItem = ContainerBarItem
> extends ContainerBarInterface<T, U> {}

export interface ContainerStatusBarInterface<
  T extends ContainerInterface = ContainerInterface,
  U extends ContainerBarItem = ContainerBarItem
> extends ContainerBarInterface<T, U> {}

export interface ContainerSideBarInterface<
  T extends ContainerInterface = ContainerInterface,
  U extends ContainerBarItem = ContainerBarItem
> extends ContainerBarInterface<T, U> {
  readonly title: string
}

// container
export type ContainerBarType = 'menuBar' | 'toolBar' | 'sideBars' | 'statusBar'
export interface ContainerInterface<T extends any = any> {
  readonly menuBar: Nullable<ContainerMenuBarInterface>
  readonly toolBar: Nullable<ContainerToolBarInterface>
  readonly sideBars: Array<ContainerSideBarInterface>
  readonly statusBar: Nullable<ContainerStatusBarInterface>
  readonly content: Nullable<T>

  bindBar(barType: ContainerBarType, bar: ContainerBarInterface): void
  setContent(content: any): any

  collapseBar(barKeys: Array<Key>, barType?: ContainerBarType): void
  displayBar(barKeys: Array<Key>, barType?: ContainerBarType): void
  provide(barKey: Key, data: any, barType?: ContainerBarType): void
}
