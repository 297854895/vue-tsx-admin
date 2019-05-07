/**
创建真实节点
**/
export default ({
  mount,
  type,
  attr
}) => {
  try {
    const DOM = document.createElement(type)
    if (attr && typeof attr === 'object') {
      for (let key in attr) {
        const val = attr[key]
        DOM.setAttribute(key, val)
      }
    }
    if (!mount || !mount.appendChild) return
    mount.appendChild(DOM)
    return DOM
  } catch (e) {
    console.error(e)
  }
}
