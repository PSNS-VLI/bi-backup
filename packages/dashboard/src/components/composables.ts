import { reactive } from 'vue'

import { type ContainerBar } from './Container'

type Constructor<T> = new (...args: any[]) => T

export const useBar = <T extends ContainerBar = ContainerBar>(
  barClass: Constructor<T>,
  barKeyDesc: string
) => {
  const barKey = Symbol(barKeyDesc)

  return {
    barKey,
    barInstance: reactive(new barClass(barKey))
  }
}
