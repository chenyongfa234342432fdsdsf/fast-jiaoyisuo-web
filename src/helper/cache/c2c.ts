import cacheUtils from 'store'

export const C2CTips = 'C2C_Tips'

export function setC2CParamsTipsCache(tokenObj: any) {
  cacheUtils.set(C2CTips, tokenObj)
}

export function getC2CParamsTipsCache() {
  return cacheUtils.get(C2CTips)
}

export function removeC2CParamsTipsCache() {
  cacheUtils.set(C2CTips, {})
}
