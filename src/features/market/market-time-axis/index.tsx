import { Timeline } from '@nbit/arco'
import Icon from '@/components/icon'
import { t } from '@lingui/macro'
import { IncreaseTag } from '@nbit/react'
import styles from './index.module.css'

const TimelineItem = Timeline.Item

export function MarketTimeAxis() {
  /** 测试数据* */
  const arr = [
    { label: '2017-03-10', text: 'BTC/USDT', id: '1', price: '22000 = ¥22000', status: '+0.22%' },
    { label: '2018-05-12', text: 'BTC/USDT', id: '2', price: '22000 = ¥22000', status: '+0.22%' },
    { label: '2020-09-30', text: 'BTC/USDT', id: '3', price: '22000 = ¥22000', status: '+0.22%' },
    { label: '2021-09-30', text: 'BTC/USDT', id: '4', price: '22000 = ¥22000', status: '+0.22%' },
    { label: '2022-09-30', text: 'BTC/USDT', id: '5', price: '22000 = ¥22000', status: '+0.22%' },
  ]
  return (
    <div className={styles.scoped}>
      <div className="market-time-axis">
        <label>{t`features_market_market_time_axis_index_2523`}</label>
      </div>
      <div className="market-axis-timeline">
        <Timeline>
          {arr.map(item => {
            return (
              <TimelineItem key={item.id} className="market-axis-item">
                <div className="axis-item-content">
                  <div className="axis-item-name">{item.text}</div>
                  <div className="axis-item-price">{item.price}</div>
                  <div className={`axis-item-status`}>
                    <IncreaseTag hasPostfix value={item.status} />
                  </div>
                  <div className="axis-item-operation">
                    <div className="item-operation-text">{t`features_market_market_time_axis_index_2524`}</div>
                    <Icon name="next_arrow" hasTheme />
                  </div>
                </div>
              </TimelineItem>
            )
          })}
        </Timeline>
      </div>
    </div>
  )
}
