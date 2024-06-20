import { betweenMinAndMax, getUniKey, setCssUnit, isNumber } from '../../utils'
import { CanvasEditingElementMethod, CanvasEditingElementIntention } from '../../types/canvas'

import type { Key, Nullable } from '../../types/common'
import type {
  CanvasInterface,
  CanvasElementInterface,
  CanvasElementSize,
  CanvasElementOffsetSize,
  SizeConvertor,
  CanvasElementSizeLimit,
  LimitConvertor,
  CanvasElementStyle,
  CanvasComponent,
  CanvasResizerInterface,
  CanvasResizerSize,
  CanvasConfigInterface
} from '../../types/canvas'

export class CanvasConfig implements CanvasConfigInterface {
  page = {
    style: {
      width: '100%',
      height: '100%'
      // paddingTop: 10,
      // paddingRight: 12,
      // paddingBottom: 10,
      // paddingLeft: 12
    }
  }
}

export class CanvasResizer implements CanvasResizerInterface {
  style: CanvasResizerSize = {
    width: 0,
    height: 0,
    top: 0,
    left: 0
  }

  constructor(width = 0, height = 0, top = 0, left = 0) {
    this.style = {
      top,
      left,
      width,
      height
    }
  }

  update(patch: Partial<CanvasResizerSize>) {
    const { width: oW, height: oH, top: oT, left: oL } = this.style
    const { width = oW, height = oH, top = oT, left = oL } = patch

    this.style = {
      width,
      height,
      top,
      left
    }
  }

  getStyle() {
    return Object.keys(this.style).reduce((res: Record<string, string>, key) => {
      res[key] = setCssUnit(this.style[key])
      return res
    }, {})
  }
}

export class CanvasElement<T extends CanvasComponent = CanvasComponent>
  implements CanvasElementInterface<T>
{
  store: Record<string, any> = {}
  source: T | undefined

  focused: boolean = false

  readonly key = getUniKey()

  get width() {
    return this._width
  }
  protected set width(val) {
    this._width = val
  }
  get height() {
    return this._height
  }
  protected set height(val) {
    this._height = val
  }
  get top() {
    return this._top
  }
  protected set top(val) {
    this._top = val
  }
  get left() {
    return this._left
  }
  protected set left(val) {
    this._left = val
  }
  get minWidth() {
    return this._minWidth
  }
  protected set minWidth(val) {
    this._minWidth = val
  }
  get minHeight() {
    return this._minHeight
  }
  protected set minHeight(val) {
    this._minHeight = val
  }
  get maxWidth() {
    return this._maxWidth
  }
  protected set maxWidth(val) {
    this._maxWidth = val
  }
  get maxHeight() {
    return this._maxHeight
  }
  protected set maxHeight(val) {
    this._maxHeight = val
  }
  get zIndex() {
    return this._zIndex
  }
  protected set zIndex(val) {
    this._zIndex = val
  }

  private _width: number = 0
  private _height: number = 0
  private _top: number = 0
  private _left: number = 0
  private _zIndex: number = 0
  private _minWidth: number = 0
  private _minHeight: number = 0
  private _maxWidth?: number = 0
  private _maxHeight?: number = 0

  protected hasKeyframe: boolean = false
  protected keyframe: CanvasElementSize = {
    width: 0,
    height: 0,
    top: 0,
    left: 0
  }

  constructor(
    readonly id: string,
    style: Partial<CanvasElementStyle> = {}
  ) {
    const {
      width = 100,
      height = 100,
      top = 0,
      left = 0,
      minWidth = 0,
      minHeight = 0,
      zIndex = 1
    } = style
    let { maxWidth, maxHeight } = style

    this.minWidth = minWidth
    this.minHeight = minHeight

    if (isNumber(maxWidth) && minWidth >= maxWidth) {
      maxWidth = minWidth
    }
    if (isNumber(maxHeight) && minHeight >= maxHeight) {
      maxHeight = minHeight
    }

    this.maxWidth = maxWidth
    this.maxHeight = maxHeight

    this.width = betweenMinAndMax(width, minWidth, maxWidth)
    this.height = betweenMinAndMax(height, minHeight, maxHeight)
    this.top = top
    this.left = left
    this.zIndex = zIndex
  }

  getKeyframe(): CanvasElementSize {
    return this.keyframe
  }

  setKeyframe() {
    this.hasKeyframe = true
    this.keyframe = this.getSize()
  }

  clearKeyframe() {
    this.hasKeyframe = false
    this.keyframe = {
      width: 0,
      height: 0,
      top: 0,
      left: 0
    }
  }

  resize(width: number, height: number) {
    if (this.hasKeyframe) {
      width += this.keyframe.width
      height += this.keyframe.height
    }

    this.width = betweenMinAndMax(width, this.minWidth, this.maxWidth)
    this.height = betweenMinAndMax(height, this.minHeight, this.maxHeight)
  }

  offset(top: number, left: number) {
    if (this.hasKeyframe) {
      top += this.keyframe.top
      left += this.keyframe.left
    }

    this.top = top
    this.left = left
  }

  limit(limit: Partial<CanvasElementSizeLimit>) {
    this.minWidth = limit.minWidth ?? this.minWidth
    this.minHeight = limit.minHeight ?? this.minHeight
    this.maxWidth = limit.maxWidth ?? this.maxWidth
    this.maxHeight = limit.maxHeight ?? this.maxHeight

    const hasKeyframe = this.hasKeyframe
    this.clearKeyframe()
    this.resize(this.width, this.height)
    hasKeyframe && this.setKeyframe()
  }

  layer(zIndex: number) {
    this.zIndex = zIndex
  }

  reset(sizeConvertor: SizeConvertor, limitConvertor?: LimitConvertor): void {
    const limit = limitConvertor ? limitConvertor(this.getLimit()) : this.getLimit()
    const size = sizeConvertor(this.getSize())

    const hasKeyframe = this.hasKeyframe

    this.clearKeyframe()
    this.limit(limit)
    this.resize(size.width, size.height)
    this.offset(size.top, size.left)

    hasKeyframe && this.setKeyframe()
  }

  getSize(): CanvasElementSize {
    return {
      width: this.width,
      height: this.height,
      top: this.top,
      left: this.left
    }
  }

  getLimit(): CanvasElementSizeLimit {
    return {
      minWidth: this.minWidth,
      minHeight: this.minHeight,
      maxWidth: this.maxWidth,
      maxHeight: this.maxHeight
    }
  }

  getStyle(): Record<string, string | number> {
    return {
      position: 'absolute',
      width: setCssUnit(this.width),
      height: setCssUnit(this.height),
      minWidth: setCssUnit(this.minWidth),
      minHeight: setCssUnit(this.minHeight),
      left: setCssUnit(this.left),
      top: setCssUnit(this.top),
      zIndex: this.zIndex
    }
  }
}

