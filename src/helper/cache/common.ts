import cacheUtils from 'store'
import { MemberAuthRefreshTokenResp } from '@/typings/user'
import { envIsClient, businessId } from '../env'

// 用于存交易线的红涨绿跌或者绿涨红跌
export const cssColor = 'CSS_COLOR'
export const TOKEN = 'AUTH_TOKEN'

export function getAllStorage() {
  let res = {}
  let keys = Object.keys(localStorage)
  let i = keys.length

  // eslint-disable-next-line no-plusplus
  while (i--) {
    res[keys[i]] = localStorage.getItem(keys[i])
  }

  return res
}

export function setAllStorage(_localStorage) {
  Object.keys(_localStorage).forEach(k => {
    localStorage[k] = _localStorage[k]
  })
}

export function setTokenCache(tokenObj: MemberAuthRefreshTokenResp | null) {
  cacheUtils.set(TOKEN, tokenObj)
}

export function getTokenCache() {
  return cacheUtils.get(TOKEN) as MemberAuthRefreshTokenResp | null
}

export function setLineCssColor(val) {
  return cacheUtils.set(cssColor, val)
}

export function getLineCssColor() {
  return cacheUtils.get(cssColor)
}

export const themeCache = 'themeCache'

export function getThemeCache() {
  return cacheUtils.get(themeCache)
}

export function setThemeCache(val) {
  return cacheUtils.set(themeCache, val)
}
export const langCache = 'langCache'
export const lastLangCache = 'lastLangCache'

export function getLastLangCache() {
  return cacheUtils.get(lastLangCache)
}

export function setLastLangCache(val) {
  return cacheUtils.set(lastLangCache, val)
}
export function getLangCache() {
  if (envIsClient) {
    return sessionStorage.getItem(langCache) || getLastLangCache()
  }
}

export function setLangCache(val) {
  if (envIsClient) {
    sessionStorage.setItem(langCache, val)
    setLastLangCache(val)
  }
}

export const mergeModeCache = 'mergeModeCache'

export function setMergeModeCache(val: boolean) {
  return cacheUtils.set(mergeModeCache, val)
}

export function getMergeModeCache() {
  return cacheUtils.get(mergeModeCache)
}

export const businessIdCache = 'businessId'

export function setBusinessIdCache(val: string) {
  return cacheUtils.set(businessIdCache, val)
}

export function getBusinessIdCache() {
  return cacheUtils.get(businessIdCache) || businessId
}

export const accessKeyCache = 'accessKey'

export function setAccessKeyCache(val: string) {
  return cacheUtils.set(accessKeyCache, val)
}

export function getAccessKeyCache() {
  return cacheUtils.get(accessKeyCache)
}

/** 探测持久化储存 */
export function initCache() {
  if (!cacheUtils.enabled) {
    // eslint-disable-next-line no-alert
    alert(
      'Local storage is not supported by your browser. Please disabled "Private Mode", or upgrade to a modern browser'
    )
  }
}

export const headerShowCache = 'headerShowCache'

export function setHeaderShowCache(val: string) {
  if (envIsClient) {
    return cacheUtils.set(headerShowCache, val)
  }
}

export function getHeaderShowCache() {
  if (envIsClient) {
    return cacheUtils.get(headerShowCache)
  }
}

export const footerShowCache = 'footerShowCache'

export function setFooterShowCache(val: string) {
  if (envIsClient) {
    return cacheUtils.set(footerShowCache, val)
  }
}

export function getFooterShowCache() {
  if (envIsClient) {
    return cacheUtils.get(footerShowCache)
  }
}
