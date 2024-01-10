import { t } from '@lingui/macro'
import { useMarketStore } from '@/store/market'
import { useContractMarketStore } from '@/store/market/contract'
import { getMarketTrades, getPageHistory } from '@/apis/trade'
import { getFutureMarketTrades } from '@/apis/future/common'
import spotWs from '@/plugins/ws'
import futureWs from '@/plugins/ws/futures'

const useTradeDeal = () => {
  const tradeDeal = [
    { title: t`features/trade/trade-list/base-0`, id: 'latestTransaction' },
    { title: t`features_trade_trade_deal_tradedeal_5101192`, id: 'realTimeTransaction' },
    { title: t`features_market_market_time_axis_index_2523`, id: 'marketActivities' },
  ]

  return { tradeDeal }
}

type DealTableList = {
  time: string
  price: number
  qty: string
  id: number
  showtime: string
  show: boolean
  direction: number
}

const subObj = {
  futures: {
    requestSubs: {
      biz: 'perpetual',
      type: 'perpetual_deal',
      contractCode: 'BTCUSDT',
    },
    myType: 'perpetual_mine_deal',
    getStore: useContractMarketStore,
    request: {
      latestTransaction: getFutureMarketTrades,
    },
    ws: futureWs,
  },
  trade: {
    requestSubs: {
      biz: 'spot',
      type: 'deal',
      contractCode: 'BTCUSDT',
    },
    myType: 'mine_deal',
    getStore: useMarketStore,
    request: {
      latestTransaction: getMarketTrades,
      myTransaction: getPageHistory,
    },
    ws: spotWs,
  },
}

const setChangeSubs = pathname => {
  const pathnameArr = pathname?.split('/')

  const biz = pathnameArr?.[pathnameArr.length - 2]
  return subObj[biz]
}

type SubsType = {
  biz: string
  type: string
  contractCode: string
  userId?: string
}

type SubscribeList = {
  subs: SubsType
  callback: (e: DealTableList[]) => void
}

type RequestTimeNode = {
  beginDate?: number
  endDate?: number
  offset: number
  pullSize: number
  tradeId?: number
}

enum Direction {
  Buy = 1,
  Sell = 2,
}

/**
 默认 tr 高度
 */
const tableTrHeight = 22

export {
  DealTableList,
  SubsType,
  SubscribeList,
  RequestTimeNode,
  Direction,
  useTradeDeal,
  tableTrHeight,
  setChangeSubs,
}
