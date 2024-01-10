/**
 * 广告
 */
import request, { MarkcoinRequest } from '@/plugins/request'
import {
  AdvertAddReq,
  AdvertAddResp,
  AdvertListReq,
  AdvertListResp,
  AdvertMerchantInfoReq,
  AdvertMerchantInfoResp,
  AdvertCoincidenceListReq,
  AdvertCoincidenceListResp,
  AdvertPaymentTypeListReq,
  AdvertPaymentTypeListResp,
  AdvertDownReq,
  AdvertDownResp,
  AdvertReopenReq,
  AdvertReopenResp,
  AdvertDetailReq,
  AdvertDetailResp,
  AdvertOrderHistoryReq,
  AdvertOrderHistoryResp,
  AdvertAppealStatusReq,
  AdvertAppealStatusResp,
  AdvertPaymentListReq,
  AdvertPaymentListResp,
  AdvertReceiptListReq,
  AdvertReceiptListResp,
  AdvertCoinListReq,
  AdvertCoinListResp,
} from '@/typings/api/c2c/advertise/post-advertise'
import {
  YapiPostV1C2cAdvertIndexListApiRequest,
  YapiPostV1C2cAdvertIndexListApiResponse,
} from '@/typings/yapi/C2cAdvertIndexListV1PostApi'
import {
  YapiPostV1C2cAdvertListApiRequest,
  YapiPostV1C2cAdvertListApiResponse,
} from '@/typings/yapi/C2cAdvertListV1PostApi'
import { YapiGetV1C2cAreaListApiRequest, YapiGetV1C2cAreaListApiResponse } from '@/typings/yapi/C2cAreaListV1GetApi'
import { YapiGetV1C2cCoinAllApiRequest, YapiGetV1C2cCoinAllApiResponse } from '@/typings/yapi/C2cCoinAllV1GetApi'
import { YapiPostV1C2cCoinListApiRequest, YapiPostV1C2cCoinListApiResponse } from '@/typings/yapi/C2cCoinListV1PostApi'
import {
  YapiGetV1C2cMainTypeListApiRequest,
  YapiGetV1C2cMainTypeListApiResponse,
} from '@/typings/yapi/C2cMainTypeListV1GetApi'

/**
 * 发布广告单 - 获取广告重合度列表
 */
export const postAdvertCoincidenceList: MarkcoinRequest<AdvertCoincidenceListReq, AdvertCoincidenceListResp> = data => {
  return request({
    path: `/v1/c2c/advert/coincidenceList`,
    method: 'POST',
    data,
  })
}

/**
 * 发布广告单 - 获取收付方式列表
 */
export const getPaymentTypeList: MarkcoinRequest<AdvertPaymentTypeListReq, AdvertPaymentTypeListResp> = params => {
  return request({
    path: `/v1/c2c/payment/getsWithTypeGrp`,
    method: 'GET',
    params,
  })
}

/**
 * 发布广告单 - 获取支付方式列表
 */
export const getPaymentList: MarkcoinRequest<AdvertPaymentListReq, AdvertPaymentListResp> = params => {
  return request({
    path: `/v1/c2c/payment/list`,
    method: 'GET',
    params,
  })
}

/**
 * 发布广告单 - 获取交易区下收款账号列表
 */
export const getReceiptList: MarkcoinRequest<AdvertReceiptListReq, AdvertReceiptListResp> = params => {
  return request({
    path: `/v1/c2c/payment/reciveList/group`,
    method: 'GET',
    params,
  })
}

/**
 * 发布广告单
 */
export const postAdvertAdd: MarkcoinRequest<AdvertAddReq, AdvertAddResp> = data => {
  return request({
    path: `/v1/c2c/advert/add`,
    method: 'POST',
    data,
  })
}

/**
 * 发布广告单 - 获取当前的商家状态
 */
export const getMerchantInfo: MarkcoinRequest<AdvertMerchantInfoReq, AdvertMerchantInfoResp> = params => {
  return request({
    path: `/v1/c2c/merchant/info`,
    method: 'GET',
    params,
  })
}

/**
 * 广告是否有进行中的订单
 */
export const getAdvertProgressStatus: MarkcoinRequest<AdvertAppealStatusReq, AdvertAppealStatusResp> = params => {
  return request({
    path: `/v1/c2c/advert/hasProgressOrder`,
    method: 'GET',
    params,
  })
}

/**
 * 广告是否含有申诉中的订单
 */
export const getAdvertAppealStatus: MarkcoinRequest<AdvertAppealStatusReq, AdvertAppealStatusResp> = params => {
  return request({
    path: `/v1/c2c/advert/hasAppealOrder`,
    method: 'GET',
    params,
  })
}

