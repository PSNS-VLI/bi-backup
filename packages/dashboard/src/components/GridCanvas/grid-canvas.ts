import { betweenMinAndMax, isNumber, setCssUnit } from '../../utils'
import { ComponentID } from '../../constants/canvas'
import {
  CanvasEditingElementMethod,
  GridCanvasElementCoordinateType
  // CanvasEditingElementIntention
} from '../../types/canvas'
import type { Nullable } from '../../types/common'

import type {
  CanvasGridConfig,
  GridCanvasConfigInterface,
  GridCanvasElementInterface,
  GridCanvasInterface,
  CanvasElementSize,
  CanvasElementOffsetSize,
  SizeConvertor,
  LimitConvertor,
  CanvasElementSizeLimit,
  CanvasComponent,
  CanvasElementStyle
} from '../../types/canvas'

import { Canvas, CanvasConfig, CanvasElement } from '../Canvas'

/**
 * Implementation class for the grid canvas config.
 */
export class GridCanvasConfig extends CanvasConfig implements GridCanvasConfigInterface {
  grid = {
    colNum: 12,
    colGap: 8,
    unitHeight: 8,
    rowGap: 8
  }
}

/**
 * Implementation class for the grid canvas element.
 *
 * Compared to the super, it overrides the
 * style retrieval method and adds some specfic
 * features for grid canvas.
 */
export class GridCanvasElement<T extends CanvasComponent = CanvasComponent>
  extends CanvasElement<T>
  implements GridCanvasElementInterface<T>
{
  // Reference value used to initialize the element size.
  readonly standardMaxWidth = 12

  // The size of the grid coordinate when the element is initialized.
  private _initialSize: CanvasElementSize & CanvasElementSizeLimit
  get initialSize() {
    return this._initialSize
  }

  // Indicating which coordinate system the current
  // element size value represents.
  private _coordinateType: GridCanvasElementCoordinateType
  private _coordinateMaxWidth: number
  get coordinateType() {
    return this._coordinateType
  }
  protected set coordinateType(val) {
    this._coordinateType = val
  }
  get coordinateMaxWidth() {
    return this._coordinateMaxWidth
  }
  protected set coordinateMaxWidth(val) {
    this._coordinateMaxWidth = val
  }

  constructor(
    id: string,
    style: Partial<CanvasElementStyle> = {},
    coordinateMaxWidth: number = 12,
    coordinateType: GridCanvasElementCoordinateType = GridCanvasElementCoordinateType.GRID
  ) {
    style = Object.assign(
      {},
      {
        width: 2,
        height: 16,
        top: 1,
        left: 1,
        minWidth: 2,
        minHeight: 16,
        maxWidth: coordinateMaxWidth,
        maxHeight: Infinity
      },
      style
    )
    super(id, style)

    this._coordinateType = coordinateType
    this._coordinateMaxWidth = coordinateMaxWidth
    // Storing the initial value.
    this._initialSize = Object.assign({}, this.getSize(), this.getLimit())
  }

  /**
   * Obtaining the corrdinate type of the current element.
   */
  getCoordinateType(): GridCanvasElementCoordinateType {
    return this.coordinateType
  }

  getCoordinateMaxWidth(): number {
    return this.coordinateMaxWidth
  }

  protected coordianteTransformer(
    canvasWidth: number,
    canvasColNum: number,
    canvasColGap: number
  ): (initSize: number) => number {
    return (initSize: number) =>
      Math.floor(
        (canvasColNum * (initSize * canvasWidth + this.standardMaxWidth * canvasColGap)) /
          (this.standardMaxWidth * (canvasWidth + canvasColGap))
      )
  }

  transformCoordiante(canvasWidth: number, gridConfig: CanvasGridConfig): void {
    const { width: initWidth, left: initLeft, minWidth: initMinWidth } = this.initialSize
    const { colNum, colGap } = gridConfig

    const reseter = this.coordianteTransformer(canvasWidth, colNum, colGap)

    const width = reseter(initWidth)
    // TODO This value should be determined by the layout system.
    const left = reseter(initLeft)

    const minWidth = reseter(initMinWidth)

    this.coordinateMaxWidth = colNum
    this.reset(
      (size) => {
        return {
          ...size,
          width,
          left
        }
      },
      (limit) => {
        return {
          ...limit,
          maxWidth: colNum,
          minWidth
        }
      }
    )
  }

  /**
   * Converting pixel size values to grid size.
   */
  switchGird(sizeConvertor: SizeConvertor, limitConvertor: LimitConvertor): void {
    if (this.coordinateType !== GridCanvasElementCoordinateType.GRID) {
      this.reset(sizeConvertor, limitConvertor)
      this.coordinateType = GridCanvasElementCoordinateType.GRID
    }
  }

  /**
   * Converting grid size to pixel size.
   */
  switchPixel(sizeConvertor: SizeConvertor, limitConvertor: LimitConvertor): void {
    if (this.coordinateType !== GridCanvasElementCoordinateType.PIXEL) {
      this.reset(sizeConvertor, limitConvertor)
      this.coordinateType = GridCanvasElementCoordinateType.PIXEL
    }
  }

  /**
   * Adding styles for when the elements is in grid coordinates.
   */
  override getStyle(): Record<string, any> {
    if (this.coordinateType === GridCanvasElementCoordinateType.GRID) {
      return {
        position: 'relative',
        // [bug] element couldn't draged.
        // zIndex: this.zIndex,
        gridArea: `${this.top} / ${this.left} / span ${this.height} / span ${this.width}`,
        willChange: 'grid-area'
      }
    }
    return super.getStyle()
  }
}

