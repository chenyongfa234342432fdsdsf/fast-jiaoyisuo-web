import { I18nsEnum } from '@/constants/i18n'
import { baseCommonStore } from '@/store/common'
import { navigate } from 'vite-plugin-ssr/client/router'
import { IsWhiteListRoute, getMergeModeStatus } from '@/features/user/utils/common'
import { isAbsoluteUrl } from './common'
import { removeLocale } from './i18n'

export interface ILinkConfig {
  /** 保持登录位置 */
  keepScrollPosition?: boolean | undefined
  /** 不要在浏览器的历史记录中创建新条目；新 URL 将替换当前 URL（这有效地从历史记录中删除当前 URL */
  overwriteLastHistoryEntry?: boolean | undefined
  /** 打开新页面 */
  target?: boolean
}
export const link = (url?: string, goConfig?: ILinkConfig) => {
  const { locale } = baseCommonStore.getState()
  const isMergeMode = getMergeModeStatus()
  const lang = locale === I18nsEnum['en-US'] ? '' : `/${locale}`
  const sanitisedUrl = removeLocale(url) || ''
  let _url = `${lang}${sanitisedUrl}`

  // 防止后端设置为 null
  if (!url) _url = ''
  if (isAbsoluteUrl(url)) _url = url as string

  /** 融合模式判断路由地址是否为黑名单地址 */
  if (isMergeMode && sanitisedUrl) {
    const isTrue = IsWhiteListRoute(sanitisedUrl)
    if (!isTrue) return
  }

  if (!isMergeMode && goConfig?.target) {
    return window.open(_url, 'target')
  }

  return navigate(_url, {
    overwriteLastHistoryEntry: !!goConfig?.overwriteLastHistoryEntry,
    keepScrollPosition: !!goConfig?.keepScrollPosition,
  })
}
