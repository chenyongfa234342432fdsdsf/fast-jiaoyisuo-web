import { t } from '@lingui/macro'
import { useState, useEffect } from 'react'
import Link from '@/components/link'
import { AssetsTradeListResp, TradeListFuturesResp, TradeListSpotResp } from '@/typings/api/assets/assets'
import { getTradeList } from '@/apis/assets/common'
import { formatTradePair } from '@/helper/market'
import { CommonTradePairDataWithMarketCap } from '@/typings/api/market/market-list'
import {
  useWsFuturesMarketTradePairRealTime,
  useWsSpotMarketTradePairRealTime,
} from '@/hooks/features/market/common/market-ws/use-ws-market-trade-pair'
import { getTradeCoinTypeEnumName } from '@/constants/assets/trade'
import styles from './index.module.css'

// 交易列表类型
export enum TradeListTypeEnum {
  /** 现货 */
  spot = 'spot',
  /** 永续合约 */
  perpetual = 'perpetual',
}

function RenderTradePairs({ item, type }: { item: TradeListSpotResp & TradeListFuturesResp; type: TradeListTypeEnum }) {
  let tradeUrl = `/trade/${item.symbolName}`
  let symbolName = `${item.baseSymbolName}/${item.quoteSymbolName}`
  if (type === TradeListTypeEnum.perpetual) {
    tradeUrl = `/futures/${item.symbolName}`
    symbolName = `${item.baseSymbolName}${item.quoteSymbolName} ${getTradeCoinTypeEnumName(item?.typeInd as any)}`
  }
  return (
    <Link href={tradeUrl} className="trade-item" key={item.id}>
      <div className="name">
        <span>{symbolName}</span>
      </div>
      <div className="price-container">
        <span className="price-num">
          {formatTradePair(item as CommonTradePairDataWithMarketCap).lastWithDiffTarget()}
        </span>
        {formatTradePair(item as CommonTradePairDataWithMarketCap).chg()}
      </div>
    </Link>
  )
}
interface ITradePairProps {
  coinId?: string
}
/** 交易币对行情信息 */
export function TradePair(props: ITradePairProps) {
  const { coinId } = props
  const [tradeList, setTradeList] = useState<AssetsTradeListResp>()
  const spotData = useWsSpotMarketTradePairRealTime({ apiData: tradeList?.spot })
  const perpetualWsData = useWsFuturesMarketTradePairRealTime({ apiData: tradeList?.perpetual })

  /**
   * 查询交易对列表
   */
  const onLoadTradeList = async (_coinId?: string) => {
    const res = await getTradeList({
      sellCoinId: _coinId,
    })

    const { isOk, data = {}, message = t`features_assets_main_assets_detail_trade_pair_index_2562` } = res || {}

    if (!isOk) {
      return
    }

    data && setTradeList(data)
  }

  useEffect(() => {
    if (!coinId) return
    onLoadTradeList(coinId)
  }, [coinId])

  if ((!spotData || !spotData.length) && (!perpetualWsData || !perpetualWsData.length)) return null

  return (
    <div className={styles['trade-wrapper']}>
      <div className="trade-title">{t`assets.coin.trade.go_to_trade`}</div>
      <div className="trade-list">
        {spotData.map(item => (
          <RenderTradePairs item={item} key={`spot_${item.id}`} type={TradeListTypeEnum.spot} />
        ))}
        {perpetualWsData.map(item => (
          <RenderTradePairs item={item} key={`futures_${item.id}`} type={TradeListTypeEnum.perpetual} />
        ))}
      </div>
    </div>
  )
}
