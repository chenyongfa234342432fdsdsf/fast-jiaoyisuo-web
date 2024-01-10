/**
 * 获取当前 host like: https://www.baidu.com
 * @returns
 */
export const getHost = () => {
  const {
    location: { protocol, host },
  } = window

  return `${protocol}//${host}`
}