/**
 * Implementation class for the ferryman element.
 *
 * The ferryman element serves as a navigator during the
 * element dragging process, defining a set of special
 * states and actions on top of the parent class.
 */
export class GridCanvasFerryman extends GridCanvasElement {
  readonly isFerryman = true

  constructor(
    style: Partial<CanvasElementStyle>,
    coordinateMaxWidth?: number,
    coordinateType?: GridCanvasElementCoordinateType
  ) {
    super(ComponentID.INTERNAL_FERRYMAN, style, coordinateMaxWidth, coordinateType)
  }

  override getStyle(): Record<string, any> {
    // The Ferryman element's style shoule be distinct
    // from regular elements.
    return {
      ...super.getStyle(),
      backgroundColor: 'rgba(0, 0, 0, 0.04)'
    }
  }

  /**
   * It is used to quickly generate ferryman elements from
   * another grid canvas element.
   */
  static copy(element: GridCanvasElementInterface): GridCanvasFerryman {
    return new GridCanvasFerryman(
      { ...element.getSize(), ...element.getLimit() },
      element.coordinateMaxWidth,
      element.coordinateType
    )
  }
}

/**
 * Implementation class for the grid canvas.
 *
 * The grid canvas, compared to a regular canvas, enhances the
 * ability to manage grid system coordinates, thus adding numerous
 * method for arranging canvas element.
 */
