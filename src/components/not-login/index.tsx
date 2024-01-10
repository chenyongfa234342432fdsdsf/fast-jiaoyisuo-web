import { usePageContext } from '@/hooks/use-page-context'

import { t } from '@lingui/macro'
import classNames from 'classnames'
import { ReactNode } from 'react'
import { useUserStore } from '@/store/user'
import Link from '../link'

export function NotLoginPlaceNodeInTrade() {
  const pageContext = usePageContext()

  return (
    <div className="h-48 flex justify-center items-center">
      <Link className="text-brand_color" href={`/login?redirect=${pageContext.path}`}>{t`user.field.reuse_07`}</Link>
      &nbsp;
      {t`user.third_party_01`}&nbsp;
      <Link className="text-brand_color" href="/register">{t`user.common.register`}</Link>
      <span className="ml-1">{t`features_orders_composite_spot_full_5101195`}</span>
    </div>
  )
}

export type INotLoginProps = {
  children?: ReactNode
  className?: string
  isSmall?: boolean
  placeNode?: ReactNode
}
/**
 * 未登录组件，未登录会展示登录提示，已登录正常展示组件内容
 */
function NotLogin({ children, placeNode, className, isSmall }: INotLoginProps) {
  const userState = useUserStore()
  const pageContext = usePageContext()
  const isLogin = userState.isLogin
  if (isLogin) {
    return children! as JSX.Element
  }
  return (
    (placeNode as JSX.Element) || (
      <div className={classNames('flex justify-center items-center', className)}>
        {isSmall ? null : <>{t`components/not-login/index-0`}&nbsp;</>}
        <Link className="text-brand_color" href={`/login?redirect=${pageContext.path}`}>{t`user.field.reuse_07`}</Link>
        &nbsp;
        {t`user.third_party_01`}&nbsp;
        <Link className="text-brand_color" href="/register">{t`user.common.register`}</Link>
      </div>
    )
  )
}

export default NotLogin
