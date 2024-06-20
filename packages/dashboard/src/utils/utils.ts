import type { AnyFunction, Nullable } from '../types/common'

/**
 * type guards
 */
export function isNumber(val: any): val is number {
  return typeof val === 'number'
}

export const betweenMinAndMax = (val: number, min?: number, max?: number) => {
  if (isNumber(max) && isNumber(min)) {
    return min >= max ? val : val < max ? (val > min ? val : min) : max
  } else if (isNumber(min)) {
    return val > min ? val : min
  } else if (isNumber(max)) {
    return val < max ? val : max
  }
  return val
}

export const constWithReverse: <T extends Record<any, any>>(
  record: T
) => T & Record<string, string> = (record) => {
  record = { ...record }

  Object.keys(record).forEach((key) => {
    Object.assign(record, {
      [record[key]]: key
    })
  })

  return record
}

export const debounce = (func: (...args: any[]) => any, delay = 500) => {
  let timer: any = null

  return function (this: any, ...args: any[]) {
    const that = this

    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(that, args)
    }, delay)
  }
}

export const keyIsValue = (keyMap: Record<string, string>) => {
  return Object.keys(keyMap).reduce((newKeyMap: Record<string, string>, key) => {
    newKeyMap[key] = key

    return newKeyMap
  }, {})
}

export const valueAsKey = (keyMap: Record<string, string>) => {
  return Object.keys(keyMap).reduce((newKeyMap: Record<string, string>, key) => {
    newKeyMap[keyMap[key]] = keyMap[key]

    return newKeyMap
  }, {})
}

export const boolArray = (array: Array<any>) =>
  array.filter((item) => typeof item !== 'boolean' && typeof item !== 'undefined')

export const callFunc = (func: Nullable<AnyFunction>) => {
  return (...args: any[]) => {
    return typeof func === 'function' && func(...args)
  }
}

function isObject(item: any): item is Record<string, any> {
  return item && typeof item === 'object' && !Array.isArray(item)
}

export function deepAssign<T extends Record<string, any>>(target: T, ...sources: any[]): T {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} } as any)
        ;(target[key] as any) = deepAssign((target[key] as any) || {}, source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return deepAssign(target, ...sources)
}

export const depthFirstSearch = <N extends any>(
  tree: Array<N>,
  criteria: (node: N) => {
    next: boolean
    childrenKey?: string
  },
  callback: (node: N) => void
) => {
  tree.forEach((node) => {
    callback(node)

    const { childrenKey = 'children', next } = criteria(node)
    if (next) {
      depthFirstSearch<N>((node as any)[childrenKey], criteria, callback)
    }
  })
}

export async function copyText(text: string): Promise<boolean> {
  let success = false

  try {
    await navigator.clipboard.writeText(text)
    success = true
  } catch (e) {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.display = 'none'

    document.body.appendChild(textArea)

    textArea.select()
    textArea.setSelectionRange(0, 99999)

    try {
      success = document.execCommand('copy')
    } catch (e) {
      console.log()
    } finally {
      window.getSelection()?.removeAllRanges()
      document.body.removeChild(textArea)
    }
  }

  return success
}
