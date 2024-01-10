import { t } from '@lingui/macro'
import { useState } from 'react'
import { Button } from '@nbit/arco'
import { TradeMarginEnum } from '@/constants/trade'
import { TransferAccountListEnum } from '@/constants/assets'
import { MarginAllIndex } from '@/features/assets/margin/all'
import { MarginIsolatedIndex } from '@/features/assets/margin/isolated'
import Link from '@/components/link'
// import PopupTransfer from '@/features/assets/common/transfer'
import AesstsTabs from '@/features/assets/common/assets-tabs-old'
import { usePageContext } from '@/hooks/use-page-context'
import { getDefaultTradeUrl } from '@/helper/market'
import styles from './index.module.css'

function MarginAccountIndex() {
  const pageContext = usePageContext()
  const typeId = pageContext?.urlParsed?.search?.type
  const [type, setType] = useState(typeId || TradeMarginEnum.margin)
  const [visibleTransfer, setVisibleTransfer] = useState(false) // 划转显示状态
  const [selectedCoinId, setSelectedCoinId] = useState()

  /**
   * 划转
   * @param coinId
   */
  const onTransferFn = coinId => {
    if (coinId) setSelectedCoinId(coinId)
    setVisibleTransfer(true)
  }

  const onChangeLogsType = val => {
    setType(val)
  }

  const tabList = [
    {
      title: t`constants/order-5`,
      content: <MarginAllIndex onTransferFn={onTransferFn} />,
      id: TradeMarginEnum.margin,
    },
    {
      title: t`constants/order-4`,
      content: <MarginIsolatedIndex onTransferFn={onTransferFn} />,
      id: TradeMarginEnum.isolated,
    },
  ]

  return (
    <div className={styles.scoped}>
      <div className="root">
        <div className="total-wrap">
          <div className="flex flex-col">
            <span>{t`assets.layout.menus.leverage`}</span>
          </div>
          <div className="operate-wrap">
            <Link href={`${getDefaultTradeUrl()}?type=margin`} className="opt-button-gray">
              {t`features/trade/index-4`}
            </Link>
            <Link href={`${getDefaultTradeUrl()}?type=margin`} className="opt-button-gray">
              {t`features/trade/trade-form/index-6`}
            </Link>
            <Button
              onClick={() => {
                onTransferFn(false)
              }}
              className="opt-button ml-5"
            >
              {t`features/assets/main/index-4`}
            </Button>
          </div>
        </div>
      </div>
      <AesstsTabs tabList={tabList} onChangeFn={onChangeLogsType} defaultActiveTab={type} />

      {/* {visibleTransfer && (
        <PopupTransfer
          coinId={selectedCoinId}
          accountType={
            type === TradeMarginEnum.isolated
              ? TransferAccountListEnum.marginIsolatedAccount
              : TransferAccountListEnum.marginCrossAccount
          }
          visibleTransfer={visibleTransfer}
          onCancelFn={setVisibleTransfer}
        />
      )} */}
    </div>
  )
}

export { MarginAccountIndex }
