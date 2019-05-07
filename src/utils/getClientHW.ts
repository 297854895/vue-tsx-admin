export default () => {
  if (window.innnerWidth) {
    return {
      width: window.innnerWidth,
      height: window.innnerHeight
    }
  } else if (document.compatMode === 'CSS1Compat') return {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight
  }
  return {
    width: document.body.clientWidth,
    height: document.body.clientHeight
  }
}
