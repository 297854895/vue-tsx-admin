export default (query: string) => {
  if (!query || typeof query !== 'string') return {}
  let str = query
  if (str.substr(0, 1) === '?') str = str.substr(1)
  const row = str.split('&')
  const para: { [propsName: string]: any } = {}
  row.forEach(item => {
    const arg = item.split('=')
    para[decodeURIComponent(arg[0])] = decodeURIComponent(arg[1])
  })
  return para
}
