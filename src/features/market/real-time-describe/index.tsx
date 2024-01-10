import { memo, useEffect, useState } from 'react'
import { t } from '@lingui/macro'
import classNames from 'classnames'
import { baseMarketStore, useMarketStore } from '@/store/market'
import Icon from '@/components/icon'
import { getTradePairCoinExt } from '@/apis/market'
import { calcCoinDescribePrice, calcCoinDescribeTime, getCoinRemarks } from '@/helper/market'
import { formatDate } from '@/helper/date'
import { Popover, Spin, Tooltip } from '@nbit/arco'
import { baseContractMarketStore, useContractMarketStore } from '@/store/market/contract'

import { KLineChartType } from '@nbit/chart-utils'
import { rateFilter } from '@/helper/assets'
import Styles from './index.module.css'

interface RealTimeDescribeProps {
  type: KLineChartType
}

const checkValue = (key, value) => {
  return key === null ? null : value
}

function RealTimeDescribe(props: RealTimeDescribeProps) {
  let currentModule
  const marketState = useMarketStore()
  const contractMarketState = useContractMarketStore()

  if (props.type === KLineChartType.Quote) {
    currentModule = marketState
  } else {
    currentModule = contractMarketState
  }

  const [expand, setExpand] = useState<boolean>(false)

  /** 获取币种概况接口 */
  const getDescribeData = param => {
    const params = props.type === KLineChartType.Quote ? { coinId: param } : { coinName: param }
    getTradePairCoinExt(params).then(res => {
      if (res.isOk) {
        currentModule.updateCurrentCoinDescribe(res.data)
      }
    })
  }

  useEffect(() => {
    let baseCurrentModule

    const baseMarketState = baseMarketStore.getState()
    const baseContractMarketState = baseContractMarketStore.getState()
    if (props.type === KLineChartType.Quote) {
      baseCurrentModule = baseMarketState
    } else {
      baseCurrentModule = baseContractMarketState
    }
    if (!baseCurrentModule.currentCoin.tradeId) {
      return
    }
    if (baseCurrentModule.currentCoin.tradeId) {
      getDescribeData(
        props.type === KLineChartType.Quote
          ? baseCurrentModule.currentCoin.sellCoinId
          : baseContractMarketState.currentCoin.baseSymbolName
      )
    }
  }, [currentModule.currentCoin.tradeId])

  if (!currentModule.describe.id || !currentModule.currentCoin.tradeId) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spin />
      </div>
    )
  }

  const describeListData = [
    {
      key: '0',
      value: checkValue(
        currentModule.describe.circulatingSupply,
        rateFilter({
          amount: calcCoinDescribePrice(currentModule.describe.circulatingSupply, currentModule.currentCoin.last),
          symbol: currentModule.currentCoin.quoteSymbolName,
        })
      ),
      title: t`store_market_market_list_spotmarkets_columnschema_2430`,
      notice: t`features_market_real_time_describe_index_2603`,
    },
    {
      key: '1',
      value: checkValue(currentModule.describe.favouritePercent, `${currentModule.describe.favouritePercent}%`),
      title: t`features_market_real_time_describe_index_2564`,
      notice: t`features_market_real_time_describe_index_2604`,
    },
    {
      key: '2',
      value: checkValue(
        currentModule.describe.highest,
        calcCoinDescribeTime(
          rateFilter({
            amount: currentModule.describe.highest,
            symbol: currentModule.currentCoin.quoteSymbolName,
          }),
          currentModule.describe.highestTime
        )
      ),
      title: t`features_market_real_time_describe_index_2565`,
      notice: t`features_market_real_time_describe_index_2605`,
    },
    {
      key: '3',
      value: checkValue(
        currentModule.describe.lowest,
        calcCoinDescribeTime(
          rateFilter({
            amount: currentModule.describe.lowest,
            symbol: currentModule.currentCoin.quoteSymbolName,
          }),
          currentModule.describe.lowestTime
        )
      ),
      title: t`features_market_real_time_describe_index_2566`,
      notice: t`features_market_real_time_describe_index_2605`,
    },
    {
      key: '4',
      value: checkValue(currentModule.describe.startTime, formatDate(currentModule.describe.startTime, 'YYYY/MM/DD')),
      title: t`features_market_real_time_describe_index_2567`,
      notice: t`features_market_real_time_describe_index_2606`,
    },
    {
      key: '5',
      value: checkValue(currentModule.describe.publicChain, currentModule.describe.publicChain),
      title: t`features_market_real_time_describe_index_2568`,
      notice: t`features_market_real_time_describe_index_2607`,
    },
    {
      key: '6',
      value: checkValue(
        currentModule.describe.startPrice,
        rateFilter({
          amount: currentModule.describe.startPrice,
          symbol: currentModule.currentCoin.quoteSymbolName,
          precision: 4,
        })
      ),
      title: t`features_market_real_time_describe_index_2569`,
      notice: t`features_market_real_time_describe_index_2568`,
    },
    {
      key: '7',
      value: checkValue(
        currentModule.describe.maxSupply,
        `${currentModule.describe.maxSupply} ${currentModule.describe.publicChain}`
      ),
      title: t`features_market_real_time_describe_index_2570`,
      notice: t`features_market_real_time_describe_index_2608`,
    },
    {
      key: '8',
      value: checkValue(
        currentModule.describe.maxSupply,
        rateFilter({
          amount: calcCoinDescribePrice(currentModule.describe.maxSupply, currentModule.currentCoin.last),
          symbol: currentModule.currentCoin.quoteSymbolName,
        })
      ),
      title: t`features_market_real_time_describe_index_2571`,
      notice: t`features_market_real_time_describe_index_2609`,
    },
    {
      key: '9',
      value: checkValue(
        currentModule.describe.circulatingSupply,
        `${currentModule.describe.circulatingSupply} ${currentModule.describe.publicChain}`
      ),
      title: t`features_market_real_time_describe_index_2572`,
      notice: t`features_market_real_time_describe_index_2610`,
    },
    {
      key: '10',
      value: checkValue(
        currentModule.describe.circulatingSupply,
        rateFilter({
          amount: calcCoinDescribePrice(currentModule.describe.circulatingSupply, currentModule.currentCoin.last),
          symbol: currentModule.currentCoin.quoteSymbolName,
        })
      ),
      title: t`features_market_real_time_describe_index_2573`,
      notice: t`features_market_real_time_describe_index_2603`,
    },
    {
      key: '11',
      value: checkValue(currentModule.describe.circulatingPercent, `${currentModule.describe.circulatingPercent}%`),
      title: t`features_market_real_time_describe_index_2574`,
      notice: t`features_market_real_time_describe_index_2611`,
    },
  ]

  const linkData = [
    {
      key: 'officialUrl',
      value: currentModule.describe.officialUrl,
      title: t`quote.common.official_website`,
      icon: 'official_website',
    },
    {
      key: 'whitePaper',
      value: currentModule.describe.whitePaper,
      title: t`quote.common.white_paper`,
      icon: 'white_paper',
    },
    {
      key: 'explorerAddressUrl',
      value: currentModule.describe.explorerAddressUrl,
      title: t`features_market_real_time_describe_index_2575`,
      icon: 'blockchain',
    },
  ]

  const expandOrHide = () => {
    setExpand(!expand)
  }

  return (
    <div className={Styles.scoped}>
      <div className="quote-wrap">
        <div className="title coin-name">
          <img className="img" src={currentModule.describe.appLogo} alt="" />
          <span>{currentModule.describe.shortName}</span>
          <span className="en-name sub-title">{currentModule.describe.fullName}</span>
        </div>
        <div className="row-wrap">
          <div className="des-wrap">
            <div className="info">
              <p className="title des-title">
                {t`features_market_real_time_describe_index_2577`}
                <span className="ml-2">{currentModule.describe.shortName}</span>
              </p>
              <div
                dangerouslySetInnerHTML={{
                  __html: getCoinRemarks(currentModule.describe.coinRemarks, expand),
                }}
                className="des sub-title"
              ></div>
              {currentModule.describe.coinRemarks?.length > 100 ? (
                <span onClick={expandOrHide} className="expand-or-hide">
                  {expand
                    ? t`features_market_market_sector_details_index_2761`
                    : t`features_market_market_sector_details_index_2535`}
                </span>
              ) : null}
            </div>
            <div className="title web-link">{t`features_market_real_time_describe_index_2576`}</div>
            <div>
              {linkData.map(item => {
                if (!item.value) {
                  return null
                }
                return (
                  <div className="link" key={item.key}>
                    <a href={item.value} target="_blank">
                      <Icon className="icon" hasTheme name={item.icon} />
                      <span className="text-brand_color ml-2">{item.title}</span>
                    </a>
                  </div>
                )
              })}
            </div>
          </div>
          <div>
            <div className="title base-info">{t`features_market_real_time_describe_index_2578`}</div>
            <div className="price-wrap">
              {describeListData.map(item => {
                if (!item.value) {
                  return null
                }
                return (
                  <div className={classNames('pop-row', 'row-line')} key={item.key}>
                    <Tooltip mini content={item.notice}>
                      <span className="text-text_color_02  info-border cursor-pointer">{item.title}</span>
                    </Tooltip>
                    <span className={'not-link'}>{item.value}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(RealTimeDescribe)