/**
 * 广告记录 - 获取商户广告列表
 */
export const postAdvertList: MarkcoinRequest<AdvertListReq, AdvertListResp> = data => {
  return request({
    path: `/v1/c2c/advert/list`,
    method: 'POST',
    data,
  })
}

/**
 * 下架广告
 */
export const getAdvertDown: MarkcoinRequest<AdvertDownReq, AdvertDownResp> = params => {
  return request({
    path: `/v1/c2c/advert/down`,
    method: 'GET',
    params,
  })
}

/**
 * 删除广告
 */
export const getAdvertDelete: MarkcoinRequest<AdvertDownReq, AdvertDownResp> = params => {
  return request({
    path: `/v1/c2c/advert/delete`,
    method: 'GET',
    params,
  })
}

/**
 * 重新上架广告
 */
export const postAdvertReopen: MarkcoinRequest<AdvertReopenReq, AdvertReopenResp> = data => {
  return request({
    path: `/v1/c2c/advert/up`,
    method: 'POST',
    data,
  })
}

/**
 * 广告详情
 */
export const getAdvertDetail: MarkcoinRequest<AdvertDetailReq, AdvertDetailResp> = params => {
  return request({
    path: `/v1/c2c/advert/detail`,
    method: 'GET',
    params,
  })
}

/**
 * [获取商户广告列表↗](https://yapi.nbttfc365.com/project/73/interface/api/4615)
 * */
export const postV1C2cAdvertListApiRequest: MarkcoinRequest<
  YapiPostV1C2cAdvertListApiRequest,
  YapiPostV1C2cAdvertListApiResponse['data']
> = data => {
  return request({
    path: '/v1/c2c/advert/list',
    method: 'POST',
    data,
  })
}

/**
 * [获取首页广告列表↗](https://yapi.nbttfc365.com/project/73/interface/api/5048)
 * */
export const postV1C2cAdvertIndexListApiRequest: MarkcoinRequest<
  YapiPostV1C2cAdvertIndexListApiRequest,
  YapiPostV1C2cAdvertIndexListApiResponse['data']
> = data => {
  return request({
    path: '/v1/c2c/advert/indexList',
    method: 'POST',
    data,
  })
}

/**
 * [获取可交易的区域列表↗](https://yapi.nbttfc365.com/project/73/interface/api/4571)
 * */
export const getV1C2cAreaListApiRequest: MarkcoinRequest<
  YapiGetV1C2cAreaListApiRequest,
  YapiGetV1C2cAreaListApiResponse['data']
> = params => {
  return request({
    path: '/v1/c2c/area/list',
    method: 'GET',
    params,
  })
}

/**
 * [获取所有币种信息↗](https://yapi.nbttfc365.com/project/73/interface/api/5192)
 * */
export const getV1C2cCoinAllApiRequest: MarkcoinRequest<
  YapiGetV1C2cCoinAllApiRequest,
  YapiGetV1C2cCoinAllApiResponse['data']
> = params => {
  return request({
    path: '/v1/c2c/coin/all',
    method: 'GET',
    params,
  })
}

/**
 * [获取可交易的区域下的币种列表↗](https://yapi.nbttfc365.com/project/73/interface/api/4575)
 * */
export const postV1C2cCoinListApiRequest: MarkcoinRequest<
  YapiPostV1C2cCoinListApiRequest,
  YapiPostV1C2cCoinListApiResponse['data']
> = data => {
  return request({
    path: '/v1/c2c/coin/list',
    method: 'POST',
    data,
  })
}

/**
 * [获取币种对应的 mainType↗](https://yapi.nbttfc365.com/project/73/interface/api/5102)
 * */
export const getV1C2cMainTypeListApiRequest: MarkcoinRequest<
  YapiGetV1C2cMainTypeListApiRequest,
  YapiGetV1C2cMainTypeListApiResponse['data']
> = params => {
  return request({
    path: '/v1/c2c/mainType/list',
    method: 'GET',
    params,
  })
}

/**
 * 广告详情 - 历史订单
 */
export const getAdvertOrderHistory: MarkcoinRequest<AdvertOrderHistoryReq, AdvertOrderHistoryResp> = params => {
  return request({
    path: `/v1/c2c/order/getsPageBy`,
    method: 'GET',
    params,
  })
}

/**
 * 广告记录 - 获取发布过广告的币种列表
 */
export const postAdvertCoinList: MarkcoinRequest<AdvertCoinListReq, AdvertCoinListResp[]> = data => {
  return request({
    path: `/v1/c2c/coin/advert/list`,
    method: 'POST',
    data,
  })
}
