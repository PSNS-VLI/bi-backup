export interface FileTreeData {
  [key: string]: any
  name?: string
  draggable?: boolean
  children?: Array<FileTreeData>
}

export interface FileTreeProps {
  data: Array<FileTreeData>
  judgeNodeDragable?: (nodeData: any, node: any) => 'true' | 'false'
  dragStartHook?: (event: DragEvent, nodeData: any, node: any) => void
}
