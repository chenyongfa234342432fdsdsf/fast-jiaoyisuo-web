import { baseUserStore } from '@/store/user'
import { link } from './link'
import { removeCookieToken, setCookieToken } from './cookie'
import { envIsClient } from './env'

export const setToken = tokenObj => {
  if (tokenObj?.token) {
    setCookieToken(tokenObj.token)
    const userStore = baseUserStore.getState()
    userStore.setToken({
      accessToken: tokenObj.token,
      refreshToken: tokenObj.refreshToken,
      accessTokenExpireTime: tokenObj.tokenExpireTime,
      refreshTokenExpireTime: tokenObj.refreshTokenExpireTime,
    })
  }
  if (tokenObj?.accessToken) {
    setCookieToken(tokenObj.accessToken)
    const userStore = baseUserStore.getState()
    userStore.setToken(tokenObj)
  }
}

export const removeToken = async () => {
  removeCookieToken()
  const userStore = baseUserStore.getState()
  await userStore.setToken(null)
}

/**
 * @description: 获取是否是非登录状态
 */
export function getIsUnLogin() {
  const userStore = baseUserStore.getState()
  return !userStore.isLogin
}

/**
 * @description: 获取是否登录状态
 */
export function getIsLogin() {
  const userStore = baseUserStore.getState()
  return userStore.isLogin
}

/**
 * 间接重定向逻辑 更具 authTo unAuthTo 和登录态拿到重定向路由
 * 直接重定向逻辑 go
 */
export function getRedirectUrl(authTo, unAuthTo, go) {
  if (!!authTo && getIsLogin()) {
    return authTo
  }
  if (!!unAuthTo && getIsUnLogin()) {
    return unAuthTo
  }
  if (go) {
    return go
  }
}

/**
 * @description:获取登录状态，如果没登录会跳登录页，常用于资金页、交易页前置校验
 * @return isLogin
 */
export function checkLogin() {
  /** 未登录跳首页 */
  if (!getIsLogin()) {
    link('/login')
    return false
  }
  return true
}
