// dom元素， name事件名， func回调方法
export const bindEvent = (dom: any, name: string, func: Function, useCapture: boolean) => {
  if (dom.addEventListener) {
    dom.addEventListener(name, func, useCapture)
  } else if (dom.attachEvent) {
    dom.attachEvent(`on${name}`, func, useCapture)
  }
}
export const removeEvent = (dom: any, name: string, func: Function, useCapture: boolean) => {
  if (dom.removeEventListener) {
    dom.removeEventListener(name, func, useCapture)
  } else if (dom.detachEvent) {
    dom.detachEvent(`on${name}`, func, useCapture)
  }
}
