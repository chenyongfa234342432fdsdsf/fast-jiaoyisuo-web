import { updatePositionConfigs } from '@/apis/future/common'
import Icon from '@/components/icon'
import Link from '@/components/link'
import { useCreateOrderModuleContext } from '@/features/orders/order-module-context'
import { useOrderFutureStore } from '@/store/order/future'
import { IPerpetualFuture } from '@/typings/api/future/common'
import { t } from '@lingui/macro'
import { useRequest } from 'ahooks'
import { Checkbox, Message, Modal, Tooltip } from '@nbit/arco'
import { useState } from 'react'
import { useBaseOrderSpotStore } from '@/store/order/spot'

export function useTradeOrder(label?: string) {
  const { orderSettings } = useBaseOrderSpotStore()
  const checkOnlyCurrentSymbolNode = (
    <div className="flex items-center text-text_color_02 text-xs">
      <Checkbox checked={orderSettings.showCurrentCoinOrders} onChange={orderSettings.updateShowCurrentCoinOrders}>
        {({ checked }) => {
          return checked ? <Icon name="login_verify_selected" /> : <Icon name="login_verify_unselected" hasTheme />
        }}
      </Checkbox>
      <span className="ml-1">{label || t`features_trade_trade_order_base_5101179`}</span>
    </div>
  )

  return {
    onlyCurrentSymbol: orderSettings.showCurrentCoinOrders,
    tableLayoutProps: {
      // 根据布局模式改变
      tableHeight: 130,
      onlyTable: true,
      inTrade: true,
      tableBodyFullHeight: true,
      showPagination: true,
      // 全部返回，最近一周的
      pageSize: 10,
    },
    checkOnlyCurrentSymbolNode,
  }
}

export type IViewAllOrderProps = {
  href: string
}
export function ViewAllOrder({ href }: IViewAllOrderProps) {
  return (
    <div className="flex items-center mr-4">
      <Link href={href} className="hover:text-brand_color">
        {t`features/trade/trade-order/index-0`} &gt;&gt;
      </Link>
    </div>
  )
}

type IAutoAddMarginModalProps = {
  checked: boolean
  visible: boolean
  currentFuture: IPerpetualFuture
  setVisible: (visible: boolean) => void
}
function AutoAddMarginModal({ checked, visible, setVisible, currentFuture }: IAutoAddMarginModalProps) {
  const code = `${currentFuture.indexBase?.toUpperCase()}/${currentFuture.quote?.toUpperCase()}`
  const withTypeCode = `${code} ${t`assets.enum.tradeCoinType.perpetual`}`
  const title = `${
    checked ? t`features/trade/trade-order/base-0` : t`features/trade/trade-order/base-1`
  }${withTypeCode}`
  const openText = !checked ? t`features/trade/trade-order/base-2` : t`user.common.close`
  const confirmText = t({
    id: 'features/trade/trade-order/base-3',
    values: {
      open: openText,
      code: withTypeCode,
    },
  })
  const checkboxLabel = t({
    id: 'features/trade/trade-order/base-4',
    values: {
      open: openText,
      code: `<span class="text-warning_color_animate">${withTypeCode}</span>`,
    },
  })
  const [localChecked, setLocalChecked] = useState(false)
  const { run, loading } = useRequest(
    async () => {
      const res = await updatePositionConfigs({
        contractCode: currentFuture.code,
        value: !checked ? 1 : 0,
        type: 1,
      })
      if (!res.isOk) {
        return
      }
      Message.success(openText + t`assets.enum.tradeRecordStatus.success`)
      // TODO: 更新配置
    },
    {
      manual: true,
    }
  )

  return (
    <Modal
      okButtonProps={{
        loading,
        disabled: !localChecked,
      }}
      onOk={run}
      autoFocus={false}
      visible={visible}
      title={title}
      onCancel={() => setVisible(false)}
    >
      <div>
        {!checked && <p className="mb-4">{t`features/trade/trade-order/base-5`}</p>}
        <p className="mb-4 text-warning_color_animate font-medium">{confirmText}</p>
        <div>
          <Checkbox checked={localChecked} onChange={setLocalChecked} />
          <span className="ml-1" dangerouslySetInnerHTML={{ __html: checkboxLabel }} />
        </div>
      </div>
    </Modal>
  )
}

export function AutoAddMarginCheckBox() {
  const { currentFuture, currentFutureConfig } = useOrderFutureStore()
  const checked = currentFutureConfig.autoAddMargin === 1
  const [visible, setVisible] = useState(false)

  const onAutoAddMarginChange = () => {
    setVisible(true)
  }
  const code = `${currentFuture.indexBase?.toUpperCase()}/${currentFuture.quote?.toUpperCase()}`
  const textValues = {
    code: `${code} ${t`assets.enum.tradeCoinType.perpetual`}`,
  }
  const questionText = t({
    id: 'features/trade/trade-order/base-6',
    values: textValues,
  })
  // TODO: 含义不明，先用数字 !==
  if (currentFutureConfig.type === 1) {
    return null as any as JSX.Element
  }

  return (
    <div className="flex items-center">
      <AutoAddMarginModal checked={checked} currentFuture={currentFuture} visible={visible} setVisible={setVisible} />
      <Checkbox checked={checked} onChange={onAutoAddMarginChange} />
      <span className="ml-1">{t`features/trade/trade-order/base-7`}</span>
      <Tooltip content={questionText}>
        <Icon name="question" />
      </Tooltip>
    </div>
  )
}
