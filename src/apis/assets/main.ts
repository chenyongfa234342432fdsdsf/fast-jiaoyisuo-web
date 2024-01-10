import request, { MarkcoinRequest } from '@/plugins/request'
import {
  CoinAssetsListReq,
  CoinAssetsListResp,
  CoinAssetsDetailReq,
  CoinAssetsDetailResp,
  IAllCoinListReq,
  IAllCoinListResp,
  IDepositAddressReq,
  IDepositAddressResp,
  ISubCoinListReq,
  ISubCoinListResp,
  IWithdrawAddressListReq,
  IWithdrawAddressListResq,
  IVerifyWithdrawAddressReq,
  IVerifyWithdrawAddressResp,
  AssetsWithdrawVerifyReq,
  AssetsWithdrawVerifyResp,
  ISubmitWithdrawReq,
  ISubmitWithdrawResp,
  IAddWithdrawAddressReq,
  IAddWithdrawAddressResp,
  IDeleteWithdrawAddressReq,
  IDeleteWithdrawAddressResp,
  IWithdrawCoinInfoReq,
  IWithdrawCoinInfoResp,
  ICoinBalanceRequest,
  ICoinBalanceData,
  AssetsCoinOverviewReq,
  AssetsCoinOverviewResp,
} from '@/typings/api/assets/assets'
import {
  YapiGetV1C2cBalanceFastPayDetailApiRequest,
  YapiGetV1C2cBalanceFastPayDetailApiResponse,
} from '@/typings/yapi/C2cBalanceFastPayDetailV1GetApi'

/**
 * 获取币币资产列表（现货资产）
 * yapi: https://yapi.admin-devops.com/project/44/interface/api/398
 */
export const getCoinAssetData: MarkcoinRequest<CoinAssetsListReq, CoinAssetsListResp> = params => {
  return request({
    path: `/v1/pay/asset/coin/balance`,
    method: 'GET',
    params,
  })
}

/**
 * 获取用户的币种资产详情
 * yapi: https://yapi.admin-devops.com/project/44/interface/api/2720
 */
export const getCoinAssetDetail: MarkcoinRequest<CoinAssetsDetailReq, CoinAssetsDetailResp> = data => {
  return request({
    path: `/v1/asset/coin/balance/detail`,
    method: 'POST',
    data,
  })
}

/**
 * [单个币种资产详情↗](https://yapi.nbttfc365.com/project/73/interface/api/10359)
 * */
export const getV1C2cBalanceFastPayDetailApiRequest: MarkcoinRequest<
  YapiGetV1C2cBalanceFastPayDetailApiRequest,
  YapiGetV1C2cBalanceFastPayDetailApiResponse['data']
> = params => {
  return request({
    path: '/v1/c2c/balance/fastPay/detail',
    method: 'GET',
    params,
  })
}

/**
 * 资产 - 币对资产详情 - 交易页面用
 * yapi: https://yapi.admin-devops.com/project/44/interface/api/2987
 */
export const getCoinBalance: MarkcoinRequest<ICoinBalanceRequest, ICoinBalanceData> = params => {
  return request({
    path: `/v1/asset/getCoinBalance`,
    method: 'GET',
    params,
  })
}

/**
 * 获取所有币种信息
 * yapi: https://yapi.coin-online.cc/project/44/interface/api/2705
 */
export const getCoinInfoList: MarkcoinRequest<IAllCoinListReq, IAllCoinListResp> = params => {
  return request({
    path: `/v1/coin/queryCoinPageList`,
    method: 'GET',
    params,
  })
}

/**
 * 根据主币获取子币列表
 * yapi: https://yapi.coin-online.cc/project/44/interface/api/401
 */
export const getSubCoinInfoList: MarkcoinRequest<ISubCoinListReq, ISubCoinListResp> = params => {
  return request({
    path: `/v1/coin/querySubCoinList`,
    method: 'GET',
    params,
  })
}

/**
 * 获取充值地址信息（钱包地址）
 * yapi: https://yapi.coin-online.cc/project/44/interface/api/2714
 */
export const getDepositAddress: MarkcoinRequest<IDepositAddressReq, IDepositAddressResp> = data => {
  return request({
    path: `/v1/assets/base/queryDepositAddress`,
    method: 'POST',
    data,
    // contentType: 1,
    // signature: 'decrypted',
  })
}

/**
 * 发起提币申请
 * yapi: https://yapi.coin-online.cc/project/44/interface/api/407
 */
export const submitWithdraw: MarkcoinRequest<ISubmitWithdrawReq, ISubmitWithdrawResp> = data => {
  return request({
    path: `/v1/pay/asset/withdraw/submit`,
    method: 'POST',
    data,
    // contentType: 1,
    // signature: 'decrypted',
  })
}
/**
 * 提币前校验
 * https://yapi.coin-online.cc/project/44/interface/api/2735
 */
export const checkUserWithdraw: MarkcoinRequest<AssetsWithdrawVerifyReq, AssetsWithdrawVerifyResp> = params => {
  return request({
    path: `/v1/pay/asset/withdraw/verify`,
    method: 'GET',
    params,
  })
}
/**
 * 提币地址校验
 * yapi: https://yapi.coin-online.cc/project/44/interface/api/2783
 */
export const verifyWithdrawAddress: MarkcoinRequest<IVerifyWithdrawAddressReq, IVerifyWithdrawAddressResp> = data => {
  return request({
    path: `/v1/asset/withdraw/address/verify`,
    method: 'POST',
    data,
    // contentType: 1,
    // signature: 'decrypted',
  })
}

/**
 * 资产 - 获取提币的币种详情信息
 * yapi: https://yapi.admin-devops.com/project/44/interface/api/2834
 */
export const getWithdrawCoinInfo: MarkcoinRequest<IWithdrawCoinInfoReq, IWithdrawCoinInfoResp> = data => {
  return request({
    path: `/v1/pay/asset/withdraw/getCoinInfo`,
    method: 'POST',
    data,
  })
}

/**
 * 获取常用提现地址列表
 * yapi: https://yapi.coin-online.cc/project/44/interface/api/404
 */
export const getWithdrawAddressList: MarkcoinRequest<IWithdrawAddressListReq, IWithdrawAddressListResq> = params => {
  return request({
    path: `/v1/assets/base/queryWithdrawAddress`,
    method: 'GET',
    params,
  })
}

/**
 * 设置常用提现地址（添加/编辑）
 * yapi: https://yapi.admin-devops.com/project/44/interface/api/2708
 */
export const addWithdrawAddress: MarkcoinRequest<IAddWithdrawAddressReq, IAddWithdrawAddressResp> = data => {
  return request({
    path: `/v1/assets/base/setting/withdrawAddress`,
    method: 'POST',
    data,
    // contentType: 1,
    // signature: 'decrypted',
  })
}

/**
 * 删除常用提现地址
 * yapi: https://yapi.admin-devops.com/project/44/interface/api/2837
 */
export const deleteWithdrawAddress: MarkcoinRequest<IDeleteWithdrawAddressReq, IDeleteWithdrawAddressResp> = data => {
  return request({
    path: `/v1/assets/base/deleteWithdrawAddress`,
    method: 'POST',
    data,
    // contentType: 1,
    // signature: 'decrypted',
  })
}

/**
 * 获取币种资产 - 总览
 */
export const getCoinOverview: MarkcoinRequest<AssetsCoinOverviewReq, AssetsCoinOverviewResp> = params => {
  return request({
    path: `/v1/asset/coin/overview`,
    method: 'GET',
    params,
  })
}
