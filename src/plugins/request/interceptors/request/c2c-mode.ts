import { baseUserStore } from '@/store/user'
import { baseCommonStore } from '@/store/common'
import { envIsServer, isPublicC2cMode, publicC2cBaseUrl } from '@/helper/env'
import { isEmpty } from 'lodash'
import { fetchPublicC2cToken } from '@/helper/c2c-mode'
import { MarkcoinRequestConfig } from '@/plugins/request'

const onFulfilled = async (config: MarkcoinRequestConfig) => {
  if (!isPublicC2cMode || envIsServer) return config

  const { c2cModeUserInfo, isLogin } = baseUserStore.getState()
  const { c2cModeInfo } = baseCommonStore.getState()
  const { c2cBid } = c2cModeInfo || {}

  if (!c2cBid) return config

  // @ts-ignore
  const { headers = {}, url, isUseFastPayApi } = config

  if (url?.includes('/c2c') || isUseFastPayApi) {
    const { token, webAccessKey } =
      /** fetch public c2c token if it is empty */
      (isEmpty(c2cModeUserInfo) && isLogin ? await fetchPublicC2cToken() : c2cModeUserInfo) || {}

    config.headers = {
      ...headers,
      'nb-business-id': c2cBid,
      ...(token && webAccessKey && { 'nb-access-key': webAccessKey, 'Authorization': token }),
    }
    config.baseURL = publicC2cBaseUrl
  }

  return config
}

export default {
  onFulfilled,
}
