import create from 'zustand'
import produce from 'immer'
import { createTrackedSelector } from 'react-tracked'
import {
  MarketCoinTab,
  totalShareTimeList,
  initialShareTimeList,
  restShareTimeList,
  initCurrentCoin,
  defaultCoinFixedInfo,
  initDescribe,
} from '@/constants/market'
import { YapiGetV1TradePairListData } from '@/typings/yapi/TradePairListV1GetApi'
import { uniqBy } from 'lodash'
import { getTradePairHistoryQuickSelectCache, setTradePairHistoryQuickSelectCache } from '@/helper/cache'
import { YapiGetV1CoinQueryMainCoinListCoinListData } from '@/typings/yapi/CoinQueryMainCoinListV1GetApi'
import { wsSpotMarketCommonSub, wsSpotTradePairSubSlow } from '@/helper/market/market-list/market-ws'

type IStore = ReturnType<typeof getStore>
export type IMarketSpotStore = IStore

function getStore(set, get) {
  return {
    storeName: 'spot',
    marketChangesTime: 0,
    updateMarketChangesTime: newMarketChangesTime => set(() => ({ marketChangesTime: newMarketChangesTime })),
    isSubscribed: false,
    setIsSubscribed: (key, val) =>
      set((store: IStore) => {
        const newStore = produce(store, _store => {
          _store.isSubscribed = val
        })
        return newStore
      }),
    totalShareTimeList,
    initialShareTimeList,
    updateInitialShareTimeList: newInitialShareTimeList =>
      set(
        produce((state: IStore) => {
          state.initialShareTimeList = newInitialShareTimeList
        })
      ),
    restShareTimeList,
    updateRestShareTimeList: newRestShareTimeList =>
      set(
        produce((state: IStore) => {
          state.restShareTimeList = newRestShareTimeList
        })
      ),
    currentMarketCoinTab: MarketCoinTab.Kline,
    updateCurrentMarketCoinTab: newCurrentMarketCoinTab =>
      set(
        produce((state: IStore) => {
          state.currentMarketCoinTab = newCurrentMarketCoinTab
        })
      ),
    currentInitPrice: {
      // 当前选中的买/卖价格
      buyPrice: '21469.55',
      sellPrice: '21469.55',
    },
    updateCurrentInitPrice: newCurrentInitPrice =>
      set(
        produce((state: IStore) => {
          state.currentInitPrice = newCurrentInitPrice
        })
      ),
    defaultCoin: defaultCoinFixedInfo,
    currentCoin: initCurrentCoin,
    updateCurrentCoin: newCurrentCoin => {
      // 统一兼容处理
      const newCoin = { ...newCurrentCoin }
      newCoin.tradeId = newCoin.id
      newCoin.change = newCoin.chg
      newCoin.sellSymbol = newCoin.baseSymbolName
      newCoin.buySymbol = newCoin.quoteSymbolName

      set(
        produce((state: IStore) => {
          state.currentCoin = newCoin
        })
      )
    },
    allTradePairs: [] as YapiGetV1TradePairListData[],
    updateAllTradePairs(data: YapiGetV1TradePairListData[]) {
      set(
        produce((state: IStore) => {
          state.allTradePairs = data
        })
      )
    },
    describe: initDescribe, // 币种资料
    updateCurrentCoinDescribe: newCurrentCoinDescribe =>
      set(
        produce((state: IStore) => {
          state.describe = newCurrentCoinDescribe
        })
      ),
    klineCallback(value) {},
    updateKlineCallback: newKlineCallback =>
      set(
        produce((state: IStore) => {
          state.klineCallback = newKlineCallback
        })
      ),
    coinHistoryKline: {
      r: '',
      t: new Date().getTime(),
    },
    updateCoinHistoryKline: newCoinHistoryKline =>
      set(
        produce((state: IStore) => {
          state.coinHistoryKline = newCoinHistoryKline
        })
      ),
    depthList: {
      asks: [['']],
      bids: [['']],
      buyOrSellCnyPrice: '',
      cny: '',
      last: '',
      open: '',
      usdtCnyPrice: 0,
    },
    updateDepthList: newDepthList =>
      set(
        produce((state: IStore) => {
          state.depthList = newDepthList
        })
      ),
    coinSelectedHistoryList: [] as YapiGetV1TradePairListData[],
    getTradePairHistoryQuickSelectCache,
    updateCoinSelectedHistoryList: (
      newTradePair: YapiGetV1TradePairListData[],
      // 是否改变历史快捷选择的位置，默认为改变
      isHistoryInPlace = false
    ) => {
      set(
        produce((state: IStore) => {
          if (
            isHistoryInPlace &&
            newTradePair.length === 1 &&
            state.coinSelectedHistoryList.find(x => x.id === newTradePair[0].id)
          ) {
            return
          }
          const latest = uniqBy([...newTradePair, ...state.coinSelectedHistoryList], x => x.id)
            .filter(x => !!x.symbolName)
            .slice(0, 10)
          state.coinSelectedHistoryList = latest
          setTradePairHistoryQuickSelectCache(latest)
        })
      )
    },
    removeCoinSelectedHistoryList: (toBeRemoved: YapiGetV1TradePairListData) => {
      set(
        produce((state: IStore) => {
          const latest = state.coinSelectedHistoryList.filter(x => x.id !== toBeRemoved.id).slice()
          state.coinSelectedHistoryList = latest
          setTradePairHistoryQuickSelectCache(latest)
        })
      )
    },
    cleanCoinSelectedHistoryList: () => {
      set(
        produce((state: IStore) => {
          state.coinSelectedHistoryList = []
          setTradePairHistoryQuickSelectCache([])
        })
      )
    },
    allCoinSymbolInfo: [] as YapiGetV1CoinQueryMainCoinListCoinListData[],
    udpateAllCoinSymbolInfo(data: YapiGetV1CoinQueryMainCoinListCoinListData[]) {
      set(
        produce((state: IStore) => {
          state.allCoinSymbolInfo = data
        })
      )
    },
    wsSubscription: wsSpotTradePairSubSlow,
  }
}

const baseMarketStore = create<IStore>(getStore)

const useMarketStore = createTrackedSelector(baseMarketStore)

export { useMarketStore, baseMarketStore }
