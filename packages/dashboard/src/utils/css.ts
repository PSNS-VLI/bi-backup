export const setCssUnit: (
  size: string | number,
  backup?: string | number,
  unit?: string
) => string = (size: string | number, backup: string | number = '', unit = 'px') => {
  // no verification for invalid string value.
  return typeof size === 'number' && isNaN(size)
    ? setCssUnit(backup)
    : isNaN(Number(size))
      ? (size as string)
      : `${size}${unit}`
}

export const getCssID = (randomLength = 10) => {
  let id = ''

  while (id.length < randomLength) {
    const random = Math.random()
    id += String.fromCharCode(Math.ceil(random * 25) + 97)
  }

  return id
}
