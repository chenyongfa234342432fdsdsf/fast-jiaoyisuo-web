import { useRefreshWindowVisible } from '@/hooks/features/c2c/order/use-refresh-window-visible'
import { useUserStore } from '@/store/user'
import { removeUserInfo, getTokenCache } from '@/helper/cache'
import { MemberAuthRefreshTokenResp } from '@/typings/user'
import { removeToken } from '@/helper/auth'
import { link } from '@/helper/link'
import { languageRoutes } from '@/constants/i18n'

/**
 * 处理当页面很久没有进入的情况下，token 过期，在请求需要 token 的接口中，会报 401，然后突然跳转登陆页面的突兀的情况
 * @param restLoginStatus: 是否需要重新进入本页面
 *
 */

const useGetIsLoginStatus = (restLoginStatus?: boolean) => {
  const store = useUserStore()

  const getIsLoginStatus = () => {
    const cacheToken = getTokenCache() as MemberAuthRefreshTokenResp | null
    if (cacheToken) {
      const isTrue = Date.now() <= cacheToken.refreshTokenExpireTime && !!cacheToken.accessToken
      return isTrue
    }
    return !!cacheToken
  }

  const getIsLoginStatusChange = () => {
    if (!document.hidden) {
      const isLogin = getIsLoginStatus()
      if (!isLogin) {
        removeUserInfo()
        removeToken()
        store?.clearUserCacheData()
        if (restLoginStatus) {
          const urlPathname = location.pathname
          const language = languageRoutes.find(route => urlPathname.includes(route))
          const redirect = urlPathname.replace(language || '', '')
          link(redirect)
        }
      }
    }
  }
  useRefreshWindowVisible(getIsLoginStatusChange)
}

export { useGetIsLoginStatus }
