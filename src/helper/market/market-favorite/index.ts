import {
  addFavList,
  removeFavList,
  getUserFavList,
  addFavListFutures,
  removeFavListFutures,
  getUserFavListFutures,
} from '@/apis/market/market-list/market-favourites'
import { getFavouriteListCache, setFavouriteListCache } from '@/helper/cache'
import { partial } from 'lodash'
import { commonActionFn, commonCacheFn } from './common'

/** Spot favorite helper Functions */
const spotFavCacheFn = commonCacheFn(partial(getFavouriteListCache, 'spot'), partial(setFavouriteListCache, 'spot'))
const spotFavFn = commonActionFn(addFavList, removeFavList, getUserFavList, spotFavCacheFn)

/** Contract favorite helper Functions */
const contractFavCacheFn = commonCacheFn(
  partial(getFavouriteListCache, 'futures'),
  partial(setFavouriteListCache, 'futures')
)
const contractFavFn = commonActionFn(addFavListFutures, removeFavListFutures, getUserFavListFutures, contractFavCacheFn)

export { spotFavFn, contractFavFn }
