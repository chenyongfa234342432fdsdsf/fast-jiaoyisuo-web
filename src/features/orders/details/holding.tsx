import Tabs from '@/components/tabs'
import { FutureHoldingOrderDirectionEnum } from '@/constants/order'
import { formatNumberDecimal } from '@/helper/decimal'
import { IFutureHoldingOrderItem } from '@/typings/api/order'
import { t } from '@lingui/macro'
import { Message, Modal, Slider } from '@nbit/arco'
import { useEffect, useState } from 'react'
import Decimal from 'decimal.js'
import { calcHoldingOrderLiquidatePriceAfterModifyMargin } from '@/helper/order'
import { useSpotOrderModuleContext } from '@/features/orders/order-module-context'
import { useRequest } from 'ahooks'
import { modifyOrderMargin } from '@/apis/order'
import TradeInputNumber from '@/features/trade/trade-input-number'
import styles from './holding.module.css'

export type IFutureHoldingOrderModifyMarginProps = {
  order: IFutureHoldingOrderItem
  setVisible: (visible: boolean) => void
}
enum ModifyMarginTabEnum {
  add,
  reduce,
}
export function FutureHoldingOrderModifyMargin({ order, setVisible }: IFutureHoldingOrderModifyMarginProps) {
  const tabs = [
    {
      id: ModifyMarginTabEnum.add,
      title: t`features/orders/details/holding-0`,
    },
    {
      id: ModifyMarginTabEnum.reduce,
      title: t`features/orders/details/holding-1`,
    },
  ]
  const textValues = {
    code: `${order.indexBase.toUpperCase()}/${order.quote.toUpperCase()}`,
    direction:
      order.side === FutureHoldingOrderDirectionEnum.buy
        ? t`features/orders/details/future-3`
        : t`features/orders/details/future-4`,
  }
  const addText = t({
    id: 'features/orders/details/holding-2',
    values: textValues,
  })
  const reduceText = t({
    id: 'features/orders/details/holding-3',
    values: textValues,
  })
  const modifyAddText = t`features/orders/details/holding-4`
  const modifyReduceText = t`features/orders/details/holding-5`
  const [selectedTab, setSelectedTab] = useState(ModifyMarginTabEnum.add)
  const isAdd = selectedTab === ModifyMarginTabEnum.add
  const [margin, setMargin] = useState('')
  const [marginSlide, setMarginSlide] = useState(0)

  useEffect(() => {
    setMargin('')
    setMarginSlide(0)
  }, [selectedTab])
  // 最多减少 = 当前保证金 - 初始保证金
  const reduceNum = formatNumberDecimal(
    Decimal.sub(order.openMargin, order.frontendCalcMinMargin).toNumber(),
    order.marginDigit
  ).toString()
  const marginDigit = order.marginDigit
  const onSlideChange = (val: number) => {
    setMarginSlide(val)
    setMargin(
      formatNumberDecimal(Decimal.div(order.availableBalance, 100).times(val).toNumber(), marginDigit).toString()
    )
  }
  const onMarginChange = (val: number) => {
    let newVal = val.toString()
    if (isAdd) {
      if (Number(newVal) > Number(order.availableBalance)) {
        newVal = order.availableBalance
      }
      setMarginSlide(Decimal.div(newVal, order.availableBalance).times(100).toNumber())
    } else {
      if (Number(newVal) > Number(reduceNum)) {
        newVal = reduceNum
      }
    }
    setMargin(val.toString() === '' ? '' : newVal)
  }
  const liquidatePrice = calcHoldingOrderLiquidatePriceAfterModifyMargin(order, isAdd ? margin : `-${margin || 0}`)
  const unit = order.base.toUpperCase()
  const { refreshEvent$ } = useSpotOrderModuleContext()
  const { runAsync, loading } = useRequest(
    async () => {
      if (!margin) {
        Message.warning(t`features/orders/details/holding-6`)
        return
      }
      const res = await modifyOrderMargin({
        code: order.contractCode,
        margin: isAdd ? margin : `-${margin}`,
        side: order.side,
      })
      if (!res.isOk) {
        return
      }
      refreshEvent$.emit()
      setVisible(false)
      Message.success(t`user.field.reuse_40`)
    },
    {
      manual: true,
    }
  )
  return (
    <Modal
      maskClosable={false}
      wrapClassName={styles['stop-limit-details-modal-wrapper']}
      title={t`features/orders/details/holding-7`}
      visible
      onConfirm={runAsync}
      confirmLoading={loading}
      onCancel={() => setVisible(false)}
    >
      <div>
        <Tabs mode="button" classNames="mb-8" value={selectedTab} onChange={a => setSelectedTab(a.id)} tabList={tabs} />
        <p className="mb-3">{isAdd ? addText : reduceText}</p>
        <div>
          <TradeInputNumber
            precision={marginDigit}
            className="mb-3"
            value={margin}
            onChange={onMarginChange}
            suffix={unit}
          />
          {isAdd && (
            <>
              <Slider className="mb-3" tooltipVisible={false} value={marginSlide} onChange={onSlideChange as any} />
              <div className="flex justify-between mb-5">
                <span>0</span>
                <span>{formatNumberDecimal(Number(order.availableBalance), marginDigit)}</span>
              </div>
            </>
          )}
          {!isAdd && (
            <p>
              {t`features/orders/details/holding-8`} {reduceNum} {unit}
            </p>
          )}
          {isAdd ? modifyAddText : modifyReduceText} {liquidatePrice} {unit}
        </div>
      </div>
    </Modal>
  )
}
