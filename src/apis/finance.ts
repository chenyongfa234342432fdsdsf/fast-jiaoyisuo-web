import request, { MarkcoinRequest } from '@/plugins/request'
import {
  YapiPostDerOrderLiquidationListApiRequest,
  YapiPostDerOrderLiquidationListApiResponse,
} from '@/typings/yapi-old/DerOrderLiquidationListPostApi'
import { YapiPostDerOrderListApiRequest, YapiPostDerOrderListApiResponse } from '@/typings/yapi-old/DerOrderListPostApi'
import {
  YapiPostDerOrderPledgeRateAdjustListApiRequest,
  YapiPostDerOrderPledgeRateAdjustListApiResponse,
} from '@/typings/yapi-old/DerOrderPledgerateadjustListPostApi'
import {
  YapiPostDerOrderRepaymentListApiRequest,
  YapiPostDerOrderRepaymentListApiResponse,
} from '@/typings/yapi-old/DerOrderRepaymentListPostApi'
import {
  YapiGetV1FinanceDerPledgeProductLoanCoinsListApiRequest,
  YapiGetV1FinanceDerPledgeProductLoanCoinsListApiResponse,
} from '@/typings/yapi-old/FinanceDerPledgeProductLoanCoinsListV1GetApi'
import {
  YapiGetFinanceProductFixedListApiRequest,
  YapiGetFinanceProductFixedListApiResponse,
} from '@/typings/yapi-old/FinanceProductFixedListGetApi'
import {
  YapiGetFinanceProductFlexibleDetailApiRequest,
  YapiGetFinanceProductFlexibleDetailApiResponse,
} from '@/typings/yapi-old/FinanceProductFlexibleDetailGetApi'
import {
  YapiGetFinanceProductFlexibleListApiRequest,
  YapiGetFinanceProductFlexibleListApiResponse,
} from '@/typings/yapi-old/FinanceProductFlexibleListGetApi'
import {
  YapiPostFinanceProductFlexiblePurchaseApiRequest,
  YapiPostFinanceProductFlexiblePurchaseApiResponse,
} from '@/typings/yapi-old/FinanceProductFlexiblePurchasePostApi'
import {
  YapiGetFinanceProductIndexApiRequest,
  YapiGetFinanceProductIndexApiResponse,
} from '@/typings/yapi-old/FinanceProductIndexGetApi'
import {
  YapiGetFinanceProductUserLeftQuotaApiRequest,
  YapiGetFinanceProductUserLeftQuotaApiResponse,
} from '@/typings/yapi-old/FinanceProductUserleftquotaGetApi'

/**
 *  Earn related APIs
 */

export const getFinanceProducts: MarkcoinRequest<
  YapiGetFinanceProductIndexApiRequest,
  YapiGetFinanceProductIndexApiResponse
> = params => {
  return request({
    path: 'finance/product/index',
    method: 'GET',
    params,
  })
}

export const getProductDetail: MarkcoinRequest<
  YapiGetFinanceProductFlexibleDetailApiRequest,
  YapiGetFinanceProductFlexibleDetailApiResponse
> = params => {
  return request({
    path: 'finance/product/flexible/detail',
    mthod: 'GET',
    params,
  })
}

export const getFlexibleProducts: MarkcoinRequest<
  YapiGetFinanceProductFlexibleListApiRequest,
  YapiGetFinanceProductFlexibleListApiResponse
> = params => {
  return request({
    path: 'finance/product/flexible/list',
    method: 'GET',
    params,
  })
}

export const getFixedProducts: MarkcoinRequest<
  YapiGetFinanceProductFixedListApiRequest,
  YapiGetFinanceProductFixedListApiResponse
> = params => {
  return request({
    path: 'finance/product/fixed/list',
    method: 'GET',
    params,
  })
}

export const postProductPurchase: MarkcoinRequest<
  YapiPostFinanceProductFlexiblePurchaseApiRequest,
  YapiPostFinanceProductFlexiblePurchaseApiResponse
> = params => {
  return request({
    path: 'finance/product/flexible/purchase',
    method: 'POST',
    params,
  })
}

export const getUserLeftQuota: MarkcoinRequest<
  YapiGetFinanceProductUserLeftQuotaApiRequest,
  YapiGetFinanceProductUserLeftQuotaApiResponse
> = params => {
  return request({
    path: 'finance/product/userLeftQuota',
    method: 'GET',
    params,
  })
}

/**
 * Loans related APIs
 */

export const getLoanables: MarkcoinRequest<
  YapiGetV1FinanceDerPledgeProductLoanCoinsListApiRequest,
  YapiGetV1FinanceDerPledgeProductLoanCoinsListApiResponse
> = params => {
  return request({
    path: 'v1/finance/der/pledge-product/loan-coins/list',
    method: 'GET',
    params,
  })
}

export const getLoanOrders: MarkcoinRequest<
  YapiPostDerOrderListApiRequest,
  YapiPostDerOrderListApiResponse
> = params => {
  return request({
    path: 'der/order/list',
    method: 'POST',
    params,
  })
}

export const getLoanRepayment: MarkcoinRequest<
  YapiPostDerOrderRepaymentListApiRequest,
  YapiPostDerOrderRepaymentListApiResponse
> = params => {
  return request({
    path: 'der/order/repayment/list',
    method: 'POST',
    params,
  })
}

export const getLoanRates: MarkcoinRequest<
  YapiPostDerOrderPledgeRateAdjustListApiRequest,
  YapiPostDerOrderPledgeRateAdjustListApiResponse
> = params => {
  return request({
    path: 'der/order/pledgeRateAdjust/list',
    method: 'POST',
    params,
  })
}

export const getLoanLiquidation: MarkcoinRequest<
  YapiPostDerOrderLiquidationListApiRequest,
  YapiPostDerOrderLiquidationListApiResponse
> = params => {
  return request({
    path: 'der/order/liquidation/list',
    method: 'POST',
    params,
  })
}
