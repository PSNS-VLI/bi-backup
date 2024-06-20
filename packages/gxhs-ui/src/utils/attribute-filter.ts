import { getVueAttribute } from './attribute-convert'

/**
 * Filter attribute values from metadata.
 * @param origin - metadata.
 * @param dross - the keys want to be filtered.
 * @param reserve - default values.
 * @return {{}}
 */
const filterAttrs: <T extends Record<string, any>>(
  origin: T,
  dross: Array<string>,
  reserve?: Record<keyof T, any>
) => Partial<Record<keyof T, any>> = (origin, dross, reserve = undefined) => {
  const attr = Object.keys(origin).reduce((target: Record<string, any>, key) => {
    if (!dross.includes(key)) target[key] = origin[key]
    return target
  }, {})
  if (reserve) {
    Object.keys(reserve).forEach((key) =>
      Object.assign(attr, getVueAttribute(origin, key) || { [key]: reserve[key] })
    )
  }

  return attr as any
}

export { filterAttrs }
