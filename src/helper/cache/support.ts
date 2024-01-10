import cacheUtils from 'store'
import { HelpCenterSupportMenu } from '@/typings/api/help-center'

export const getSupport = () => {
  return cacheUtils.get('helpCenterMenu')
}

export const setSupport = (data: Array<HelpCenterSupportMenu>) => {
  return cacheUtils.set('helpCenterMenu', data)
}
