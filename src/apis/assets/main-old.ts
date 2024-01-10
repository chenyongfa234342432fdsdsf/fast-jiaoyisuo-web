/**
 * 现货资产相关 api 接口
 */
import request, { MarkcoinRequest } from '@/plugins/request'
import { otcUrl } from '@/helper/env'
import {
  IBaseReq,
  ICoinIdReq,
  ICoinInfoListReq,
  ICoinInfoListResp,
  ISystemArgsOTCResp,
  IBalanceResp,
  IGetUserInfoResp,
  IGetSecuritySettingResp,
  IUserAssetsReq,
  ISymbolListResp,
  ICoinAddressReq,
  ICoinAddressResp,
  ITransferCoinListReq,
  ITransferCoinListResp,
  ILogListReq,
  ILogListResp,
  ICancelWithdrawReq,
  IFinanceCointypeReq,
  IFinanceCointypeResp,
  IWithdrawReq,
  IGetWithdrawInfoResp,
  IValidateAddressReq,
  IValidateAddressResp,
  IAddAddressReq,
  IWithdrawAddressListResp,
  IWithdrawAddressListReq,
  IWalletInfoReq,
  IWalletInfoResp,
  ITransferApiReq,
  IMarginIsolatedTradeTypesApiResp,
} from '@/typings/api/assets/main'

/** @@@@@@@@@@@@@@@@@@@@@@ NB 和 Tule 分界线  @@@@@@@@@@@@@@@ */
/**
 * 获取所有币对的交易精度
 * TODO: 地址和要存到缓存中
 */
export const getCoinInfoList: MarkcoinRequest<ICoinInfoListReq, ICoinInfoListResp[]> = params => {
  return request({
    path: `/coinInfo/list`,
    method: 'GET',
    params,
  })
}

/**
 * 获取用户的系统设置，包括用户设置的货币信息、支付渠道、otc 币列表
 * TODO: 地址
 */
export const getSystemArgs: MarkcoinRequest<IBaseReq, ISystemArgsOTCResp> = params => {
  return request({
    path: `${otcUrl}/otc/common/systemArgs`,
    method: 'GET',
    params,
  })
}

/**
 * 获取当前选中币对的资产
 * TODO: 地址
 */
export const getUserAssets: MarkcoinRequest<IUserAssetsReq, IBalanceResp> = data => {
  return request({
    path: `/real/userassets`,
    method: 'POST',
    data: { tradeid: data.tradeid },
  })
}

/**
 * 获取用户资产列表
 * TODO: 地址
 */
export const getBalance: MarkcoinRequest<IBaseReq, IBalanceResp> = data => {
  return request({
    path: `/v2/balance`,
    method: 'POST',
    data,
  })
}

/**
 * 获取用户信息
 */
export const getUserInfo: MarkcoinRequest<IBaseReq, IGetUserInfoResp> = data => {
  return request({
    path: `/v2/getUserInfo`,
    method: 'POST',
    data,
  })
}

/**
 * 三项验证
 * TODO: 地址
 */
export const getSecuritySetting: MarkcoinRequest<IBaseReq, IGetSecuritySettingResp> = data => {
  return request({
    path: `/v2/getSecuritySetting`,
    method: 'POST',
    data,
  })
}

/**
 * 获取所有币币交易对
 * TODO: 地址
 */
export const getSymbol: MarkcoinRequest<IBaseReq, ISymbolListResp[]> = params => {
  return request({
    path: `/symbol/list`,
    method: 'GET',
    params,
  })
}

/**
 * 获取钱包地址信息
 * TODO: 地址
 */
export const getCoinAddress: MarkcoinRequest<ICoinAddressReq, ICoinAddressResp> = data => {
  return request({
    path: `/recharge/coin_address`,
    method: 'POST',
    data: { symbol: data.symbol },
    contentType: 1,
    signature: 'decrypted',
  })
}

/**
 * 获取可划转的币种列表
 * TODO: 地址
 */
export const getTransferCoinList: MarkcoinRequest<ITransferCoinListReq, ITransferCoinListResp> = params => {
  return request({
    path: `/transfer/info`,
    method: 'GET',
    params,
  })
}

/**
 * 币币账户 - 财务日志 - 充币记录
 */
export const getDepositLogList: MarkcoinRequest<ILogListReq, ILogListResp[]> = params => {
  return request({
    path: `/finance/recharge/log/list`,
    method: 'GET',
    params,
    needAllRes: true,
  })
}

/**
 * 币币账户 - 财务日志 - 提币记录
 */
export const getWithdrawLogList: MarkcoinRequest<ILogListReq, ILogListResp[]> = params => {
  return request({
    path: `/finance/withdraw/log/list`,
    method: 'GET',
    params,
    needAllRes: true,
  })
}

