type anyFunc = (...args: any[]) => void

function debounce(func: Function, delay: number = 300): anyFunc {
  let timeout: NodeJS.Timeout | null = null

  return function (this: any, ...args: any[]) {
    const _this = this
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      func.apply(_this, args)
    }, delay)
  }
}

function throttle(func: Function, delay: number = 300): anyFunc {
  let timeout: NodeJS.Timeout | null = null

  return function (this: any, ...args: any[]) {
    const _this = this

    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null
        func.apply(_this, args)
      }, delay)
    }
  }
}

function throttleImme(func: Function, wait: number = 300): anyFunc {
  let previous = 0

  return function (this: any, ...args: any[]) {
    const _this = this

    const now = Date.now()
    if (now - previous > wait) {
      func.apply(_this, args)
      previous = now
    }
  }
}

export { debounce, throttle, throttleImme }
