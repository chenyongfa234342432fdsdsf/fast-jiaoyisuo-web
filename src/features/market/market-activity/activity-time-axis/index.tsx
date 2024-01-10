import { Timeline, Spin } from '@nbit/arco'
import Icon from '@/components/icon'
import { useState, useEffect } from 'react'
import { addMarketActivitiesStatistics } from '@/apis/market/market-activity'
import { TopMoversColorTypeEnum, TopMoversDataTypeEnum } from '@/constants/market/market-activity'
import { formatDate } from '@/helper/date'
import LazyImage from '@/components/lazy-image'
import ListEmpty from '@/components/list-empty'
import { useLockFn, useUpdateEffect } from 'ahooks'
import { link } from '@/helper/link'
import { useMarketActivityStore } from '@/store/market/activity'
import { getMarketActivitiesAllData } from '@/helper/market/activity'
import { convertToMillions } from '@/helper/market'
import { YapiGetV1MarketMarketActivitiesListData } from '@/typings/yapi/MarketMarketActivitiesV1GetApi'
import styles from './index.module.css'

const TimelineItem = Timeline.Item

export function ActivityTimeAxis() {
  const marketActivityStore = useMarketActivityStore()
  const [loading, setLoading] = useState(false)
  const list: any = marketActivityStore.marketActivityList

  /**
   * 行情异动行为统计和跳转 1 分钟 k 线页面
   */
  const toLinkKline = useLockFn(async (id, symbolName) => {
    const params = {
      marketActivitiesId: id,
    }
    await addMarketActivitiesStatistics(params)

    link(`/trade/${symbolName}`)
    return true
  })

  /**
   * 查询行情异动列表
   */
  const initData = async () => {
    setLoading(true)
    try {
      await getMarketActivitiesAllData()
    } catch (error) {
      setLoading(false)
    }
    setLoading(false)
  }
  useEffect(() => {
    initData()
  }, [])

  useUpdateEffect(() => {}, [marketActivityStore.marketActivityList])

  return (
    <div className={styles.scoped}>
      <div className="activity-wrap-axis">
        <div className="activity-timeline">
          <Spin loading={loading}>
            {list.length > 0 &&
              list.map(item => {
                return (
                  <div key={item.id}>
                    <div className="date-title">{formatDate(item.time, 'YYYY-MM-DD')}</div>

                    <Timeline>
                      {item?.subList?.length > 0 &&
                        item.subList.map(data => {
                          return (
                            <TimelineItem
                              dotColor="var(--icon_color)"
                              lineColor="var(--line_color_02)"
                              dotType="hollow"
                              key={data.id}
                              className="activity-item"
                              label={formatDate(data.time, 'HH:mm')}
                            >
                              {data?.subList?.length > 0 &&
                                data.subList.map((coin: YapiGetV1MarketMarketActivitiesListData) => {
                                  const textColor =
                                    +coin.colorType === +TopMoversColorTypeEnum.up
                                      ? 'var(--buy_up_color)'
                                      : 'var(--sell_down_color)'

                                  return (
                                    <div
                                      key={coin.id}
                                      className="content-axis-wrap items-end"
                                      onClick={() => {
                                        toLinkKline(coin.id, coin.symbol)
                                      }}
                                    >
                                      <div className="item-name">
                                        {coin.base || '--'}
                                        <span className="text-text_color_02"> / {coin.quote || '--'}</span>
                                      </div>
                                      <div className="item-price">{Number(coin.price)}</div>
                                      <div className="item-value" style={{ color: textColor }}>
                                        {coin.dataType === TopMoversDataTypeEnum.orderQuantity
                                          ? convertToMillions(coin.value, false) || '--'
                                          : coin.value || '--'}
                                      </div>
                                      <div className="item-operation" style={{ color: textColor }}>
                                        <LazyImage src={coin.icon} width={20} height={20} />
                                        <div className="operation-text">{coin.title || '--'}</div>
                                        <Icon name="next_arrow" hasTheme />
                                      </div>
                                    </div>
                                  )
                                })}
                            </TimelineItem>
                          )
                        })}
                    </Timeline>
                  </div>
                )
              })}
            {list.length === 0 && <ListEmpty loading={loading} />}
          </Spin>
        </div>
      </div>
    </div>
  )
}
