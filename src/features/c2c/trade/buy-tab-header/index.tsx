import { memo, useRef, useState } from 'react'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { Select } from '@nbit/arco'
import cn from 'classnames'
import { link } from '@/helper/link'
import style from './buytabheader.module.css'
import { GotoUrl, useBuyTabHeader } from './buytabheader'

type Props = {
  activeTab: string | undefined
}

const Option = Select.Option

function BuyHabHeader(props: Props) {
  const { activeTab } = props

  const { getMoreSelectOptions, goToSelect } = useBuyTabHeader()

  const [orderMouseObj, setOrderMouseObj] = useState<any>({})

  const refSelect = useRef<HTMLDivElement>(null)

  const navigate = link

  const gotoUrl = url => {
    navigate(url)
  }

  const setMoreSelectOptions = () => {
    return getMoreSelectOptions().flatMap(item => {
      return (
        <Option key={item.key} value={item.key} className="more-select">
          <span className="more-select-icon">{item.icon}</span>
          <span className="ml-4 font-semibold">{item.title}</span>
          <span className="next-arrow">
            <Icon name="next_arrow_two" />
          </span>
        </Option>
      )
    })
  }

  const goToObjective = e => {
    const url = goToSelect(e)
    navigate(url)
  }

  const onOrderMouseEnter = key => {
    setOrderMouseObj({ ...orderMouseObj, [key]: true })
  }

  const onOrderMouseLeave = key => {
    setOrderMouseObj({ ...orderMouseObj, [key]: false })
  }

  const getShowActiveChange = (type, name) => {
    return activeTab === type || orderMouseObj?.[name]
  }

  return (
    <div className={style.scope}>
      <div className="buy-links">
        <div
          className={cn('account-header', {
            'tab-forms-border': activeTab === 'AdsList',
          })}
          onMouseEnter={() => onOrderMouseEnter('ads')}
          onMouseLeave={() => onOrderMouseLeave('ads')}
          onClick={() => gotoUrl(GotoUrl.MyAdvertising)}
        >
          <div className="orders-detail">
            <div className="orders-detail">
              <Icon
                name={
                  getShowActiveChange('AdsList', 'ads') ? 'c2c_advertisement_sheet_hover' : 'c2c_advertisement_sheet'
                }
              />
              <span>{t`features_c2c_trade_buy_tab_header_index_v8w1gmjgif2ju3wtr1mkg`}</span>
            </div>
          </div>
        </div>
        <div
          className={cn('account-header', {
            'tab-forms-border': activeTab === 'HistoryOrders',
          })}
          onClick={() => gotoUrl(GotoUrl.OrderList)}
          onMouseEnter={() => onOrderMouseEnter('orders')}
          onMouseLeave={() => onOrderMouseLeave('orders')}
        >
          <div className="orders-detail">
            <Icon
              name={getShowActiveChange('HistoryOrders', 'orders') ? 'c2c_order_history_hover' : 'c2c_order_history'}
              className="order-history"
            />
            <span>{t`features_c2c_advertise_advertise_detail_index_oyifsrcn099n_0hhowlwb`}</span>
          </div>
        </div>
        <div
          className="more"
          onMouseEnter={() => onOrderMouseEnter('more')}
          onMouseLeave={() => onOrderMouseLeave('more')}
          ref={refSelect}
        >
          <Select
            trigger="hover"
            onChange={goToObjective}
            value={undefined}
            getPopupContainer={() => refSelect.current as Element}
            triggerElement={
              <div className="more-icon cursor-pointer">
                <Icon name={orderMouseObj?.more ? 'msg_more_hover' : 'c2c_more'} className="more-icon-msg" />
                <span className={cn('pl-1 text-button_text_01', { 'text-more': orderMouseObj?.more })}>{t`More`}</span>
              </div>
            }
          >
            {setMoreSelectOptions()}
          </Select>
        </div>
      </div>
    </div>
  )
}

export default memo(BuyHabHeader)
