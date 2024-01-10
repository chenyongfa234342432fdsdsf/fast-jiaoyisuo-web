import TradeInputNumber from '@/features/trade/trade-input-number'
import { Message, Modal, Slider, Tooltip } from '@nbit/arco'
import { decimalUtils } from '@nbit/utils'
import { useState } from 'react'
import { useMount } from 'react-use'
import { useRequest } from 'ahooks'
import { modifyFutureOrderMargin } from '@/apis/order'
import { t } from '@lingui/macro'
import { calcPercent } from '@/helper/order/future'
import { useContractPreferencesStore } from '@/store/user/contract-preferences'
import { formatCurrency, formatNumberDecimal } from '@/helper/decimal'
import { IFutureOrderItem } from '@/typings/api/order'
import { TradeFuturesOrderAssetsTypesEnum } from '@/constants/trade'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import Decimal from 'decimal.js'
import { UserMarginSourceEnum } from '@/constants/user'
import Icon from '@/components/icon'
import styles from './extra-margin.module.css'
import baseStyles from './base.module.css'

const SafeCalcUtil = decimalUtils.SafeCalcUtil

export type IFutureOrderModifyExtraMarginProps = {
  id: any
  visible: boolean
  setVisible: (visible: boolean) => void
  order: IFutureOrderItem
}
function formatTooltip(val) {
  return <span>{val}%</span>
}

export function FutureOrderModifyExtraMargin({ visible, order, id, setVisible }: IFutureOrderModifyExtraMarginProps) {
  const [margin, setMargin] = useState(order?.totalMargin)
  const { userAssetsFutures } = useAssetsFuturesStore()
  const initMargin = order.totalMargin
  const allMargin = Number(formatNumberDecimal(userAssetsFutures.availableBalanceValue, 2, false, true))
  const sliderAll = Number(formatNumberDecimal(SafeCalcUtil.sub(allMargin, order.initMargin), 2, false, true))
  let originPercent = calcPercent(order.totalMargin, allMargin)
  originPercent = originPercent < 1 ? 1 : parseInt(originPercent.toString())
  const percent = calcPercent(SafeCalcUtil.sub(margin, order.initMargin), sliderAll)
  const onPercentChange = (value: number) => {
    setMargin(
      formatNumberDecimal(SafeCalcUtil.mul(sliderAll, value).div(100).add(order.initMargin), 2, false, true).toString()
    )
  }
  // 账户资产作为额外保证金模式无法修改
  const {
    contractPreference: { marginSource },
  } = useContractPreferencesStore()
  // const canModify = order.marginType === TradeFuturesOrderAssetsTypesEnum.assets
  const canModify = marginSource === UserMarginSourceEnum.wallet
  useMount(() => {
    if (!canModify) {
      Message.info(t`features_orders_details_extra_margin_5101362`)
      setVisible(false)
    }
  })
  const { run, loading } = useRequest(
    async () => {
      if (Number(margin) > allMargin) {
        Message.error(t`features_orders_details_extra_margin_5101363`)
        return
      }
      if (Number(margin) < Number(order.initMargin)) {
        Message.error(t`features_orders_details_extra_margin_j4crvrarmn6x2bd72tjfz`)
        return
      }
      const res = await modifyFutureOrderMargin({
        id,
        margin: SafeCalcUtil.sub(margin, order.initMargin).toFixed(2),
      })
      setVisible(false)
      if (res.isOk) {
        Message.success(t`features_orders_details_extra_margin_5101364`)
      }
    },
    {
      manual: true,
    }
  )

  return (
    <Modal
      wrapClassName={baseStyles['modal-wrapper']}
      visible={canModify && visible}
      autoFocus={false}
      onCancel={() => setVisible(false)}
      title={t`features_orders_details_extra_margin_5101365`}
      onOk={run}
      okButtonProps={{
        loading,
        disabled: Number(margin) < Number(order.initMargin),
      }}
      closeIcon={<Icon className="text-xl translate-y-1" name="close" hasTheme />}
    >
      <div className={styles['extra-margin-wrapper']}>
        <div className="flex justify-between mb-4">
          <div className="flex text-text_color_02">
            {t`features_orders_details_extra_margin_5101366`}
            <Tooltip
              triggerProps={{
                getPopupContainer: () => document.body,
              }}
              trigger="hover"
              content={t`features_orders_details_extra_margin_bgnt9wd4ouu2mjpsv7_75`}
            >
              <div className="ml-1">
                <Icon name="msg" />
              </div>
            </Tooltip>
          </div>
          <span>
            {initMargin} {order.quoteCoinShortName} ≈ {originPercent}%
          </span>
        </div>
        <div className="mb-4">
          <div className="text-text_color_02 mb-2">{t`features_orders_details_extra_margin_5101367`}</div>
          <div className="bg-bg_color">
            <TradeInputNumber
              min={Number(order.initMargin)}
              max={allMargin}
              value={margin}
              suffix="USD"
              onChange={setMargin as any}
            />
          </div>
        </div>
        <div className="text-text_color_02 mb-4">{t`features_orders_details_extra_margin_v7a0lbgrzl0fujyy7r5zv`}</div>
        <Slider
          className="slider-wrapper"
          marks={{
            0: formatCurrency(order.initMargin, 2),
            100: formatCurrency(allMargin, 2),
          }}
          value={percent}
          formatTooltip={formatTooltip}
          onChange={onPercentChange as any}
        />
      </div>
    </Modal>
  )
}
