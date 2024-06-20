/**
 * Defining the type of elements being edited on the canvas.
 */
export const enum CanvasEditingElementMethod {
  DRAG,
  RESIZE
}

/**
 * Defining the direction of the movement when elements being
 * edited on the canvas.
 */
export const enum CanvasEditingElementIntention {
  VERTICAL_SIZE,
  HORIZONTAL_SIZE,
  HORIZONTAL_POS,
  BOTH_POS,
  HORIZONTAL_SIZE_POS,
  BOTH_SIZE,
  BOTH_SIZE_HORIZONTAL_POS
}

export interface CanvasPageConfig {
  [key: string]: any
  style: Record<string, string | number>
}

/**
 * Cavnas configurations details.
 */
export interface CanvasConfigInterface {
  [key: string]: any
  page: CanvasPageConfig
}

/**
 * A tool that assists elements on the canvas
 * to change their dimensions.
 */
export interface CanvasResizerInterface {
  style: Record<string, any>

  update: (patch: Record<string, any>) => void
  getStyle: () => Record<string, string | number>
}

export interface CanvasResizerSize extends CanvasElementSize {
  [key: string]: any
}

/**
 * Attributes related to the size of canvas element.
 */
export interface CanvasElementSize {
  width: number
  height: number
  top: number
  left: number
}

/**
 * Attributes related to the position or offset of
 * canvas element.
 */
export interface CanvasElementOffsetSize {
  offsetWidth: number
  offsetHeight: number
  offsetTop: number
  offsetLeft: number
}

/**
 * Attributes related to the size limit of canvas
 * element.
 */
export interface CanvasElementSizeLimit {
  minWidth: number
  minHeight: number
  maxWidth?: number
  maxHeight?: number
}

export type SizeConvertor = (size: CanvasElementSize) => CanvasElementSize
export type LimitConvertor = (limit: CanvasElementSizeLimit) => CanvasElementSizeLimit
export type CanvasElementStyle = CanvasElementSize & CanvasElementSizeLimit & { zIndex: number }

/**
 * Define a common sturcture to decouple canvas element
 * loadable components from the canvas.
 */
export interface CanvasComponent {
  [key: string]: any
  id: string
  __includeKeys?: Array<string>
  __excludeKeys?: Array<string>
  __sizeLimit?: CanvasElementSizeLimit
}

/**
 * The element on the canvas.
 */
export interface CanvasElementInterface<T extends CanvasComponent = CanvasComponent> {
  /**
   * A data warehouse for components mounted to element.
   */
  store: Record<string, any>

  /**
   * Points to the component instance mounted to the element.
   */
  source: T | undefined

  // The state information of the element.
  /**
   * If the element is selected or not.
   */
  focused: boolean

  // Attributes of elements in the canvas.
  readonly id: string
  readonly key: string
  readonly width: number
  readonly height: number
  readonly top: number
  readonly left: number
  readonly minWidth: number
  readonly minHeight: number
  readonly maxWidth?: number
  readonly maxHeight?: number
  readonly zIndex: number

  // Keyframe is a snapshot of the size and position of an
  // element at the current moment in time.
  /**
   * Obtain element snapshot information.
   */
  getKeyframe: () => CanvasElementSize

  /**
   * Set element snapshot information.
   */
  setKeyframe: () => void

  /**
   * Clear element snapshot information.
   */
  clearKeyframe: () => void

  // Helps elements update their size, position, and so on.
  resize: (width: number, height: number) => void
  offset: (top: number, left: number) => void
  limit: (limit: Partial<CanvasElementSizeLimit>) => void
  layer: (zIndex: number) => void
  reset: (sizeConvertor: SizeConvertor, limitConvertor?: LimitConvertor) => void

  getSize: () => CanvasElementSize
  getLimit: () => CanvasElementSizeLimit
  getStyle: () => Record<string, string | number>
}

/**
 * Canvas.
 *
 * The canvas is the core of low-code operations, abstracting
 * key logic such as element orchestration management and canvas
 * is based on drag-and-drop operations.
 */
export interface CanvasInterface<T extends CanvasElementInterface> {
  /**
   * Element orchestration and other partial functions are
   * disabled when the canvas is locked.
   */
  readonly isLocked: boolean

  /**
   * Indicates whether element drag-and-drop operations can be
   * performed.
   */
  readonly isDragable: boolean

  /**
   * When the component is being dragged into the canvas.
   */
  readonly isReceiving: boolean

  /**
   * When components are loaded asynchronously in batches.
   */
  readonly isLoading: boolean

  /**
   * When editing elements.
   */
  readonly isEditing: boolean

