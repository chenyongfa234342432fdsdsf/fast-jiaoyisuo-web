import { languageRoutes } from '@/constants/i18n'
import { maintenanceApiResCode } from '@/constants/maintenance'
import { baseUrl, envIsServer } from '@/helper/env'
import { link } from '@/helper/link'
import { BaseMarkcoinResponse, MarkcoinResponse } from '@/plugins/request'
import { baseUserStore } from '@/store/user'
import { baseCommonStore } from '@/store/common'
import { t } from '@lingui/macro'
import { Message } from '@nbit/arco'
import { AxiosResponse } from 'axios'
import { MergeModeLoginInvalidPopUp } from '@/features/user/utils/common'

enum ErrorTypeEnum {
  authError = 'authError', // 身份失效错误
  serverError = 'serverError', // 服务端错误
  uncategorizedError = 'uncategorizedError', // 未分类的错误
}

const authErrorCode = [401]
/**
 * 10000065 平台内提币用：UID 错误，请检查后重试（表单校验，不弹框错误）
 * 10080003 登出 token 错误码
 * 10096004 合约组不存在
 * 10106004 已刷新价格，请重新购买
 * 10106005 otc 个人交易已经超过限额
 */
const passBusinessCode = [
  10030, 10000059, 10000065, 10080003, 10096004, 10106004, 10106001, 10106003, 10106005, 10109014,
]
const passRoutes = ['/futures/', '/login', '/register', '/retrieve', '/safety-verification']
// 自行处理的错误码，不会弹窗提示
const selfHandleErrorCodes = [maintenanceApiResCode]

let mergeModePopUpShow = false

/** 处理状态码，并提示用户 */
const handleErrorCode = async (code: number, msg: string, errorMessage?: string | undefined) => {
  if (envIsServer) {
    return
  }

  const isAuthError = authErrorCode.includes(code)
  const isServerError = (code === 500 && msg === 'Network Error') || (code === 500 && msg?.includes('timeout of'))

  /** 用户信息失效处理 */
  if (isAuthError) {
    await baseUserStore.getState().clearUserCacheData()
    const urlPathname = location.pathname
    const { isMergeMode } = baseCommonStore.getState()

    if (isMergeMode) {
      if (mergeModePopUpShow) return

      MergeModeLoginInvalidPopUp()

      mergeModePopUpShow = true
      return
    }

    /** 运行某些页面未登录访问、用户信息失效访问的处理 */
    if (!passRoutes.some(route => urlPathname.includes(route))) {
      Message.error({
        content: msg || t`plugins_request_interceptors_response_response_handler_2763`,
        id: ErrorTypeEnum.authError,
      })
      const language = languageRoutes.find(route => urlPathname.includes(route))
      const redirect = urlPathname.replace(language || '', '')
      link(`/login?redirect=${redirect}`)
      return
    }
    Message.error({
      content: msg,
      id: ErrorTypeEnum.authError,
    })
    return
  }

  if (isServerError) {
    const content = t`plugins_request_5101063`
    Message.error({
      content,
      id: ErrorTypeEnum.serverError,
    })
  }

  if (!isAuthError && !isServerError) {
    const content = errorMessage || msg
    Message.error({
      content,
      id: ErrorTypeEnum.uncategorizedError,
    })
  }
}

const onFulfilled: (input: any) => any = (response: AxiosResponse<BaseMarkcoinResponse<any>>) => {
  let resData: MarkcoinResponse
  const res = response.data
  const msg = res.message!
  const config = response.config

  // TODO: 现在是 yapi mock 暂未约束 code 码
  if (res.code === 200 || baseUrl.includes('yapi')) {
    resData = {
      isOk: true,
      data: res.data,
      message: msg,
    }

    // @ts-ignore
    if (config.needAllRes) {
      resData = { ...resData, ...res }
    }
    return resData
  }

  // 其它未知错误，原样返回
  // 过滤业务代码
  const isPassBusinessCode = passBusinessCode.includes(res.code)
  if (!isPassBusinessCode && !selfHandleErrorCodes.includes(res.code)) {
    // 用户登录失效
    handleErrorCode(res.code, msg)
  }
  resData = {
    isOk: false,
    data: res.data,
    message: msg,
    code: res.code,
  }
  return Promise.resolve(resData)
}

const onRejected = error => {
  console.debug('[responseHandler interceptor error ]', error)
  let resData: MarkcoinResponse
  const response = error?.response
  const msg = response?.data?.message || error?.toJSON?.()?.message
  const code = response?.data?.code || response?.status || 500
  const errorMessage = error?.config?.errorMessage

  // 用户登录失效
  handleErrorCode(code, msg, errorMessage)

  resData = {
    isOk: false,
    data: '',
    message: msg,
    code: -1,
  }
  return Promise.resolve(resData)
}

export default {
  onFulfilled,
  onRejected,
}
