import { link } from '@/helper/link'
import { MarketListRouteEnum } from '@/constants/market/market-list'
import { useMarketListStore } from '@/store/market/market-list'
import { SectorCategoryEnum } from '@/helper/market/sector'
import { KLineChartType } from '@nbit/chart-utils'
import { useState } from 'react'
import C2cMaSimpleModal from '@/features/c2c/trade/merchant-apply/common/simple-modal'
import Icon from '@/components/icon'
import { t } from '@lingui/macro'
import styles from './index.module.css'

export function MarketSectorBadage({ coinData, type }) {
  const store = useMarketListStore().sectorDetails
  const list = coinData.conceptList || []
  const firstSector = list[0] || ''
  const [visiable, setVisiable] = useState<boolean>(false)

  const onBadageClick = item => {
    type === KLineChartType.Futures
      ? store.setSelectedTab(SectorCategoryEnum.futures)
      : store.setSelectedTab(SectorCategoryEnum.spot)
    link(`${MarketListRouteEnum.sectorDetails}/${item.id}`)
  }

  const toggleVisiable = (isVisiable: boolean) => {
    setVisiable(isVisiable)
  }

  if (!firstSector) return null

  if (list.length === 1) {
    return (
      <div className={`${styles.scoped} wrapper`}>
        <div className="badage" onClick={() => onBadageClick(firstSector)}>
          {firstSector.name}
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.scoped} wrapper`}>
      <div className="flex items-center name-with-icon">
        <div className="badage" onClick={() => toggleVisiable(true)}>
          {firstSector.name}
        </div>
        <Icon
          name="transaction_arrow_hover"
          className="next-icon"
          onClick={() => {
            toggleVisiable(true)
          }}
        />
      </div>

      <C2cMaSimpleModal
        visible={visiable}
        title={
          <span className="flex justify-between items-center title-wrapper">
            <span className="title">
              {coinData.baseSymbolName}{' '}
              {t`features_market_real_time_quote_market_sector_badage_index_zhud7qwazqsysjdrpxuii`}
            </span>
            <Icon name="close" hasTheme className="close-icon" onClick={() => toggleVisiable(false)} />
          </span>
        }
        onCancel={() => toggleVisiable(false)}
        modalClass={styles.modal}
      >
        <div className="inner-content-wrapper">
          <div className="reminder">{t`features_market_real_time_quote_market_sector_badage_index_pctvpfhof4tsx8fse2y4g`}</div>
          <div className="flex gap-2 list-wrapper">
            {list.map(item => {
              return (
                <span
                  key={item.id}
                  className="cursor-pointer item-wrapper"
                  onClick={() => {
                    onBadageClick(item)
                  }}
                >
                  {item.name}
                </span>
              )
            })}
          </div>
          <div className="actions">
            <div
              className="cursor-pointer ok-btn"
              onClick={() => {
                toggleVisiable(false)
              }}
            >{t`features_agent_apply_index_5101501`}</div>
          </div>
        </div>
      </C2cMaSimpleModal>
    </div>
  )
}
