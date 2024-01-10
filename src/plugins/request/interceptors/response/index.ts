import { AxiosResponse } from 'axios'
import { BaseMarkcoinResponse } from '../..'
import responseHandler from './response-handler'
import checkMaintenance from './check-maintenance'

export type ResponseInterceptorType = {
  onFulfilled: (input: AxiosResponse<BaseMarkcoinResponse<any>>) => any
  onRejected?: (...args) => any
}

const ResponseInterceptors: ResponseInterceptorType[] = [checkMaintenance, responseHandler]

export default ResponseInterceptors
