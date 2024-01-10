import Request, { MarkcoinRequest } from '@/plugins/request'
import {
  YapiGetV1FavouriteListApiRequest,
  YapiGetV1FavouriteListApiResponse,
} from '@/typings/yapi/FavouriteListV1GetApi'
import {
  YapiGetV1FavouriteDefaultApiRequest,
  YapiGetV1FavouriteDefaultApiResponse,
} from '@/typings/yapi/FavouriteDefaultV1GetApi'
import {
  YapiGetV1FavouriteDefaultApiResp,
  YapiGetV1FuturesFavouriteDefaultApiResp,
} from '@/typings/api/market/market-list'
import {
  YapiPostV1FavouriteDeleteApiRequest,
  YapiPostV1FavouriteDeleteApiResponse,
} from '@/typings/yapi/FavouriteDeleteV1PostApi'
import {
  YapiPostV1FavouriteAddApiRequest,
  YapiPostV1FavouriteAddApiResponse,
} from '@/typings/yapi/FavouriteAddV1PostApi'
import {
  YapiPostV1PerpetualFavouriteTradePairDeleteApiRequest,
  YapiPostV1PerpetualFavouriteTradePairDeleteApiResponse,
} from '@/typings/yapi/PerpetualFavouriteTradePairDeleteV1PostApi'
import {
  YapiGetV1PerpetualFavouriteTradePairDefaultApiRequest,
  YapiGetV1PerpetualFavouriteTradePairDefaultApiResponse,
} from '@/typings/yapi/PerpetualFavouriteTradePairDefaultV1GetApi'
import {
  YapiPostV1PerpetualFavouriteTradePairAddApiRequest,
  YapiPostV1PerpetualFavouriteTradePairAddApiResponse,
} from '@/typings/yapi/PerpetualFavouriteTradePairAddV1PostApi'

/**
 * Favourites default
 */
export const getDefaultFavList: MarkcoinRequest<
  YapiGetV1FavouriteDefaultApiRequest,
  YapiGetV1FavouriteDefaultApiResp['data']
> = params => {
  return Request({
    path: '/v1/favourite/default',
    method: 'GET',
    params,
  })
}

/**
 * Favourites add
 */
export const addFavList: MarkcoinRequest<
  YapiPostV1FavouriteAddApiRequest,
  YapiPostV1FavouriteAddApiResponse
> = params => {
  return Request({
    path: '/v1/favourite/add',
    method: 'POST',
    data: params,
  })
}

/**
 * Favourites remove
 */
export const removeFavList: MarkcoinRequest<
  YapiPostV1FavouriteDeleteApiRequest,
  YapiPostV1FavouriteDeleteApiResponse
> = params => {
  return Request({
    path: '/v1/favourite/delete',
    method: 'POST',
    data: params,
  })
}

/**
 * User favourites list
 */
export const getUserFavList: MarkcoinRequest<
  Partial<YapiGetV1FavouriteListApiRequest>,
  YapiGetV1FavouriteListApiResponse['data']
> = params => {
  return Request({
    path: '/v1/favourite/list',
    method: 'GET',
    params,
  })
}

/**
 * Favourites default
 */
export const getDefaultFavListFutures: MarkcoinRequest<
  YapiGetV1PerpetualFavouriteTradePairDefaultApiRequest,
  YapiGetV1FuturesFavouriteDefaultApiResp['data']
> = params => {
  return Request({
    path: '/v1/perpetual/favouriteTradePair/default',
    method: 'GET',
    params,
  })
}

/**
 * Favourites add
 */
export const addFavListFutures: MarkcoinRequest<
  YapiPostV1PerpetualFavouriteTradePairAddApiRequest,
  YapiPostV1PerpetualFavouriteTradePairAddApiResponse
> = params => {
  return Request({
    path: '/v1/perpetual/favouriteTradePair/add',
    method: 'POST',
    data: params,
  })
}

/**
 * Favourites remove
 */
export const removeFavListFutures: MarkcoinRequest<
  YapiPostV1PerpetualFavouriteTradePairDeleteApiRequest,
  YapiPostV1PerpetualFavouriteTradePairDeleteApiResponse
> = params => {
  return Request({
    path: '/v1/perpetual/favouriteTradePair/delete',
    method: 'POST',
    data: params,
  })
}

/**
 * User favourites list
 */
export const getUserFavListFutures: MarkcoinRequest<
  Partial<YapiGetV1PerpetualFavouriteTradePairDefaultApiRequest>,
  YapiGetV1PerpetualFavouriteTradePairDefaultApiResponse['data']
> = params => {
  return Request({
    path: '/v1/perpetual/favouriteTradePair/list',
    method: 'GET',
    params,
  })
}
