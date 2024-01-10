import { t } from '@lingui/macro'
import { ReactNode } from 'react'
import classNames from 'classnames'
import { Button } from '@nbit/arco'
import { link } from '@/helper/link'
import Styles from './index.module.css'
import WithdrawAction from '../withdraw-action'

interface IAssetsHeaderProps {
  children: ReactNode
}

function AssetsHeader({
  title,
  headerChildren,
  rightChildren,
  className,
  showRight = true,
  coinId,
}: {
  title: ReactNode
  headerChildren?: ReactNode
  rightChildren?: ReactNode
  className?: string
  showRight?: boolean
  coinId?: string
}) {
  return (
    <div className={classNames(Styles['assets-header'], className, 'icon-wrap')}>
      <div className="header-left">
        <span className="title-name">{title}</span>
        <div className="header-operate">{headerChildren}</div>
      </div>

      {showRight && <div className="header-right">{rightChildren || null}</div>}
    </div>
  )
}

function AssetsSubTitle(props: IAssetsHeaderProps) {
  return <div className="text-xl text-text_color_01 font-medium">{props.children}</div>
}

export { AssetsHeader, AssetsSubTitle }
