import { DatasetNodeType, FieldType, FieldClass, FieldNodeType } from '../../../types/dataset'
import type { DatasetTree, Field, FieldTree } from '../../../types/dataset'

export const dataSetMockData: DatasetTree = [
  {
    pid: -1,
    id: 1,
    name: '文件夹',
    nodeType: DatasetNodeType.FOLDER,
    children: Array.from({ length: 20 }).map((_, index) => ({
      pid: 1,
      id: 10 + index,
      name: '文件' + index,
      nodeType: DatasetNodeType.DATASET
    }))
  }
]

const mockFieldTree = (fieldClass: 'D' | 'M'): FieldTree => {
  const genBaseData = (id: number, pid: number = -1) => ({
    id,
    pid,
    name: `name${id}`,
    originName: `originName${id}`,
    description: `description${id}`
  })
  return Array.from({ length: 10 }).map((_, id: number) => {
    const data: Record<string, any> = {
      ...genBaseData(id),
      type: fieldClass === 'D' ? FieldType.STRING : FieldType.DOUBLE,
      class: fieldClass === 'D' ? FieldClass.DIMENSION : FieldClass.MEASUREMENT,
      nodeType: FieldNodeType.FIELD
    }

    if (id % 4 === 0) {
      data.children = [Object.assign({}, data, genBaseData(id + 1000, id))]
      data.nodeType = FieldNodeType.FOLDER
    }

    return data
  }) as FieldTree
}

// mock for laodField api
export const fieldMockData: FieldTree = mockFieldTree('D').concat(mockFieldTree('M'))

// mock for laodData api
export const loadMockData = (fields: Array<Field>): Array<Record<string, string | number>> => {
  return Array.from({ length: 10 }).map((_, index) =>
    fields.reduce((res: Record<string, string | number>, field) => {
      const key = field.originName

      res[key] = field.class === FieldClass.DIMENSION ? `${key}${index}` : index

      return res
    }, {})
  )
}