/**
 * 币币账户 - 财务日志 - 划转记录
 */
export const getTransferLogList: MarkcoinRequest<ILogListReq, ILogListResp[]> = params => {
  return request({
    path: `/finance/transfer/log/list`,
    method: 'GET',
    params,
    needAllRes: true,
  })
}

/**
 * 币币账户 - 财务日志 - 其他记录
 */
export const getOtherLogList: MarkcoinRequest<ILogListReq, ILogListResp[]> = params => {
  return request({
    path: `/finance/other/log/list`,
    method: 'GET',
    params,
    needAllRes: true,
  })
}

/**
 * 撤销提币
 */
export const cancelWithdraw: MarkcoinRequest<ICancelWithdrawReq> = data => {
  return request({
    path: `/withdraw/cancel`,
    method: 'POST',
    data,
    contentType: 1,
  })
}

/**
 * 获取财务日志的币种列表
 */
export const getFinanceCointypeList: MarkcoinRequest<IFinanceCointypeReq, IFinanceCointypeResp[]> = params => {
  return request({
    path: `finance/own/cointype/list`,
    method: 'GET',
    params,
  })
}
/**
 * 获取提币所需参数
 */
export const getWithdrawInfo: MarkcoinRequest<ICoinIdReq, IGetWithdrawInfoResp> = params => {
  return request({
    path: `/v2/capital/coin_withdraw_info`,
    method: 'GET',
    params,
  })
}

/**
 * 提币资格验证
 */
export const getWithdrawCheckResult: MarkcoinRequest<IBaseReq> = params => {
  return request({
    path: `/capital/withdrawCheck`,
    method: 'GET',
    errorShow: false,
    params,
  })
}

/**
 * 提币请求
 */
export const saveWithdraw: MarkcoinRequest<IWithdrawReq> = option => {
  return request({
    path: `/capital/withdraw`,
    method: 'POST',
    data: {
      address: option.address,
      coinId: option.coinId,
      memo: option.memo,
      withdrawAmount: option.withdrawAmount,
      emailCode: option.emailCode,
      googleCode: option.googleCode,
      phoneCode: option.phoneCode,
      tradePwd: option.tradePwd || '',
    },
    contentType: 1,
    signature: true,
  })
}

/**
 * 校验提币地址规则
 * TODO: 地址
 */
export const validateAddress: MarkcoinRequest<IValidateAddressReq, IValidateAddressResp> = option => {
  return request({
    path: `/v2/capital/validateAddress`,
    method: 'GET',
    params: { address: option.address, coinId: option.coinId, memo: option.memo || '', scene: option.scene },
  })
}

/**
 * 添加提币地址
 * TODO: 地址
 */
export const addWithdrawAddress: MarkcoinRequest<IAddAddressReq, IValidateAddressResp> = data => {
  return request({
    path: `/capital/create_withdraw_address`,
    method: 'POST',
    data,
    signature: true,
    contentType: 1,
  })
}

/**
 * 获取有提币地址的币列表
 * TODO: 地址
 */
export const getWithdrawAaddressCoin: MarkcoinRequest<IBaseReq, IValidateAddressResp[]> = params => {
  return request({
    path: `/capital/withdraw_address_coin`,
    method: 'GET',
    params,
  })
}

/**
 * 获取提币地址列表数据
 * TODO: 地址
 */
export const getWithdrawAaddressList: MarkcoinRequest<IWithdrawAddressListReq, IWithdrawAddressListResp[]> = data => {
  return request({
    path: `/v2/capital/list_withdraw_address`,
    method: 'POST',
    data: { coinId: data.coinId || '0' },
    contentType: 1,
    signature: 'decrypted',
  })
}

/**
 * 获取指定币种账户余额
 * TODO: 地址
 */
export const getWalletInfo: MarkcoinRequest<IWalletInfoReq, IWalletInfoResp> = params => {
  return request({
    path: `/wallet/info`,
    method: 'GET',
    params,
  })
}

/**
 * 划转
 * TODO: 地址
 */
export const transfer: MarkcoinRequest<ITransferApiReq> = data => {
  return request({
    path: `/v1/transfer`,
    method: 'POST',
    data,
  })
}

/**
 * 获取指定币种账户余额
 * TODO: 地址
 */
export const getMarginIsolatedTradeTypes: MarkcoinRequest<IBaseReq, IMarginIsolatedTradeTypesApiResp[]> = params => {
  return request({
    path: `margin/isolated/tradeTypes`,
    method: 'GET',
    params,
  })
}

/**
 * 获取用户合约资产列表
 * @returns
 */

export const getFuturesAsset: MarkcoinRequest = params => {
  return request({
    path: `/v1/perpetual/account/assets/v1/condition`,
    method: 'GET',
    params,
  })
}
