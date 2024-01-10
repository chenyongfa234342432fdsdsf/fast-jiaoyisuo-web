import { MarkcoinRequestConfig } from '@/plugins/request'
import removeCustomConfig from '@/interceptors/request/remove-custom-config'
import setContentTypeAndData from '@/interceptors/request/set-content-type-and-data'
import setDefaultConfig from '@/interceptors/request/set-default-config'
import setBaseParams from '@/interceptors/request/set-base-params'
import c2cMode from '@/interceptors/request/c2c-mode'

export type RequestInterceptorType = {
  onFulfilled: (input: MarkcoinRequestConfig) => MarkcoinRequestConfig | Promise<MarkcoinRequestConfig>
  onRejected?: (...args) => any
}

const RequestInterceptors: RequestInterceptorType[] = [
  setDefaultConfig,
  setContentTypeAndData,
  setBaseParams,
  removeCustomConfig,
]

// reverse 是为了适配 Axios，使其按照上面配置的顺序依次拦截 Request
export default RequestInterceptors.reverse()
