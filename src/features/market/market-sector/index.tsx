import { useState } from 'react'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { Tooltip } from '@nbit/arco'
import { link } from '@/helper/link'
import SectorGainers from '@/features/market/market-sector/component/sector-gainers'
import SectorHotGainers from '@/features/market/market-sector/component/sector-hot-gainers'
import useWsMarketSectorAllConceptList from '@/hooks/features/market/sector/use-ws-market-sector-all-concept-list'
import { MarketListRouteEnum } from '@/constants/market/market-list'
import { marketSectorHandleHotData } from '@/helper/market/sector'
import styles from './index.module.css'

const tooltipText = () => t`features_market_market_sector_index_9wd0wnowphuw9yjugjju7`
const boydButton = () => [
  { id: 0, text: t`features_market_market_sector_index_2525` },
  { id: 1, text: t`features_market_market_sector_index_2526` },
]

function MarketSector() {
  const { data } = useWsMarketSectorAllConceptList({ apiParams: {} }) || []
  const hotData = marketSectorHandleHotData(data)
  const [gainersId, setGainersId] = useState<number>(0)

  const onMore = () => {
    link(MarketListRouteEnum.sectorTable)
  }

  /** 点击热力图* */
  const onChangeTreeMap = v => {
    link(`/markets/details/${v.id}`)
  }

  /** 点击领跌涨板块* */
  const onChangeGainers = v => {
    link(`/markets/details/${v.id}`)
  }

  return (
    <div className={styles.scoped}>
      <div className="sector-header">
        <div className="header-top">
          <div className="header-left">
            <label>{t`features_market_market_sector_index_2527`}</label>
            <Tooltip position="bl" trigger="click" content={tooltipText()}>
              <div className="icon-box">
                <Icon name="msg" />
              </div>
            </Tooltip>
          </div>
          <div className="header-right" onClick={onMore}>
            <span>{t`features_market_market_sector_index_2760`}</span>
            <Icon name={'next_arrow'} hasTheme />
          </div>
        </div>
        <SectorHotGainers data={hotData || []} onChange={onChangeTreeMap} />
      </div>
      <div className="sector-body">
        <div className="sector-body-box">
          <div className="body-top">
            {boydButton().map(item => {
              return (
                <div
                  key={item.id}
                  onClick={() => setGainersId(item.id)}
                  className={`${gainersId === item.id ? 'body-bgcolor' : ''} body-text`}
                >
                  {item.text}
                </div>
              )
            })}
          </div>
          <div className="body-top-button" onClick={onMore}>
            <span>{t`features_market_market_sector_index_2760`}</span>
            <Icon name={'next_arrow'} hasTheme />
          </div>
        </div>
        <SectorGainers data={data} statsId={gainersId} onChange={onChangeGainers} />
      </div>
    </div>
  )
}
export default MarketSector