  /**
   * When draging elements.
   */
  readonly isDraging: boolean

  /**
   * Canvas configurations information.
   */
  readonly canvasConfig: CanvasConfigInterface

  /**
   * Element resizer.
   */
  readonly resizer: CanvasResizerInterface

  /**
   * Canvas elements.
   */
  readonly elements: Array<T>

  /**
   * Bind a dom instance to the canvs to provide
   * support for refined drag ang drop logic.
   */
  bindContainer(container: HTMLElement): void

  /**
   * Gets the dom instance bound to the canvas.
   */
  getContainer(callback?: (container: HTMLElement) => void): HTMLElement | undefined

  lock(): void
  unlock(): void

  /**
   * Manually release resources occupied by the canvas.
   */
  recycle(): void

  /**
   * Generate CSS styles for the canvas.
   */
  getStyle(): Record<string, string | number>

  addElement(element: T): string
  removeElement(elKey: string): T | undefined
  getElement(elKey: string, callback?: (element: T) => void): T | undefined
  getEditingElement: (callback?: (element: T) => void) => T | undefined
  findElement(elKey: string): number
  getElementStyle: (elKey: string) => Record<string, any>

  /**
   * Used by the ouside world to actively inform the canvas
   * provisioning which component to drag info the canvas.
   */
  prepareForReceivingComponent(component: CanvasComponent): void

  /**
   * Used by the outside world to actively norify the canvas
   * to cancel the incoming component.
   */
  cancelReceivingComponent(): void

  // External components are dragged into the various stages
  // of the canvas.
  onDragElementEnter(event: DragEvent): void
  onDragElementOver(event: DragEvent): void
  onDragElementDrop(event: DragEvent): void
  onDragElementLeave(event: DragEvent): void

  isEditingMe: (elKey: string) => boolean
  /**
   * Determines if the element is being dragged.
   */
  isDragingMe: (elKey: string) => boolean

  // The stages in which elements within the canvas are dragged.
  onMouseEnterElement(event: MouseEvent, elKey: string): void
  onDragElementStart(event: DragEvent, method?: CanvasEditingElementMethod, elKey?: string): void
  onDragElement(event: DragEvent, intention?: CanvasEditingElementIntention, elKey?: string): void
  onDragElementEnd(event: DragEvent, elKey?: string): void
  onClickElement(event: MouseEvent, elKey: string): void
  onMouseLeaveElement(event: MouseEvent, elKey: string): void
}

/**
 * Defines two coordinate systems that may be used bu elements
 * within the grid canvas.
 */
export enum GridCanvasElementCoordinateType {
  /**
   * Same pixel coordinate system as normal canvas.
   */
  PIXEL,
  /**
   * A coarse-grained canvas with a grid(one grid equals N x M pixels).
   */
  GRID
}

/**
 * Grid canvas configuration.
 */
export interface CanvasGridConfig {
  colNum: number
  colGap: number
  unitHeight: number
  rowGap: number
}

export interface GridCanvasConfigInterface extends CanvasConfigInterface {
  grid: CanvasGridConfig
}

/**
 * GridCanvasElement
 *
 * Elements on a grid canvas add some coordinate transformation
 * logic compared to a normal canvas.
 */
export interface GridCanvasElementInterface<T extends CanvasComponent = CanvasComponent>
  extends CanvasElementInterface<T> {
  /**
   * Specifies the maximum reference width for element size
   * initialization.
   */
  readonly standardMaxWidth: number
  readonly initialSize: CanvasElementSize & CanvasElementSizeLimit
  readonly coordinateType: GridCanvasElementCoordinateType
  readonly coordinateMaxWidth: number

  transformCoordiante: (canvasWidth: number, gridConfig: CanvasGridConfig) => void

  switchGird: (sizeConvertor: SizeConvertor, limitConvertor: LimitConvertor) => void
  switchPixel: (sizeConvertor: SizeConvertor, limitConvertor: LimitConvertor) => void
}

/**
 * GridCanvas
 *
 * The element orchestration algorithm of a grid canvas may
 * be more complex than that of a normal canvas.
 */
export interface GridCanvasInterface<T extends GridCanvasElementInterface>
  extends CanvasInterface<T> {
  /**
   * Logo This is a grid canvas.
   */
  readonly isGrid: true
  readonly canvasConfig: GridCanvasConfigInterface

  /**
   * Show grid or not.
   */
  showGrid: boolean

  /**
   * Adjust the grid configuration of the grid canvas.
   */
  configGrid: (gridConfig: Partial<CanvasGridConfig>) => void
}
