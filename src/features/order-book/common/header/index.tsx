import { Dispatch, SetStateAction, useState } from 'react'
import { Tooltip, Button, Select } from '@nbit/arco'
import { t } from '@lingui/macro'
import { OrderBookButtonTypeEnum } from '@/store/order-book/common'
import { useUserStore } from '@/store/user'
import { UserUpsAndDownsColorEnum } from '@/constants/user'
import Icon from '@/components/icon'
import styles from './index.module.css'

const Option = Select.Option

interface OrderBookHeaderProps {
  mode: number
  mergeDepth: string
  depthOffset: Array<string>
  onMergeDepth: Dispatch<SetStateAction<string>>
  checkeStatus: Dispatch<SetStateAction<number>>
}

function TradeOrderBookHeader({ mode, mergeDepth, depthOffset, checkeStatus, onMergeDepth }: OrderBookHeaderProps) {
  const [selectShow, setSelectShow] = useState<boolean>(false)
  const mergeDepthOptions = [...depthOffset].reverse()

  const { personalCenterSettings } = useUserStore()
  const isGreenUpRedDown = personalCenterSettings?.colors === UserUpsAndDownsColorEnum.greenUpRedDown

  const handicapModeList = [
    {
      key: 1,
      content: t`OrderBook`,
      primaryIcon: <Icon name={isGreenUpRedDown ? 'buy_and_sell_orders' : 'sell_and_buy_orders'} hasTheme />,
      activeIcon: <Icon name={isGreenUpRedDown ? 'buy_and_sell_orders_un' : 'sell_and_buy_orders_un'} hasTheme />,
      status: OrderBookButtonTypeEnum.primary,
    },
    {
      key: 2,
      content: t`BuyOrder`,
      primaryIcon: <Icon name={isGreenUpRedDown ? 'buy_order' : 'sell_order'} hasTheme />,
      activeIcon: <Icon name={isGreenUpRedDown ? 'buy_order_un' : 'sell_order_un'} hasTheme />,
      status: OrderBookButtonTypeEnum.buy,
    },
    {
      key: 3,
      content: t`SellOrder`,
      primaryIcon: <Icon name={isGreenUpRedDown ? 'sell_order' : 'buy_order'} hasTheme />,
      activeIcon: <Icon name={isGreenUpRedDown ? 'sell_order_un' : 'buy_order_un'} hasTheme />,
      status: OrderBookButtonTypeEnum.sell,
    },
  ]

  return (
    <div className={`trade-order-book-header ${styles.scoped}`}>
      <div className="buy-sell-btn">
        {handicapModeList.map(v => (
          <Tooltip position="tl" trigger="hover" content={v.content} key={v.key}>
            <Button type="text" onClick={() => checkeStatus(v.status)}>
              {mode === v.status ? v.primaryIcon : v.activeIcon}
            </Button>
          </Tooltip>
        ))}
      </div>

      <div className="tick">
        <div className="tick-wrap">
          <Select
            value={mergeDepth}
            bordered={false}
            triggerProps={{
              autoAlignPopupWidth: false,
              autoAlignPopupMinWidth: true,
              position: 'bl',
            }}
            suffixIcon={selectShow ? <Icon name="arrow_close" hasTheme /> : <Icon name="arrow_open" hasTheme />}
            onVisibleChange={setSelectShow}
            onChange={onMergeDepth}
          >
            {mergeDepthOptions.map(option => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </div>

        {/* <div className="overlay">
          <Popover position="bottom" content={<Checkbox>{t`DisplayAvgSum`}</Checkbox>}>
            <IconMoreVertical />
          </Popover>
        </div> */}
      </div>
    </div>
  )
}

export default TradeOrderBookHeader