export class GridCanvas<T extends GridCanvasElementInterface = GridCanvasElement>
  extends Canvas<T>
  implements GridCanvasInterface<T>
{
  /**
   * Used to identify this canvas as a grid canvas.
   */
  readonly isGrid = true
  readonly canvasConfig: GridCanvasConfigInterface = new GridCanvasConfig()

  /**
   * Whether to display the grid columns of the canvas.
   */
  showGrid = false

  /**
   * Used to identify the only possible existence of a ferryman element.
   */
  protected ferrymanKey: string = ''

  constructor() {
    super()
    this.canvasConfig.grid = {
      colNum: 12,
      colGap: 8,
      unitHeight: 8,
      rowGap: 8
    }
  }

  configGrid(girdConfig: Partial<CanvasGridConfig>) {
    const oColNum = this.canvasConfig.grid.colNum
    const nColNum = girdConfig.colNum

    Object.assign(this.canvasConfig.grid, girdConfig)
    if (isNumber(nColNum) && nColNum !== oColNum) {
      this.elements.forEach((el) => this.transformElement(el))
    }
  }

  // [override]
  override getStyle(): Record<string, any> {
    const { rowGap, colGap, colNum, unitHeight } = this.canvasConfig.grid

    // Add styles specific to the grid canvas.
    return {
      ...super.getStyle(),
      display: 'grid',
      height: 'auto',
      paddingBottom: setCssUnit(300),
      rowGap: setCssUnit(rowGap),
      columnGap: setCssUnit(colGap),
      gridTemplateColumns: `repeat(${colNum},1fr)`,
      gridAutoRows: `${setCssUnit(unitHeight)}`
    }
  }

  // [override] element
  override addElement(element: T): string {
    this.transformElement(element)

    return super.addElement(element)
  }

  override getElementStyle(elKey: string): Record<string, any> {
    const style = super.getElementStyle(elKey)

    // Applying transparency effect to the resized elements.
    if (this.isEditing && elKey === this.editingElementKey) {
      return {
        ...style,
        opacity: '0.5'
      }
    }

    return style
  }

  // [override] drag and drop
  override onDragElementStart(
    event: DragEvent,
    method: CanvasEditingElementMethod = CanvasEditingElementMethod.RESIZE,
    elKey?: string
  ): void {
    super.onDragElementStart(event, method, elKey)

    this.summonFerryman()
    if (method === CanvasEditingElementMethod.RESIZE) {
      this.showGrid = true
    }
  }

  // override onDragElement(
  //   event: DragEvent,
  //   intention: CanvasEditingElementIntention = CanvasEditingElementIntention.HORIZONTAL_POS
  // ) {
  //   super.onDragElement(event, intention)
  // }

  override onDragElementEnd(event: DragEvent, elKey?: string | undefined): void {
    this.dismissFerryman()
    this.showGrid = false
    super.onDragElementEnd(event, elKey)
  }

  // [override] protected
  protected override convertComponentToElement(component: CanvasComponent): T {
    const { minWidth = 2, minHeight = 16, maxWidth, maxHeight } = component.__sizeLimit || {}
    const element = new GridCanvasElement(component.id, {
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

  protected override updateElement(element: T, patch: Partial<CanvasElementOffsetSize>) {
    // Operations related to grid coordinates.
    this.dispatchFerryman(this.offsetGridByPixel(patch))

    super.updateElement(element, patch)
  }

  protected override exportElement(element: T): Record<string, any> {
    const elementData = super.exportElement(element)

    Object.assign(elementData, {
      coordinateMaxWidth: element.coordinateMaxWidth,
      coordinateType: element.coordinateType
    })

    return elementData
  }

  protected override getElementInstanceByElementData(
    elementData: Record<string, any>
  ): Nullable<T> {
    const { id, style, coordinateMaxWidth, coordinateType } = elementData || {}

    if (id) {
      return new GridCanvasElement(id, style, coordinateMaxWidth, coordinateType) as unknown as T
    }
  }

  // [protected]
  /**
   * Assisting elements to maintain consistent width
   * representation across a canvas with varying grid
   * quantities.
   */
  protected transformElement(element: T): void {
    const gridConfig = this.canvasConfig.grid

    if (element.coordinateMaxWidth === gridConfig.colNum) return

    this.getContainer(({ offsetWidth: canvasWidth }) => {
      element.transformCoordiante(canvasWidth, gridConfig)
    })
  }

  // [protected] ferryman
  /**
   * Converting grid coordinates to pixel coordinates.
   */
  protected gridToPixel(grid: CanvasElementSize): CanvasElementSize {
    let size: CanvasElementSize = {
      width: 0,
      height: 0,
      top: 0,
      left: 0
    }

    this.getContainer(({ offsetWidth: canvasWidth }) => {
      const { colNum, colGap, rowGap, unitHeight } = this.canvasConfig.grid
      const colWidth = (canvasWidth - colGap * (colNum - 1)) / colNum

      const { width, height, top, left } = grid

      size = {
        width: width * colWidth + (width - 1) * colGap,
        height: height * unitHeight + (height - 1) * rowGap,
        // Taking into account the presence of gaps around elements.
        top: (top - 1) * unitHeight + top * rowGap,
        left: (left - 1) * colWidth + (left - 1) * colGap
      }
    })

    return size
  }

  protected getElementsAround(
    element: T | CanvasElementSize,
    condition: (condition: {
      onTheTop: boolean
      onTheBottom: boolean
      onTheLeft: boolean
      onTheRight: boolean
    }) => boolean,
    discards: Array<string> = []
  ): Array<T> {
    // The canvas elements after removing unnecessary elements.
    const elements = this.elements.filter((el) => !discards.includes(el.key))

    const placeholder = (element as T).getSize()
      ? (element as T).getSize()
      : (element as CanvasElementSize)

    // The elements around the element.
    return elements.filter((el) => {
      const { top, left, width, height } = el.getSize()

      const onTheLeft = left + width <= placeholder.left
      const onTheRight = left >= placeholder.left + placeholder.width
      const onTheTop = top + height <= placeholder.top
      const onTheBottom = top >= placeholder.top + placeholder.height

      return condition({ onTheTop, onTheBottom, onTheLeft, onTheRight })
    })
  }

  protected getOptimalTop(element: T, discards: Array<string> = []): number {
    return this.getElementsAround(
      element,
      ({ onTheTop, onTheLeft, onTheRight }) => onTheTop && !(onTheLeft || onTheRight),
      discards
    ).reduce((res, el) => {
      if (el.getSize().top > res) return el.getSize().top
      return res
    }, 1)
  }

  protected choreographyElements(
    elements: Array<T>,
    patch: Partial<CanvasElementOffsetSize>,
    discards: Array<string>
  ) {
    const { offsetTop = 0, offsetLeft = 0, offsetWidth = 0, offsetHeight = 0 } = patch

    discards.concat(elements.map((el) => el.key))

    const bottoms: Array<T> = []

    elements.forEach((element) => {
      const arounds = this.getElementsAround(
        element,
        ({ onTheBottom, onTheLeft, onTheRight }) => onTheBottom && !(onTheLeft || onTheRight)
      )
      arounds.forEach((around) => {
        bottoms.push(around)
        discards.push(around.key)
      })
    })

    this.choreographyElements(bottoms, patch, discards)

    elements.forEach((element) => {
      element.resize(offsetWidth, offsetHeight)
      element.offset(offsetTop, offsetLeft)
    })
  }

  protected updateCoordinate(
    entryElement: T,
    patch: Partial<CanvasElementOffsetSize>,
    discards: Array<string> = []
  ) {
    // The starting element should be excluded from the traversed list.
    // Remove unnecessary elements from the traversal list to improve performance.
    !discards.includes(entryElement.key) && discards.push(entryElement.key)

    const { offsetTop = 0, offsetLeft = 0, offsetWidth = 0, offsetHeight = 0 } = patch

    // Capture a snapshot of the size information of the
    // entrance element before its size changes.
    const { top: oTop, left: oLeft, width: oWidth, height: oHeight } = entryElement.getKeyframe()

    // The position of the entrance element after its changes.
    const placeholder = {
      top: oTop + offsetTop,
      left: oLeft + offsetLeft,
      width: oWidth + offsetWidth,
      height: oHeight + offsetHeight
    }

    // The elements overlapping with the moved element.
    const overlaps = this.getElementsAround(
      placeholder,
      ({ onTheTop, onTheBottom, onTheLeft, onTheRight }) =>
        !(onTheTop || onTheBottom || onTheLeft || onTheRight),
      discards
    )

    if (overlaps.length) {
      // Find the elements with the maximum degree of overlap
      // among the overlapping element.
      const targetElements = overlaps
        .filter((el) => {
          // Threshold.
          return Math.abs(placeholder.top - el.getSize().top) <= 6
        })
        .reduce((res: Array<T>, next) => {
          const previousTop = res.length ? res[0].getSize().top : Infinity
          const nextTop = next.getSize().top
          if (nextTop < previousTop) {
            return [next]
          } else if (nextTop === previousTop) {
            res.push(next)
          }
          return res
        }, [])

      // Start moving elements.
      if (targetElements.length) {
        // Preparing to occupy the position of the target elements.

        const optimalTop = this.getOptimalTop(
          entryElement,
          discards.concat(targetElements.map((el) => el.key))
        )

        // Step 1: Find the elements below the target elements and
        // recursively increase their distance from the top of the
        // canvas.
        this.choreographyElements(targetElements, { offsetTop: placeholder.height }, discards)
      }
    }

    // Adjustment the entry element.
    entryElement.resize(offsetWidth, offsetHeight)
    entryElement.offset(offsetTop, offsetLeft)
  }

  protected genGridOffsetByPixel(
    pxielOffset: number,
    refValue: number,
    gap: number = 0,
    rate: number = 0.5
  ): number {
    const threshold = refValue * rate

    if (pxielOffset === 0) return pxielOffset

    // TODO 算法有小问题
    const offset =
      (pxielOffset / Math.abs(pxielOffset)) *
      Math.floor((Math.abs(pxielOffset) + threshold) / (2 * threshold + gap))

    return offset
  }

  /**
   * Determining grid coordinates based on pixel
   * coordinates and canvas properties.
   */
  protected offsetGridByPixel(pixel: Partial<CanvasElementOffsetSize>): CanvasElementOffsetSize {
    let gridOffset: CanvasElementOffsetSize = {
      offsetWidth: 0,
      offsetHeight: 0,
      offsetTop: 0,
      offsetLeft: 0
    }

    this.getContainer(({ offsetWidth: canvasWidth }) => {
      // ferryman already have keyframe
      // const { width, height, top, left } = grid

      // pixel coordinates.
      const { offsetWidth = 0, offsetHeight = 0, offsetTop = 0, offsetLeft = 0 } = pixel
      // gird canvas properties.
      const { colNum, colGap, rowGap, unitHeight } = this.canvasConfig.grid
      const colWidth = (canvasWidth - colGap * (colNum - 1)) / colNum

      gridOffset = {
        offsetWidth: this.genGridOffsetByPixel(offsetWidth, colWidth, colGap),
        offsetHeight: this.genGridOffsetByPixel(offsetHeight, unitHeight, rowGap),
        offsetTop: this.genGridOffsetByPixel(offsetTop, unitHeight, rowGap),
        offsetLeft: this.genGridOffsetByPixel(offsetLeft, colWidth, colGap)
      }
    })

    return gridOffset
  }

  protected summonFerryman(): void {
    this.getEditingElement((el) => {
      const ferryman = GridCanvasFerryman.copy(el)
      ferryman.setKeyframe()
      this.ferrymanKey = this.addElement(ferryman as any)

      // Operations related to pixel coordinates.
      // Converting grid to pixel.
      el.switchPixel(this.gridToPixel.bind(this), () => ({
        minWidth: 0,
        minHeight: 0,
        maxWidth: Infinity,
        maxHeight: Infinity
      }))
    })
  }

  protected dispatchFerryman(patch: Partial<CanvasElementOffsetSize>): void {
    if (!(patch.offsetTop || patch.offsetLeft || patch.offsetWidth || patch.offsetHeight)) return

    this.getElement(this.ferrymanKey, (ferryman) => {
      const { offsetWidth = 0, offsetHeight = 0, offsetTop = 0, offsetLeft = 0 } = patch
      const { colNum } = this.canvasConfig.grid
      const { left: kLeft, top: kTop } = ferryman.getKeyframe()
      const { width } = ferryman.getSize()

      const minOffsetTop = 1 - kTop
      const maxOffsetLeft = colNum - width - kLeft + 1
      const minOffsetLeft = 1 - kLeft
      const offsetLeftLimit = betweenMinAndMax(offsetLeft, minOffsetLeft, maxOffsetLeft)
      const offsetTopLimit = betweenMinAndMax(offsetTop, minOffsetTop)

      // this.updateCoordinate(
      //   ferryman,
      //   { offsetWidth, offsetHeight, offsetTop: offsetTopLimit, offsetLeft: offsetLeftLimit },
      //   [this.editingElementKey]
      // )

      ferryman.resize(offsetWidth, offsetHeight)
      ferryman.offset(offsetTopLimit, offsetLeftLimit)
    })
  }

  protected dismissFerryman(): void {
    this.getEditingElement((el) => {
      this.getElement(this.ferrymanKey, (ferryman) => {
        el.switchGird(
          () => ferryman.getSize(),
          () => ferryman.getLimit()
        )
      })
    })
    this.removeElement(this.ferrymanKey)
    this.ferrymanKey = ''
  }
}
