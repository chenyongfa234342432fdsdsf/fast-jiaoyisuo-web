import axios, { AxiosRequestConfig } from 'axios'
import { baseUrl, envIsDev } from '@/helper/env'
import { contentTypeEnum } from '@/interceptors/request/set-content-type-and-data'
// import ResponseInterceptors from './interceptors/response'
import createAuthRefreshInterceptor from 'axios-auth-refresh'
import { postMemberAuthRefreshToken } from '@/apis/user'
import { baseUserStore } from '@/store/user'
import { setToken } from '@/helper/auth'
import { tokenPreRefreshValue, toKenTtlDefaultValue } from '@/constants/auth'
import responseHandler from './interceptors/response/response-handler'
import RequestInterceptors from './interceptors/request'
import ResponseInterceptors from './interceptors/response'
/**
 * 统一请求参数设置
 */

export type CustomRequestConfig = {
  path?: string
  signature?: string
  contentType?: contentTypeEnum
  isUseTuleApi?: boolean

  signedData?: any
  /** 为兼容某部分接口没按照特定格式返回 */
  needAllRes?: boolean
}

/**
 *
 */
export type MarkcoinRequestConfig = AxiosRequestConfig & CustomRequestConfig

/**
 * 统一请求函数定义
 */
export type MarkcoinRequest<Q = any, P = any> = (params: Q) => Promise<MarkcoinResponse<P>>
export type BaseMarkcoinResponse<R = any> = { message: string; data: R; code: number; msg?: string }

/**
 * 统一返回定义
 */
export type MarkcoinResponse<P = any> = {
  isOk: boolean
  message?: string
  data?: P
  code?: number
  msg?: string
}

const axiosRequest = axios.create({
  baseURL: envIsDev ? baseUrl : baseUrl,
  withCredentials: false,
  timeout: 30 * 1000,
})

// 注册 API 请求拦截
RequestInterceptors.forEach(interceptor => {
  axiosRequest.interceptors.request.use(interceptor.onFulfilled, interceptor.onRejected)
})

// // 注册 API 返回拦截
ResponseInterceptors.forEach(interceptor => {
  axiosRequest.interceptors.response.use(interceptor.onFulfilled, interceptor.onRejected)
})
function refreshAuthLogic(failedRequest) {
  const userStore = baseUserStore.getState()
  const tokenObj = userStore.token
  return postMemberAuthRefreshToken({
    refreshToken: tokenObj?.refreshToken as string,
    tokenTtl: toKenTtlDefaultValue,
  }).then(freshRes => {
    const freshResVal = freshRes?.data
    if (freshResVal?.accessToken) {
      setToken(freshResVal)
      failedRequest.response.config.headers.Authorization = freshResVal?.accessToken
    }
    return Promise.resolve()
  })
}

createAuthRefreshInterceptor(axiosRequest, refreshAuthLogic, {
  shouldRefresh: err => {
    const is401 = err.response?.status === 401
    const date = Date.now()
    const userStore = baseUserStore.getState()
    const tokenObj = userStore.token
    const refreshTokenExpireTime = Number(tokenObj?.refreshTokenExpireTime) + 99999999999
    if (!tokenObj?.refreshTokenExpireTime) {
      /** 这中间件和 axios catch  互斥只能在这里写 */
      responseHandler.onRejected(err)
      return false
    }
    // ================ 测试用 Start
    // 401 场景直接刷新，前提是刷新 token 没过期，正常不考虑这种场景 都 401 了还计算什么 刷新 token 时间，我们为了体验只考虑前置刷新

    // if (is401) {
    //   // 刷新 token 未过期
    //   if (date < refreshTokenExpireTime) {
    //     return true
    //   }
    //   /** 这中间件和 axios catch  互斥只能在这里写 */
    //   responseHandler.onRejected(err)
    // }

    // ================== END
    if (date < refreshTokenExpireTime) {
      // 分初始化刷新还是要提前刷新，但是我们不考虑初始化场景，只考虑提前刷新场景
      if (!is401) {
        // 要提前三分之一的时间刷新，也就是 4 小时
        if (date + tokenPreRefreshValue >= refreshTokenExpireTime) {
          return true
        }
      }
    }
    /** 这中间件和 axios catch  互斥只能在这里写 */
    responseHandler.onRejected(err)
    return false
  },
})

const Request: MarkcoinRequest = (config: MarkcoinRequestConfig) => {
  // 返回结果或者任何异常都会被 response Interceptor 拦截
  return axiosRequest.request<any, MarkcoinResponse>(config)
}

export default Request
