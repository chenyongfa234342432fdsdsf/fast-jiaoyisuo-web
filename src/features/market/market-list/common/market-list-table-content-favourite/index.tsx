import {
  MarketLisModulesEnum,
  SpotMarketBaseCurrenyEnum,
  quoteVolumneTableSorter,
} from '@/constants/market/market-list'
import {
  MarketListFuturesDefaultFavourites,
  MarketListSpotDefaultFavourites,
} from '@/features/market/market-list/market-list-active-content/market-list-spot-favourites-default'
import { useFuturesFavList, useSpotFavList } from '@/hooks/features/market/favourite'
import {
  useWsMarketFuturesUserFavListFullAmount,
  useWsMarketSpotUserFavListFullAmount,
} from '@/hooks/features/market/market-list/use-ws-market-spot-user-favourite-list'
import { useMarketListStore } from '@/store/market/market-list'
import { useEffect, useRef, useState } from 'react'
import { useMount, useUpdateEffect } from 'ahooks'
import { SorterResult } from '@nbit/arco/es/Table/interface'
import MarketListSpotCommonTableContent from '../market-list-trade-pair-common-table-content'

function isTableSorterSame(sorterA, sorterB) {
  if (sorterA === sorterB || (sorterA.direction === sorterB.direction && sorterA.field === sorterB.field)) {
    return true
  }
  return false
}

export function MarketListFavContentCommon({ favList, data, setData, isLoading, Component }) {
  // const { resolvedData: data, setApiData: setData, isLoading } = useWsMarketSpotUserFavListFullAmount()
  const [sorter, setSorter] = useState<SorterResult | null>(null)
  const store = useMarketListStore()
  const originSortDataRef = useRef<any[] | null>(null)

  useMount(() => {
    if (isTableSorterSame(store.globalTableSorter, quoteVolumneTableSorter)) return
    setSorter(store.globalTableSorter)
  })

  useEffect(() => {
    if (!isLoading && originSortDataRef.current === null) {
      // reset to origin order
      originSortDataRef.current = data
    }
  }, [isLoading])

  useUpdateEffect(() => {
    if (sorter) {
      !isTableSorterSame(store.globalTableSorter, sorter) && store.setGlobalTableSorter(sorter)
      return
    }

    // if sorter is null, reset global also
    originSortDataRef.current && setData(originSortDataRef.current)
    !isTableSorterSame(store.globalTableSorter, quoteVolumneTableSorter) &&
      store.setGlobalTableSorter(quoteVolumneTableSorter)
  }, [sorter])

  if (isLoading) return null

  if (favList.length !== 0)
    return (
      <div className="spot-market-list-fav-user-wrapper">
        <div className="global-search-content">
          <MarketListSpotCommonTableContent
            data={data}
            setData={setData}
            defaultSorter={null}
            sorter={sorter}
            setSorter={setSorter}
          />
        </div>
      </div>
    )

  return (
    <div className="spot-market-list-fav-default-wrapper">
      <Component />
    </div>
  )
}

export function MarketListSpotFavContent() {
  const favList = useSpotFavList().data || []
  const { resolvedData: data, setApiData: setData, isLoading } = useWsMarketSpotUserFavListFullAmount()

  return (
    <MarketListFavContentCommon
      favList={favList}
      data={data}
      setData={setData}
      isLoading={isLoading}
      Component={MarketListSpotDefaultFavourites}
    />
  )
}

export function MarketListFuturesFavContent() {
  const favList = useFuturesFavList().data || []
  const { resolvedData: data, setApiData: setData, isLoading } = useWsMarketFuturesUserFavListFullAmount()

  return (
    <MarketListFavContentCommon
      favList={favList}
      data={data}
      setData={setData}
      isLoading={isLoading}
      Component={MarketListFuturesDefaultFavourites}
    />
  )
}

// switcher
export function MarketListActiveFavContent() {
  const rootStore = useMarketListStore()
  const activeStore = rootStore[rootStore.activeModule]

  if (!activeStore || activeStore.selectedBaseCurrencyFilter !== SpotMarketBaseCurrenyEnum.favorites) return null

  switch (rootStore.activeModule) {
    case MarketLisModulesEnum.futuresMarkets: {
      return <MarketListFuturesFavContent />
    }

    case MarketLisModulesEnum.spotMarkets:
      return <MarketListSpotFavContent />
    default:
      return null
  }
}
