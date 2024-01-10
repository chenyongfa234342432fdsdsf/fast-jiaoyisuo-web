import { CustomRequestConfig, MarkcoinRequestConfig } from '@/plugins/request'
/**
 * 统一删除自定义配置
 * @param config
 * @returns AxiosRequestConfig
 */
const onFulfilled = (config: MarkcoinRequestConfig) => {
  type customDefinedNames = keyof CustomRequestConfig
  const toBeRemoved: customDefinedNames[] = []

  toBeRemoved.forEach(name => {
    delete config[name]
  })

  return config
}

export default {
  onFulfilled,
}
