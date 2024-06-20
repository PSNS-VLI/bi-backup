/***
 * convert the camelCase to the kebab-case.
 * @param camelCase {string} - A string that conforms to the camelCase specification.
 * @return {string} - The kebab-case string corresponding to camelCase.
 */
export const camelToKebab = (camelCase: string) => {
  return [...camelCase.matchAll(/([A-Z]?[a-z]*)/g)].reduce((kebab, item) => {
    if (item[0]) kebab += `${kebab && '-'}${item[0]}`
    return kebab.toLowerCase()
  }, '')
}

/***
 * convert the kebab-case to the camelCase.
 * @param kebabCase {string} - A string that conforms to the kebab-case specification.
 * @return {string} - The camelCase string corresponding to kebab-case.
 */
export const kebabToCamel = (kebabCase: string) => {
  return kebabCase.split('-').reduce((camel, item, index) => {
    const firstCase = item.slice(0, 1)
    return camel + (index ? firstCase.toUpperCase() : firstCase) + item.slice(1)
  }, '')
}

/**
 * Completes the format of attributes that users may enter when using Vue.
 * @param attribute {string} - Attributes entered by the user.
 * @return {string[]}
 */
export const vueAttributeCompletion = (attribute: string) => {
  let completion = attribute
  if (/([A-Z]?[a-z]*)/.test(attribute)) completion = camelToKebab(attribute)
  if (/^[a-z]+(-[a-z]+)*$/.test(attribute)) completion = kebabToCamel(attribute)
  return attribute === completion ? [attribute] : [attribute, completion]
}

/**
 * Determine the boolean state of a vue property.
 * @param attributes {{}} - vue property object.
 * @param attribute {string} - The target attribute to be judged.
 * @return {boolean}
 */
export const booleanVueAttribute = (attributes: object, attribute: string) => {
  return vueAttributeCompletion(attribute).reduce((bool, item) => {
    // @ts-ignore
    return bool || Object.hasOwn(attributes, item)
  }, false)
}

/**
 * Get an attribute in a vue property.
 * @param attributes vue property object.
 * @param attribute The target attribute to be fetched.
 * @return {}
 */
export const getVueAttribute: <T extends object>(
  attributes: Record<string, any>,
  attribute: string
) => Partial<T> | null = (attributes, attribute) => {
  return vueAttributeCompletion(attribute).reduce(
    (res: any, key) => (res = !res ? (attributes[key] ? { [key]: attributes[key] } : null) : res),
    null
  )
}
