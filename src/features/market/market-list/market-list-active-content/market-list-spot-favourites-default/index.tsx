import { useFuturesFavActions, useSpotFavActions } from '@/hooks/features/market/favourite'
import {
  useWsMarketFuturesFavouriteDefault,
  useWsMarketSpotFavouriteDefault,
} from '@/hooks/features/market/market-list/use-ws-market-spot-favourite-default'
import { t } from '@lingui/macro'
import { Button, Checkbox } from '@nbit/arco'
import { useEffect, useState } from 'react'
import FavouritesItem from './favourite-item'

export function MarketListSpotDefaultFavourites() {
  const [apiFav, favDefaults] = useWsMarketSpotFavouriteDefault({})
  const { addFavToList } = useSpotFavActions()
  const [checked, setchecked] = useState<Array<number>>([])

  const getChecked = () => {
    if (!favDefaults) return []
    return favDefaults.filter(x => checked.includes(Number(x.tradePairId)))
  }

  useEffect(() => {
    setchecked(apiFav.map(fav => Number(fav.tradePairId)))
  }, [apiFav])

  return (
    <div className="flex flex-col justify-between">
      <Checkbox.Group value={checked} onChange={selected => setchecked(selected)}>
        <div className="grid grid-cols-4 gap-8">
          {favDefaults?.map((each, index) => (
            <FavouritesItem key={each.id} {...each} />
          ))}
        </div>
      </Checkbox.Group>
      <div className="flex justify-center my-8">
        <Button
          className="w-96 h-10 text-sm"
          type="primary"
          onClick={() => addFavToList(getChecked() as any)}
          disabled={favDefaults.length <= 0 || checked.length === 0}
        >
          {t`features_market_market_list_market_list_spot_market_list_spot_favourites_default_index_2764`} (
          {checked.length})
        </Button>
      </div>
    </div>
  )
}

export function MarketListFuturesDefaultFavourites() {
  const [apiFav, favDefaults] = useWsMarketFuturesFavouriteDefault({})
  const { addFavToList } = useFuturesFavActions()
  const [checked, setchecked] = useState<Array<number>>([])

  const getChecked = () => {
    if (!favDefaults) return []
    return favDefaults.filter(x => checked.includes(Number(x.tradePairId)))
  }

  useEffect(() => {
    setchecked(apiFav.map(fav => Number(fav.tradePairId)))
  }, [apiFav])

  return (
    <div className="flex flex-col justify-between">
      <Checkbox.Group value={checked} onChange={selected => setchecked(selected)}>
        <div className="grid grid-cols-4 gap-8">
          {favDefaults?.map((each, index) => (
            <FavouritesItem key={index} {...each} />
          ))}
        </div>
      </Checkbox.Group>
      <div className="flex justify-center my-8">
        <Button
          className="w-96 h-10 text-sm"
          type="primary"
          onClick={() => addFavToList(getChecked() as any)}
          disabled={favDefaults.length <= 0 || checked.length === 0}
        >
          {t`features_market_market_list_market_list_spot_market_list_spot_favourites_default_index_2764`} (
          {checked.length})
        </Button>
      </div>
    </div>
  )
}
