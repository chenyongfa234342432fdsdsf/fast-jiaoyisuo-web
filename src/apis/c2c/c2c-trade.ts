import request, { MarkcoinRequest } from '@/plugins/request'
import { YapiGetV1C2cOrderDetailApiRequest, YapiGetV1C2COrderDetailData } from '@/typings/yapi/C2cOrderDetailV1GetApi.d'
import { YapiGetV1C2cAreaListApiRequest, YapiGetV1C2CAreaListData } from '@/typings/yapi/C2cAreaListV1GetApi.d'
import { YapiPostV1C2cCoinListApiRequest, YapiPostV1C2CCoinListData } from '@/typings/yapi/C2cCoinListV1PostApi.d'
import {
  YapiPostV1C2cQuickTransactionBuyCurrencyApiRequest,
  YapiPostV1C2cQuickTransactionBuyCurrencyApiResponse,
} from '@/typings/yapi/C2cQuickTransactionBuyCurrencyV1PostApi'
import {
  YapiPostV1C2cQuickTransactionSellCurrencyApiRequest,
  YapiPostV1C2CQuickTransactionSellCurrencyListData,
} from '@/typings/yapi/C2cQuickTransactionSellCurrencyV1PostApi.d'
import {
  YapiPostV1C2cCoinMainChainListApiRequest,
  YapiPostV1C2cCoinMainChainListApiResponse,
} from '@/typings/yapi/C2cCoinMainChainListV1PostApi'
import {
  YapiPostV1C2cAdvertIndexListApiRequest,
  YapiPostV1C2cAdvertIndexListApiResponse,
} from '@/typings/yapi/C2cAdvertIndexListV1PostApi'
import {
  YapiPostV1C2cAdvertTradingActivitiesDetailApiRequest,
  YapiPostV1C2cAdvertTradingActivitiesDetailApiResponse,
} from '../../typings/yapi/C2cAdvertTradingActivitiesDetailV1PostApi'
import {
  YapiGetV1C2cAdvertTradingActivitiesApiRequest,
  YapiGetV1C2cAdvertTradingActivitiesApiResponse,
} from '../../typings/yapi/C2cAdvertTradingActivitiesV1GetApi'

/**
 * 获取可交易的区域列表
 *
 */
export const getC2CAreaList: MarkcoinRequest<YapiGetV1C2cAreaListApiRequest, YapiGetV1C2CAreaListData[]> = params => {
  return request({
    path: `/v1/c2c/area/list`,
    method: 'GET',
    params,
  })
}

/**
 * 快捷交易获取可交易的区域列表
 *
 */
export const getC2CShortAreaList: MarkcoinRequest = params => {
  return request({
    path: `/v1/c2c/area/listForQuickTrade`,
    method: 'GET',
    params,
  })
}

/**
 * 获取可交易的区域下的币种列表
 *
 */
export const getC2CAreaCoinList: MarkcoinRequest<
  YapiPostV1C2cCoinListApiRequest,
  YapiPostV1C2CCoinListData[]
> = data => {
  return request({
    path: `/v1/c2c/coin/list`,
    method: 'POST',
    data,
  })
}

/**
 * 提交申诉
 *
 */
export const setC2COrderAppeal: MarkcoinRequest = data => {
  return request({
    path: `/v1/c2c/order/appeal`,
    method: 'POST',
    data,
  })
}

/**
 * 更改状态 (已付款、已收款、已转币、已收币都可调用这个)
 *
 */
export const setC2COrderChangeStatus: MarkcoinRequest = data => {
  return request({
    path: `/v1/c2c/order/changeStatus`,
    method: 'POST',
    data,
  })
}

/**
 *获取首页广告列表
 *
 */
export const setAdvertIndexList: MarkcoinRequest<
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
 * 获取汇率
 *
 */
export const getTransactionRate: MarkcoinRequest = params => {
  return request({
    path: `/v1/c2c/quickTransaction/getRate`,
    method: 'GET',
    params,
  })
}

/**
 * [快捷买币↗](https://yapi.nbttfc365.com/project/73/interface/api/5210)
 * */
export const getQuickTransaction: MarkcoinRequest<
  YapiPostV1C2cQuickTransactionBuyCurrencyApiRequest,
  YapiPostV1C2cQuickTransactionBuyCurrencyApiResponse['data']
> = data => {
  return request({
    path: '/v1/c2c/quickTransaction/buyCurrency',
    method: 'POST',
    data,
  })
}

/**
 * 确认买币
 *
 */
export const setQuickTransaction: MarkcoinRequest = data => {
  return request({
    path: `/v1/c2c/quickTransaction/confirmBuy`,
    method: 'POST',
    data,
  })
}

/**
 * 快捷卖币
 *
 */
export const getQuickSellTransaction: MarkcoinRequest<
  YapiPostV1C2cQuickTransactionSellCurrencyApiRequest,
  YapiPostV1C2CQuickTransactionSellCurrencyListData[]
> = data => {
  return request({
    path: '/v1/c2c/quickTransaction/sellCurrencyForWeb',
    method: 'POST',
    data,
  })
}

