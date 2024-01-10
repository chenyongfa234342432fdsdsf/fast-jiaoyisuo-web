import request, { MarkcoinRequest } from '@/plugins/request'
import { YapiGetV1OtcCoinListApiRequest, YapiGetV1OtcCoinListApiResponse } from '@/typings/yapi/OtcCoinListV1GetApi'

import {
  YapiPostV1OtcGetChannelsApiRequest,
  YapiPostV1OtcGetChannelsApiResponse,
} from '@/typings/yapi/OtcGetChannelsV1PostApi'
import { YapiGetV1OtcGetLimitApiRequest, YapiGetV1OtcGetLimitApiResponse } from '@/typings/yapi/OtcGetLimitV1GetApi'
import { YapiGetV1OtcGetUrlsApiRequest, YapiGetV1OtcGetUrlsApiResponse } from '@/typings/yapi/OtcGetUrlsV1GetApi'
import { YapiGetV1OtcIsOpenOtcApiRequest, YapiGetV1OtcIsOpenOtcApiResponse } from '@/typings/yapi/OtcIsOpenOtcV1GetApi'

/**
 * [第三方支付渠道列表↗](https://yapi.nbttfc365.com/project/44/interface/api/18999)
 * */
export const postV1OtcGetChannelsApiRequest: MarkcoinRequest<
  YapiPostV1OtcGetChannelsApiRequest,
  YapiPostV1OtcGetChannelsApiResponse['data']
> = data => {
  return request({
    path: '/v1/otc/getChannels',
    method: 'POST',
    data,
  })
}

/**
 * [获取第三方支付跳转信息↗](https://yapi.nbttfc365.com/project/44/interface/api/19014)
 * */
export const getV1OtcGetUrlsApiRequest: MarkcoinRequest<
  YapiGetV1OtcGetUrlsApiRequest,
  YapiGetV1OtcGetUrlsApiResponse['data']
> = params => {
  return request({
    path: '/v1/otc/getUrls',
    method: 'GET',
    params,
  })
}

/**
 * [三方支付币种列表↗](https://yapi.nbttfc365.com/project/44/interface/api/19109)
 * */
export const getV1OtcCoinListApiRequest: MarkcoinRequest<
  YapiGetV1OtcCoinListApiRequest,
  YapiGetV1OtcCoinListApiResponse['data']
> = params => {
  return request({
    path: '/v1/otc/coinList',
    method: 'GET',
    params,
  })
}

/**
 * [获取第三方支付限额↗](https://yapi.nbttfc365.com/project/44/interface/api/18994)
 * */
export const getV1OtcGetLimitApiRequest: MarkcoinRequest<
  YapiGetV1OtcGetLimitApiRequest,
  YapiGetV1OtcGetLimitApiResponse['data']
> = params => {
  return request({
    path: '/v1/otc/getLimit',
    method: 'GET',
    params,
  })
}

/**
 * [查询是否开通OTC↗](https://yapi.nbttfc365.com/project/44/interface/api/19405)
 * */
export const getV1OtcIsOpenOtcApiRequest: MarkcoinRequest<
  YapiGetV1OtcIsOpenOtcApiRequest,
  YapiGetV1OtcIsOpenOtcApiResponse['data']
> = params => {
  return request({
    path: '/v1/otc/isOpenOTC',
    method: 'GET',
    params,
  })
}