export function IfUnlock(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value

  descriptor.value = function (...args: any[]) {
    if ((this as any).isLocked) return

    return originalMethod.apply(this, args)
  }

  return descriptor
}

export class Canvas<T extends CanvasElementInterface<CanvasComponent>>
  implements CanvasInterface<T>
{
  get isLocked(): boolean {
    return this._isLocked
  }
  protected set isLocked(val) {
    if (val) {
      this.focusedElementKey = ''
    }
    this._isLocked = val
  }
  get isDragable(): boolean {
    if (!this.isLocked && this.getContainer()) return true
    return false
  }
  get isReceiving(): boolean {
    return this._isReceiving
  }
  protected set isReceiving(val) {
    this._isReceiving = val
  }
  get isLoading(): boolean {
    return this._isLoading
  }
  protected set isLoading(val) {
    this._isLoading = val
  }
  get isEditing(): boolean {
    return this._isEditing
  }
  protected set isEditing(val) {
    this._isEditing = val
  }
  get isDraging(): boolean {
    return this._isDraging
  }
  protected set isDraging(val) {
    this._isDraging = val
  }

  readonly canvasConfig: CanvasConfigInterface = new CanvasConfig()
  readonly resizer = new CanvasResizer()
  readonly elements: Array<T> = []

  private _isLocked = false
  private _isLoading = false
  private _isReceiving = false
  private _isEditing = false
  private _isDraging = false
  private _focusedElementKey = ''

  protected preselectedElementKey = ''
  protected editingElementKey = ''
  protected editingElementMethod: CanvasEditingElementMethod = CanvasEditingElementMethod.DRAG
  protected get focusedElementKey() {
    return this._focusedElementKey
  }
  protected set focusedElementKey(elKey: string) {
    this._focusedElementKey = ''

    this.elements.forEach((element) => {
      if (element.key === elKey) {
        element.focused = true
        this._focusedElementKey = elKey
      } else if (element.focused) {
        element.focused = false
      }
    })
  }

  protected container: symbol | undefined = undefined
  protected temp: Record<Key, any> = {}

  // canvas lifecycle
  bindContainer(container: HTMLElement) {
    this.setContainer(container)
    container.addEventListener('mousedown', this.onContainerMouseDown.bind(this))
    container.addEventListener('click', this.onClickContainer.bind(this))
  }

  getContainer(callback?: (container: HTMLElement) => void): HTMLElement | undefined {
    if (this.container) {
      const container = this.global()[this.container]

      if (callback && container) callback(container)

      return container
    }
    return
  }

  lock() {
    this.isLocked = true
  }

  unlock() {
    this.isLocked = false
  }

  recycle() {
    if (this.container) {
      this.getContainer((contaienr) => {
        contaienr.removeEventListener('mousedown', this.onContainerMouseDown)
        contaienr.removeEventListener('click', this.onClickContainer)
      })
      delete this.global()[this.container]
    }
    this.clearTemp()
  }

  getStyle() {
    const pageStyle = this.canvasConfig.page.style

    return Object.keys(pageStyle).reduce((style: Record<string, any>, key) => {
      style[key] = setCssUnit(pageStyle[key])

      return style
    }, {})
  }

  exportCanvas() {
    return {
      cavnasConfig: this.canvasConfig,
      elements: this.elements.map((element) => this.exportElement(element))
    }
  }

  async importCanvas(
    canvasData: Record<string, any>,
    options: {
      clearElements?: boolean
    } = {}
  ) {
    const { clearElements = false } = options

    this.isLoading = true

    if (clearElements) {
      while (this.elements.length) {
        this.elements.pop()
      }
    }

    if (!this.elements.length) {
      const { canvasConfig, elements = [] } = canvasData

      Object.assign(this.canvasConfig, canvasConfig)
      await Promise.all(
        elements.map(async (elementData: any) => {
          const element = await this.importElement(elementData)
          if (element) {
            this.afterLoadElement(element)
          }
        })
      )
    }

    this.isLoading = false
  }

  // element operations
  addElement(element: T): string {
    this.elements.push(element)
    return element.key
  }

  removeElement(elKey: string): T | undefined {
    if (!elKey) return
    const index = this.findElement(elKey)
    if (index >= 0) {
      return this.elements.splice(index, 1)[0]
    }
  }

  getElement(elKey: string, callback?: (element: T) => void) {
    const el = this.elements.find((item) => item.key === elKey)

    if (callback && el) callback(el)

    return el
  }

  getEditingElement(callback?: (element: T) => void) {
    if (this.editingElementKey) {
      const element = this.getElement(this.editingElementKey, (el) => {
        callback && callback(el)
      })

      return element
    }
  }

  findElement(elKey: string) {
    return this.elements.findIndex((item) => item.key === elKey)
  }

  getElementStyle(elKey: string): Record<string, string | number> {
    let style = {}

    this.getElement(elKey, (el) => {
      style = el.getStyle()
    })

    if (this.isDragingMe(elKey)) {
      style = {
        ...style,
        display: 'none'
      }
    }

    return style
  }

  // drag ang drop
  prepareForReceivingComponent(component: CanvasComponent): void {
    this.isReceiving = true
    this.setTemp(this.receivedComponent, component)
  }

  cancelReceivingComponent(): void {
    this.isReceiving = false
    this.clearTemp(this.receivedComponent)
  }

  onDragElementEnter(event: DragEvent): void {
    this.setInitMousePos(event.clientX, event.clientY)

    const component: CanvasComponent = this.getTemp(this.receivedComponent)
    const element = this.convertComponentToElement(component)
    const elementKey = this.addElement(element)
    this.setTemp(this.receivedComponentKey, elementKey)

    this.onDragElementStart(event, CanvasEditingElementMethod.DRAG, elementKey)
  }

  onDragElementOver(event: DragEvent): void {
    this.isEditing = true
    this.onDragElement(event)
  }

  onDragElementDrop(event: DragEvent): void {
    this.isReceiving = false
    this.focusedElementKey = this.getTemp(this.receivedComponentKey)
    this.clearTemp(this.receivedComponent)
    this.onDragElementEnd(event)
  }

  onDragElementLeave(event: DragEvent): void {
    this.removeElement(this.getTemp(this.receivedComponentKey))
    this.onDragElementEnd(event)
  }

  // drag elements within the canvas.
  isEditingMe(elKey: string) {
    return this.isEditing && this.editingElementKey === elKey
  }

  isDragingMe(elKey: string) {
    return this.isEditingMe(elKey) && this.editingElementMethod === CanvasEditingElementMethod.DRAG
  }

  onMouseEnterElement(event: MouseEvent, elKey: string) {
    this.preselectedElementKey = elKey
    const target = event.target as HTMLElement
    if (target) {
      this.resizer.update({
        width: target.offsetWidth,
        height: target.offsetHeight,
        top: target.offsetTop,
        left: target.offsetLeft
      })
    }
  }

  onDragElementStart(
    event: DragEvent,
    method: CanvasEditingElementMethod = CanvasEditingElementMethod.RESIZE,
    elKey: string = ''
  ) {
    this.setEditingElement(elKey, (editingElement) => {
      editingElement.setKeyframe()
    })

    this.editingElementMethod = method
  }

  onDragElement(
    event: DragEvent,
    intention: CanvasEditingElementIntention = CanvasEditingElementIntention.BOTH_POS
  ) {
    if (!this.isDragable) return

    this.isEditing = true

    const { offsetX, offsetY } = event
    const temp = this.getTemp('dragOffset')
    if (offsetX !== temp?.x || offsetY !== temp?.y) {
      this.isDraging = true
      this.setTemp('dragOffset', {
        x: offsetX,
        y: offsetY
      })
      this.editElement(event, intention)
    } else {
      this.isDraging = false
    }
  }

  onDragElementEnd(event: DragEvent, elKey?: string) {
    this.isEditing = false
    this.clearEditingElement()
    this.clearInitMousePos()
    this.clearTemp('dragOffset')
  }

  onClickElement(event: MouseEvent, elKey: string): void {
    if (!this.isLocked) {
      this.focusedElementKey = elKey
    }
    event.stopPropagation()
  }

  onMouseLeaveElement(event: MouseEvent, elKey: string) {
    // error!!!
    // this.clearInitMousePos()
  }

  // helpers
  // [private]
  private global() {
    return (globalThis || window) as any
  }

  // [protected]
  // [protected] Canvas container(DOM instance)
  protected setContainer(container: HTMLElement) {
    const key = Symbol('gxhs_bi_canvasContainer')

    this.global()[key] = container
    this.container = key
  }

  protected clearContainer() {
    if (this.container) {
      this.global()[this.container] = null
      this.container = undefined
    }
  }

  protected onContainerMouseDown(event: MouseEvent) {
    this.setInitMousePos(event.clientX, event.clientY)
  }
  @IfUnlock
  protected onClickContainer(event: MouseEvent) {
    if (!this.isLocked) {
      this.focusedElementKey = ''
    }
  }

  // [protected] Canvas temporary variables.
  protected setTemp(key: Key, value: any) {
    this.temp[key] = value
  }

  protected clearTemp(key?: Key) {
    if (key) {
      this.temp[key] = undefined
    } else {
      this.temp = {}
    }
  }

  protected getTemp<V extends any = any>(key: Key): V {
    return this.temp[key] as V
  }

  protected initMousePosKey: symbol = Symbol('initMousePos')
  protected receivedComponent: symbol = Symbol('the component to be received')
  protected receivedComponentKey: symbol = Symbol('the key of the component to be received')

  protected setInitMousePos(x: number, y: number) {
    this.setTemp(this.initMousePosKey, { x, y })
  }

  protected clearInitMousePos() {
    this.clearTemp(this.initMousePosKey)
  }

  protected getInitMousePos(): { x: number; y: number } {
    return Object.assign({ x: 0, y: 0 }, this.getTemp(this.initMousePosKey))
  }

  protected exportElementSource(source: CanvasComponent): Record<string, any> {
    let sourceKeys: Array<string> = []

    if (source.__excludeKeys?.length) {
      sourceKeys = Object.keys(source).filter((key) => !source.__excludeKeys?.includes(key))
    } else if (source.__includeKeys?.length) {
      sourceKeys = source.__includeKeys
    }

    sourceKeys = sourceKeys.concat(['id', '__sizeLimit'])

    return sourceKeys.reduce((res: Record<string, any>, key) => {
      res[key] = source[key]

      return res
    }, {})
  }

  protected async importElementSource(
    sourceData: Record<string, any>
  ): Promise<Nullable<CanvasComponent>> {
    if (sourceData.id) {
      return {
        id: sourceData.id,
        ...sourceData
      }
    }
  }

  protected exportElement(element: T): Record<string, any> {
    const elementData = {
      id: element.id,
      style: {
        ...element.getSize(),
        ...element.getLimit(),
        zIndex: element.zIndex
      },
      store: element.store
    }

    if (element.source) {
      Object.assign(elementData, {
        source: this.exportElementSource(element.source)
      })
    }
    return elementData
  }

  protected getElementInstanceByElementData(elementData: Record<string, any>): Nullable<T> {
    const { id, style } = elementData || {}

    if (id) {
      return new CanvasElement(id, style) as unknown as T
    }
  }

  protected async importElement(elementData: Record<string, any>): Promise<Nullable<T>> {
    const { store, source } = elementData || {}

    const element = this.getElementInstanceByElementData(elementData)

    if (element) {
      if (store) {
        element.store = store
      }

      if (source) {
        const component = await this.importElementSource(source)
        if (component) {
          element.source = component
        }
      }
    }

    return element
  }

  protected afterLoadElement(element: T): void {
    this.addElement(element)
  }

  // [protected] Convert component.
  protected convertComponentToElement(component: CanvasComponent): T {
    const { minWidth = 2, minHeight = 10, maxWidth, maxHeight } = component.__style || {}
    const element = new CanvasElement(component.id, {
      width: minWidth,
      height: minHeight,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight
    })
    element.source = component
    return element as unknown as T
  }

  // [protected] Edit element
  protected setEditingElement(elKey: string, callback?: (element: T) => void) {
    this.editingElementKey = elKey || this.preselectedElementKey
    if (callback) {
      this.getEditingElement(callback)
    }
  }

  protected clearEditingElement(callback?: (element: T) => void) {
    if (callback) {
      this.getEditingElement(callback)
    }
    this.editingElementKey = ''
  }

  protected getOffset(event: DragEvent): { offsetX: number; offsetY: number } {
    const { clientX, clientY } = event
    const { x: initX, y: initY } = this.getInitMousePos()

    return {
      offsetX: clientX - initX,
      offsetY: clientY - initY
    }
  }

  protected updateElement(element: T, patch: Partial<CanvasElementOffsetSize>) {
    const { offsetWidth = 0, offsetHeight = 0, offsetTop = 0, offsetLeft = 0 } = patch

    element.resize(offsetWidth, offsetHeight)
    element.offset(offsetTop, offsetLeft)
  }

  protected editElement(event: DragEvent, direction: CanvasEditingElementIntention) {
    this.getEditingElement((el) => {
      const { offsetX, offsetY } = this.getOffset(event)

      switch (direction) {
        case CanvasEditingElementIntention.HORIZONTAL_SIZE:
          this.updateElement(el, { offsetWidth: offsetX })
          break
        case CanvasEditingElementIntention.HORIZONTAL_POS:
          this.updateElement(el, { offsetLeft: offsetX })
          break
        case CanvasEditingElementIntention.HORIZONTAL_SIZE_POS:
          this.updateElement(el, { offsetWidth: -offsetX, offsetLeft: offsetX })
          break
        case CanvasEditingElementIntention.VERTICAL_SIZE:
          this.updateElement(el, { offsetHeight: offsetY })
          break
        case CanvasEditingElementIntention.BOTH_SIZE:
          this.updateElement(el, { offsetWidth: offsetX, offsetHeight: offsetY })
          break
        case CanvasEditingElementIntention.BOTH_POS:
          this.updateElement(el, { offsetTop: offsetY, offsetLeft: offsetX })
          break
        case CanvasEditingElementIntention.BOTH_SIZE_HORIZONTAL_POS:
          this.updateElement(el, {
            offsetWidth: -offsetX,
            offsetHeight: offsetY,
            offsetLeft: offsetX
          })
          break
        default:
          break
      }
    })
  }
}