/**
 * 确认卖币
 *
 */
export const setQuickSellTransaction: MarkcoinRequest = data => {
  return request({
    path: `/v1/c2c/quickTransaction/confirmSell`,
    method: 'POST',
    data,
  })
}

/**
 * 确认卖币
 *
 */
export const getQuickHasProgressing: MarkcoinRequest = params => {
  return request({
    path: `/v1/c2c/quickTransaction/hasProgressing`,
    method: 'GET',
    params,
  })
}

/**
 * 提交申诉资料
 *
 */
export const setAddComplaintInformation: MarkcoinRequest = data => {
  return request({
    path: `/v1/c2c/order/addComplaintInformation`,
    method: 'POST',
    data,
  })
}

/**
 * 催转币
 *
 */
export const setOrderUrge: MarkcoinRequest = data => {
  return request({
    path: `/v1/c2c/order/urge`,
    method: 'POST',
    data,
  })
}

/**
 * 买卖币校验
 *
 */
export const getCheckBeforeCreate: MarkcoinRequest = params => {
  return request({
    path: `/v1/c2c/order/checkBeforeCreate`,
    method: 'GET',
    params,
    needAllRes: true,
  })
}

/**
 * 获取 C2C 交易所需要的 kyc 等级
 *
 */
export const getCommonSettingKycLevel: MarkcoinRequest = () => {
  return request({
    path: `/v1/c2c/commonSetting/kycLevel`,
    method: 'GET',
  })
}

/**
 * 广告主链是否都禁止充币
 *
 */
export const getCoinForbiddenCheck: MarkcoinRequest = params => {
  return request({
    path: `/v1/c2c/order/coinForbiddenCheck`,
    method: 'GET',
    params,
  })
}

/**
 * 广告下单
 *
 */
export const setCoinOrderCreate: MarkcoinRequest = data => {
  return request({
    path: `/v1/c2c/order/create`,
    method: 'POST',
    data,
  })
}

/**
 * 获取收付方式列表
 *
 */
export const setPaymentReciveList: MarkcoinRequest = params => {
  return request({
    path: `/v1/c2c/payment/reciveList/group`,
    method: 'GET',
    params,
  })
}

/**
 * 获取订单详情
 *
 */
export const getC2COrderDetail: MarkcoinRequest<
  YapiGetV1C2cOrderDetailApiRequest,
  YapiGetV1C2COrderDetailData
> = params => {
  return request({
    path: `/v1/c2c/order/detail`,
    method: 'GET',
    params,
  })
}

/**
 * 检测该广告是否可交易
 *
 */
export const getAdvertCheckAdvertById: MarkcoinRequest = params => {
  return request({
    path: `/v1/c2c/advert/checkAdvertById`,
    method: 'GET',
    params,
  })
}

/**
 * 取消订单
 *
 */
export const setC2COrderCancel: MarkcoinRequest = data => {
  return request({
    path: `/v1/c2c/order/cancel`,
    method: 'POST',
    data,
  })
}

/**
 * 快捷交易获取最优价格
 *
 */
export const getBestPrice: MarkcoinRequest = params => {
  return request({
    path: `/v1/c2c/quickTransaction/getBestPrice`,
    method: 'GET',
    params,
    needAllRes: true,
  })
}

/**
 * 获取申诉原因的集合
 *
 */
export const getReasonList: MarkcoinRequest = () => {
  return request({
    path: `/v1/appeal/getReasonList`,
    method: 'GET',
  })
}

/**
 * 通过币种 name 获取主链信息
 *
 */

export const getMainChainList: MarkcoinRequest<
  YapiPostV1C2cCoinMainChainListApiRequest,
  YapiPostV1C2cCoinMainChainListApiResponse['data']
> = data => {
  return request({
    path: '/v1/c2c/coin/mainChain/list',
    method: 'POST',
    data,
  })
}

/**
 * [获取广告发布开关↗](https://yapi.nbttfc365.com/project/73/interface/api/5554)
 * */
export const queryCanPublishAd: MarkcoinRequest = params => {
  return request({
    path: '/v1/c2c/advert/getReleaseAdvertSwitch',
    method: 'GET',
    params,
  })
}

/**
 *  盘口列表数据获取
 * */
export const getBidTradelList: MarkcoinRequest<
  YapiGetV1C2cAdvertTradingActivitiesApiRequest,
  YapiGetV1C2cAdvertTradingActivitiesApiResponse['data']
> = params => {
  return request({
    path: '/v1/c2c/advert/tradingActivities',
    method: 'GET',
    params,
  })
}

/**
 *  盘口详情数据获取
 * */
export const getBidTradeDetailList: MarkcoinRequest<
  YapiPostV1C2cAdvertTradingActivitiesDetailApiRequest,
  YapiPostV1C2cAdvertTradingActivitiesDetailApiResponse['data']
> = data => {
  return request({
    path: '/v1/c2c/advert/tradingActivitiesDetail',
    method: 'POST',
    data,
  })
}
