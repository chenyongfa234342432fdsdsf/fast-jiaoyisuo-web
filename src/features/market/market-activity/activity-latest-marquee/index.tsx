import Icon from '@/components/icon'
import { useState, useEffect } from 'react'
import { getMarketActivities, addMarketActivitiesStatistics } from '@/apis/market/market-activity'
import { TopMoversColorTypeEnum, TopMoversDataTypeEnum } from '@/constants/market/market-activity'
import LazyImage from '@/components/lazy-image'
import { Carousel, Drawer } from '@nbit/arco'
import classNames from 'classnames'
import { ActivityTimeAxis } from '@/features/market/market-activity/activity-time-axis'
import { t } from '@lingui/macro'
import { useGetWsMarketActivity } from '@/hooks/features/market/activity'
import { getMarketActivitiesAllData } from '@/helper/market/activity'
import { useLockFn, useRequest } from 'ahooks'
import { YapiGetV1MarketMarketActivitiesListData } from '@/typings/yapi/MarketMarketActivitiesV1GetApi'
import { convertToMillions } from '@/helper/market'
import styles from './index.module.css'

/**
 * 用于在透明色的下面再加一层主题色，防止 sticky 条下方的内容漏出
 */
export function ActivityLatestMarqueeStickyBgEmptyWrapper() {
  return <div className={`${styles['empty-wrapper']}`}></div>
}

export function ActivityLatestMarquee() {
  const [list, setList] = useState<YapiGetV1MarketMarketActivitiesListData[]>([])
  const [visibleActivityList, setVisibleActivityList] = useState(false)

  /**
   * 行情异动行为统计和跳转 1 分钟 k 线页面
   */
  const showActivityList = useLockFn(async id => {
    const params = {
      marketActivitiesId: id,
    }
    addMarketActivitiesStatistics(params)
    setVisibleActivityList(true)
  })

  /**
   * 查询行情异动列表
   */
  const { run: initData } = useRequest(
    async () => {
      const res = await getMarketActivities({ symbol: '', limit: '5' })
      const { isOk, data } = res || {}

      if (isOk && data) {
        setList(data)
      }
    },
    { debounceWait: 300, manual: true }
  )

  useEffect(() => {
    initData()
  }, [])

  const { run: getMarketActivitiesAllDataApi } = useRequest(getMarketActivitiesAllData, {
    debounceWait: 500,
    manual: true,
  })

  /** ws 回调 */
  const marketActivityWSCallBack = async (data: any) => {
    // 先考虑覆盖式更新，后续考虑增量覆盖
    data = data[0]
    // 前后端约定有数据更新时，重调接口
    initData()
    // 更新弹框里的行情异动
    visibleActivityList && getMarketActivitiesAllDataApi()
  }

  // websocket 行情异动推送
  useGetWsMarketActivity({ wsCallBack: marketActivityWSCallBack })

  return (
    <div
      className={classNames(styles.scoped, {
        hidden: list.length <= 0,
      })}
    >
      <div className="activity-wrap-marquee">
        <Carousel direction={'vertical'} showArrow="never" indicatorType="never" autoPlay={{ interval: 3000 }}>
          {list.length > 0 &&
            list.map(coin => {
              const textColor =
                +coin.colorType === +TopMoversColorTypeEnum.up ? 'var(--buy_up_color)' : 'var(--sell_down_color)'
              return (
                <div
                  key={coin.id}
                  className="content-wrap"
                  onClick={() => {
                    showActivityList(coin.id)
                  }}
                >
                  <div className="item-name">
                    {coin.base || '--'}
                    <span className="text-text_color_02">/{coin.quote || '--'}</span>
                  </div>
                  <div className="item-price">{Number(coin.price)}</div>
                  <div className="item-value" style={{ color: textColor }}>
                    {coin.dataType === TopMoversDataTypeEnum.orderQuantity
                      ? convertToMillions(coin.value, false) || '--'
                      : coin.value || '--'}
                  </div>
                  <div className="item-operation" style={{ color: textColor }}>
                    <LazyImage className="mr-1" src={coin.icon} width={14} height={14} />
                    <div className="operation-text">{coin.title || '--'}</div>
                    <Icon name="next_arrow" hasTheme />
                  </div>
                </div>
              )
            })}
        </Carousel>
      </div>
      {visibleActivityList && (
        <Drawer
          className={styles.scoped}
          title={
            <div>
              <div className="drawer-header">
                <div style={{ textAlign: 'left' }}>{t`features_market_market_time_axis_index_2523`}</div>
                <Icon
                  name="close"
                  hasTheme
                  onClick={() => {
                    setVisibleActivityList(false)
                  }}
                  className="w-16 flex justify-end"
                />
              </div>
              <div className="content-axis-wrap activity-header">
                <div className="item-time"></div>
                <div className="item-name">{t`store_market_market_list_spotmarketstrade_columnschema_2432`}</div>
                <div className="item-price">{t`Price`}</div>
                <div className="item-value">{t`features_market_market_activity_activity_time_axis_index_5101212`}</div>
                <div className="item-operation">{t`features_market_market_activity_activity_latest_marquee_index_5101556`}</div>
              </div>
            </div>
          }
          placement="bottom"
          style={{ height: '80%', top: '20%', position: 'absolute' }}
          visible={visibleActivityList}
          footer={null}
          closable={false}
          onCancel={() => {
            setVisibleActivityList(false)
          }}
        >
          <ActivityTimeAxis />
        </Drawer>
      )}
    </div>
  )
}
