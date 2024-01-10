import { envIsServer, gitCommitId } from '@/helper/env'
import { MarkcoinRequestConfig } from '@/plugins/request'
import { baseCommonStore } from '@/store/common'
import { baseUserStore } from '@/store/user'

export const getRequestBaseHeader = (headers?: any) => {
  const useStore = baseUserStore.getState()
  let tokenParams = {}
  if (envIsServer) {
    // set Authorization if token exist
    if (headers.token) tokenParams = { Authorization: headers.token }
  } else {
    const tokenObj = useStore.token
    if (tokenObj && tokenObj?.accessToken) {
      tokenParams = { Authorization: tokenObj?.accessToken }
    }
  }
  const commonStore = baseCommonStore.getState()
  // 补齐 query 主题、语言、商户 id、accesskey 等设置
  const { locale: lang, businessId, accessKey } = commonStore

  return {
    ...tokenParams,
    'Accept-Language': lang,
    'nb-os-version': '10.14.01',
    'nb-application-version': gitCommitId || '1.0.0',
    'nb-platform': 'WEB',
    'nb-uid': useStore?.userInfo?.uid || '',
    'nb-merchant-platform': '123456',
    'nb-device-no': useStore.deviceId || '',
    'nb-business-id': businessId || '',
    'nb-access-key': accessKey || '',
  }
}

const onFulfilled = (config: MarkcoinRequestConfig) => {
  const { method, headers = {} } = config
  const baseHeader = getRequestBaseHeader(headers)

  config.headers = {
    ...headers,
    ...baseHeader,
  }
  switch (method) {
    case 'put':
    case 'PUT':
    case 'post':
    case 'POST': {
      // 传给 contentType interceptor 来统一处理
      break
    }
    default:
      config.params = {
        ...config.params,
      }
      break
  }

  return config
}

export default {
  onFulfilled,
}
