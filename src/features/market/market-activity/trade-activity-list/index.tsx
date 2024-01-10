import Icon from '@/components/icon'
import { useEffect } from 'react'
import { getMarketActivities, addMarketActivitiesStatistics } from '@/apis/market/market-activity'
import { useMarketStore } from '@/store/market'
import LazyImage from '@/components/lazy-image'
import { t } from '@lingui/macro'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { formatDate } from '@/helper/date'
import { useLockFn, useRequest, useSafeState } from 'ahooks'
import { TopMoversColorTypeEnum, TopMoversDataTypeEnum } from '@/constants/market/market-activity'
import { useGetWsMarketActivity } from '@/hooks/features/market/activity'
import { Spin } from '@nbit/arco'
import { YapiGetV1MarketMarketActivitiesListData } from '@/typings/yapi/MarketMarketActivitiesV1GetApi'
import { convertToMillions } from '@/helper/market'
import styles from './index.module.css'

export function TradeActivityList() {
  const marketState = useMarketStore()

  const { symbolName } = marketState.currentCoin
  const [list, setList] = useSafeState<YapiGetV1MarketMarketActivitiesListData[]>([])
  const [loading, setLoading] = useSafeState<boolean>(false)

  /**
   * 行情异动行为统计和跳转 1 分钟 k 线页面
   */
  const toLinkKline = useLockFn(async (id, time) => {
    const params = {
      marketActivitiesId: id,
    }
    addMarketActivitiesStatistics(params)
    // 跳 1 分钟 k 线
    marketState.updateMarketChangesTime(time)
  })

  const { run: initData } = useRequest(
    async () => {
      // 未拿到币对 id 时不调接口
      if (!marketState.currentCoin.id) return

      setLoading(true)
      const res = await getMarketActivities({ symbol: symbolName, limit: '20' })
      const { isOk, data } = res || {}

      if (isOk && data) {
        setList(data)
      }
      setLoading(false)
    },
    { debounceWait: 300, manual: true }
  )

  useEffect(() => {
    initData()
  }, [marketState.currentCoin.id])

  /** ws 回调 */
  const marketActivityWSCallBack = async (data: any) => {
    // 先考虑覆盖式更新，后续考虑增量覆盖
    data = data[0]
    // 前后端约定有数据更新时，重调接口
    initData()
  }
  // websocket 行情异动推送
  useGetWsMarketActivity({ wsCallBack: marketActivityWSCallBack })

  return (
    <div className={styles.scoped}>
      <div className="trade-activity-list scrollbar-custom">
        <div className="activity-table-header">
          <div>{t`features_market_market_activity_activity_latest_marquee_index_5101556`}</div>
          <div>{t`features_market_market_activity_activity_time_axis_index_5101212`}</div>
          <div>{t`order.columns.date`}</div>
        </div>

        <Spin loading={loading}>
          <div className="activity-table-body">
            {!loading && list.length === 0 && (
              <div className="activity-note-date">
                <LazyImage
                  hasTheme
                  imageName={t`features_help_center_support_search_index_2755`}
                  className="suppor-lazy-image"
                  src={`${oss_svg_image_domain_address}no_data`}
                />
              </div>
            )}
            {list.length > 0 &&
              list.map(item => {
                const textColor =
                  +item.colorType === +TopMoversColorTypeEnum.up ? 'var(--buy_up_color)' : 'var(--sell_down_color)'
                return (
                  <div key={item.id} className="activity-table-tr" onClick={() => toLinkKline(item.id, item.time)}>
                    <div className="item-name" style={{ color: textColor }}>
                      <LazyImage className="mr-1" src={item.icon} width={14} height={14} />
                      <div className="title">{item.title || '--'}</div>
                    </div>
                    <div className="item-value" style={{ color: textColor }}>
                      {item.dataType === TopMoversDataTypeEnum.orderQuantity
                        ? convertToMillions(item.value, false) || '--'
                        : item.value || '--'}
                    </div>
                    <div className="item-operation">
                      <div className="item-time">{formatDate(item.time, 'MM-DD HH:mm')}</div>
                      <Icon name="change_positioning" className="ml-1" />
                    </div>
                  </div>
                )
              })}
          </div>
        </Spin>
      </div>
    </div>
  )
}
