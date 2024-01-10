import { I18nsEnum } from '@/constants/i18n'
import classNames from 'classnames'
import { ReactNode } from 'react'
import { isAbsoluteUrl } from '@/helper/common'
import { useCommonStore } from '@/store/common'
import { IsWhiteListRoute, getMergeModeStatus } from '@/features/user/utils/common'
import { removeLocale } from '@/helper/i18n'

export type ILinkProps = {
  href: string
  children: ReactNode
  prefetch?: boolean
  className?: string
  /** 打开新页面 */
  target?: boolean
}

/**
 *
 * @param param prefetch:是否预获取资源
 * @returns
 */
function Link({ href, children, prefetch, className, target }: ILinkProps) {
  const { locale } = useCommonStore()
  const isMergeMode = getMergeModeStatus()
  const lang = locale === I18nsEnum['en-US'] ? '' : `/${locale}`
  const sanitisedHref = removeLocale(href) || ''
  let _herf = `${lang}${sanitisedHref}`

  // 防止后端设置为 null
  if (!href) _herf = ''
  if (isAbsoluteUrl(href)) _herf = href

  /** 融合模式判断路由地址是否为黑名单地址 */
  if (isMergeMode && sanitisedHref) {
    const isTrue = IsWhiteListRoute(sanitisedHref)
    !isTrue && (_herf = '')
  }

  return (
    <a
      href={_herf}
      target={!isMergeMode && target ? '_blank' : '_self'}
      className={classNames('navigation-link', className)}
    >
      {children}
    </a>
  )
}
export default Link
