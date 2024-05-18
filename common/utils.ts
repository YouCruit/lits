export function throttle<T extends (...args: any[]) => void>(func: T) {
  let openForBusiness = true
  return function (this: any, ...args: Parameters<T>) {
    if (openForBusiness) {
      requestAnimationFrame(() => openForBusiness = true)
      openForBusiness = false
      func.apply(this, args)
    }
  }
}
