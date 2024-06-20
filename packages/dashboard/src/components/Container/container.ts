import type { Key, Nullable } from '../../types/common'
import type {
  ItemsInterface,
  ContainerBarType,
  ContainerBarInterface,
  ContainerBarItem,
  ContainerInterface,
  ContainerMenuBarInterface,
  ContainerToolBarInterface,
  ContainerSideBarInterface,
  ContainerStatusBarInterface
} from '../../types/container'

export class Container<T extends any = any> implements ContainerInterface<T> {
  menuBar: Nullable<ContainerMenuBarInterface> = undefined
  toolBar: Nullable<ContainerToolBarInterface> = undefined
  sideBars: Array<ContainerSideBarInterface> = []
  statusBar: Nullable<ContainerStatusBarInterface> = undefined
  content: Nullable<T> = undefined

  protected bars: Array<ContainerBarInterface> = []

  bindBar(barType: ContainerBarType, bar: ContainerBarInterface) {
    const indicator: Nullable<ContainerBarInterface> = this[
      barType
    ] as Nullable<ContainerBarInterface>

    if (Array.isArray(indicator)) {
      indicator.push(bar)
    } else {
      ;(this[barType] as Nullable<ContainerBarInterface>) = bar
    }

    const previousBarIndex = this.bars.findIndex((item) => item.key === bar.key)

    if (previousBarIndex < 0) {
      this.bars.push(bar)
      bar.bindContext(this)
    }
  }

  setContent(content: any) {
    this.content = content
  }

  collapseBar(barKeys: Array<string>, barType?: ContainerBarType) {
    this.findBars(barKeys, barType).forEach((bar) => bar.collapse())
  }

  displayBar(barKeys: Array<string>, barType?: ContainerBarType) {
    this.findBars(barKeys, barType).forEach((bar) => bar.open())
  }

  provide(barKey: string, data: any, barType?: ContainerBarType) {
    const bar = this.findBar(barKey, barType)
    bar?.inject(data)
  }

  protected findBar(barKey: Key, barType?: ContainerBarType): ContainerBarInterface | undefined {
    let barTemp: ContainerBarInterface | undefined

    if (barType) {
      const temp = this[`${barType}`]
      if (temp) {
        barTemp = Array.isArray(temp)
          ? temp.find((item) => item.key === barKey)
          : (temp as ContainerBarInterface).key === barKey
            ? temp
            : undefined
      }
    } else {
      barTemp = this.bars.find((bar) => bar.key === barKey)
    }

    return barTemp
  }

  protected findBars(
    barKeys: Array<Key>,
    barType?: ContainerBarType
  ): Array<ContainerBarInterface> {
    const tempBars: Array<ContainerBarInterface> = []

    barKeys.forEach((barKey) => {
      const bar = this.findBar(barKey, barType)
      bar && tempBars.push(bar)
    })

    return tempBars
  }
}

export class Items<T extends ContainerBarItem = ContainerBarItem> implements ItemsInterface<T> {
  get items() {
    return this._items
  }

  private _items: Array<T> = []

  addItem(item: T): Key {
    this.items.push(item)
    return item.key
  }
  delItem(itemKey: Key): void {
    const index = this.items.findIndex((item) => item.key === itemKey)
    if (index > -1) this.items.splice(index, 1)
  }
  getItem(itemKey: Key): T | undefined {
    return this.items.find((item) => item.key === itemKey)
  }
}

export abstract class ContainerBar<
    T extends Container = Container,
    U extends ContainerBarItem = ContainerBarItem
  >
  extends Items<U>
  implements ContainerBarInterface<T, U>
{
  readonly key: Key

  opened = false
  private _context: Nullable<T> = undefined

  bindContext(context: T) {
    this._context = context
  }

  getContext(): Nullable<T> {
    return this._context
  }

  constructor(key: Key) {
    super()
    this.key = key
  }

  collapse(): void {
    this.opened = false
  }
  open(): void {
    this.opened = true
  }
  abstract inject(...args: any[]): void
}
