import { memo } from 'react'
import BuyTabHeader from '@/features/c2c/trade/buy-tab-header'
import { link } from '@/helper/link'
import cn from 'classnames'
import { useC2CStore } from '@/store/c2c'
import styles from './c2ctab.module.css'
import { getBuyTitleTab } from './c2ctab'

type Props = {
  children: React.ReactNode
  activeTab?: string
  showIsTop?: boolean
  className?: string
}

function C2CTab(props: Props) {
  const { children, activeTab, showIsTop = true, className } = props

  const c2cState = useC2CStore()

  const { showThirdPartyPayment } = c2cState

  const navigate = link

  const tabList = getBuyTitleTab(showThirdPartyPayment)

  const tabsChange = e => {
    navigate(e)
  }

  return (
    <div className={cn(styles.scope, className)}>
      <div
        className={cn('buy-tabs', {
          'buy-tabs-sticky': showIsTop,
        })}
      >
        <div className="default-tab-header">
          {tabList?.map(item => {
            return (
              <div
                key={item?.key}
                className={cn('account-center cursor-pointer', {
                  'order-forms-border': item?.key === activeTab,
                })}
                onClick={() => tabsChange(item?.url)}
              >
                <span>{item?.title}</span>
              </div>
            )
          })}
          <BuyTabHeader activeTab={activeTab} />
        </div>
      </div>
      {children}
    </div>
  )
}

export default memo(C2CTab)
