import cacheUtils from 'store'

export const userInfo = 'USER_INFO'

export function getUserInfo() {
  return cacheUtils.get(userInfo)
}

export function setUserInfo(val) {
  return cacheUtils.set(userInfo, val)
}

export function removeUserInfo() {
  return cacheUtils.set(userInfo, '')
}
