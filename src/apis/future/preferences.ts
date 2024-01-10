import request, { MarkcoinRequest } from '@/plugins/request'
import {
  ContractPreferenceNoParameterReq,
  ContractPreferenceNoParameterResp,
  ContractPreferenceResp,
  ContractAssetsMarginResp,
  ContractAssetsMarginSettingsReq,
  ContractMemberSettlementCurrencyResp,
  ContractPlatformSettlementCurrencyResp,
  ContractSettlementCurrencySettingsReq,
  ContractPlatformCAssetsMarginResp,
  MemberOpenContractReq,
  ContractPreferenceSettingReq,
  AutoMarginAllContractGroupResp,
  AutoMarginInfoResp,
  ContractMarginCoinLisResp,
  ContractSwitchVersionReq,
  ContractGroupAllResp,
  ContractGroupSettingsReq,
  ContractMarginCoinInfoResp,
  AutoAddMarginRecordLogReq,
  AutoAddMarginRecordLogResp,
  MerchantFiatCurrencyThresholdResp,
} from '@/typings/api/future/preferences'

/* ========== 合约偏好设置 ========== */

/**
 * 查询个人合约偏好设置
 * https://yapi.nbttfc365.com/project/44/interface/api/3763
 */
export const getMemberContractPreference: MarkcoinRequest<
  ContractPreferenceNoParameterReq,
  ContractPreferenceResp
> = () => {
  return request({
    path: `/v1/perpetual/preference`,
    method: 'GET',
  })
}

/**
 * 个人合约偏好设置
 * https://yapi.nbttfc365.com/project/44/interface/api/3635
 */
export const postMemberContractPreferenceSetting: MarkcoinRequest<
  ContractPreferenceSettingReq,
  ContractPreferenceNoParameterResp
> = options => {
  return request({
    path: `/v1/perpetual/preference/settings`,
    method: 'POST',
    data: {
      isAutoAdd: options.isAutoAdd, // 是否自动追加保证金  yes 是  no 否
      isAutoAddExtra: options.isAutoAddExtra, // 是否自动转入额外保证金  yes 是  no 否
      autoAddThreshold: options.autoAddThreshold, // 自动追加保证金 补齐保证金档位  低  70%  中 85%   高 100%  取值范围 (0-1]  例：0.70
      retrieveWay: options.retrieveWay, // 保证金取回方式   auto 自动取回 , manual 手动取回
      protect: options.protect, // 价差保护   open 开启   close 关闭
      isAvg: options.isAvg, // 扣款是否均摊     yes 是  no 否
      marginSource: options.marginSource, // 开仓保证金来源   --wallet   资金账户      --group   合约组剩余额外保证金
      autoAddQuota: options.autoAddQuota, // 用户设置的自动追加保证金法币 (USD) 价值
      autoCloseIsolatedPosition: options.autoCloseIsolatedPosition, // 无保证金自动关闭逐仓 open 开启 close 关闭
    },
  })
}

/**
 * 查询用户平台保证金币种设置
 * https://yapi.nbttfc365.com/project/44/interface/api/3803
 */
export const getPlatformContractAssetsMargin: MarkcoinRequest<
  ContractPreferenceNoParameterReq,
  ContractPlatformCAssetsMarginResp
> = () => {
  return request({
    path: `/v1/perpetual/mer/assetsMargin`,
    method: 'GET',
  })
}

/**
 * 查询用户保证金币种设置
 * https://yapi.nbttfc365.com/project/44/interface/api/3791
 */
export const getMemberContractAssetsMargin: MarkcoinRequest<
  ContractPreferenceNoParameterReq,
  ContractAssetsMarginResp
> = () => {
  return request({
    path: `/v1/perpetual/assetsMargin/settings/info`,
    method: 'GET',
  })
}

/**
 * 用户保证金币种设置
 * https://yapi.nbttfc365.com/project/44/interface/api/3627
 */
export const postMemberContractAssetsMarginSettings: MarkcoinRequest<
  ContractAssetsMarginSettingsReq,
  ContractPreferenceNoParameterResp
> = options => {
  return request({
    path: `/v1/perpetual/assetsMargin/settings`,
    method: 'POST',
    data: {
      isAvg: options.isAvg, // 扣款是否均摊     yes 是（等比扣款）no 否（顺序扣款）
      coinData: options.coinData, // 币种配置
    },
  })
}

/**
 * 查询用户平仓结算币种设置
 * https://yapi.nbttfc365.com/project/44/interface/api/3795
 */
export const getMemberClearingCoin: MarkcoinRequest<
  ContractPreferenceNoParameterReq,
  ContractMemberSettlementCurrencyResp
> = () => {
  return request({
    path: `/v1/perpetual/clearingCoin`,
    method: 'GET',
  })
}

/**
 * 查询平台平仓结算币种设置
 * https://yapi.nbttfc365.com/project/44/interface/api/3811
 */
export const getPlatformClearingCoin: MarkcoinRequest<
  ContractPreferenceNoParameterReq,
  ContractPlatformSettlementCurrencyResp
> = () => {
  return request({
    path: `/v1/perpetual/mer/clearingCoin`,
    method: 'GET',
  })
}

/**
 * 用户平仓结算币种设置
 * https://yapi.nbttfc365.com/project/44/interface/api/3631
 */
export const postMemberContractClearingCoinSettings: MarkcoinRequest<
  ContractSettlementCurrencySettingsReq,
  ContractPreferenceNoParameterResp
> = options => {
  return request({
    path: `/v1/perpetual/clearingCoin/settings`,
    method: 'POST',
    data: {
      coinData: options.coinData, // 币种配置
    },
  })
}

/**
 * 开通合约
 * https://yapi.nbttfc365.com/project/44/interface/api/3623
 */
export const postMemberOpenContract: MarkcoinRequest<
  MemberOpenContractReq,
  ContractPreferenceNoParameterResp
> = options => {
  return request({
    path: `/v1/perpetual/open/perpetual`,
    method: 'POST',
    data: {
      assetsMarginData: options.assetsMarginData, // 保证金币种配置
      clearingCoinData: options.clearingCoinData, // 结算币种配置
      perpetualVersion: options.perpetualVersion, // 合约版本
    },
  })
}

/**
 * 查询已设置自动追加保证金的合约组
 * https://yapi.nbttfc365.com/project/44/interface/api/3951
 */
export const getMemberAutoMarginAllContractGroup: MarkcoinRequest<
  ContractPreferenceNoParameterReq,
  AutoMarginAllContractGroupResp
> = () => {
  return request({
    path: `/v1/perpetual/group/autoMargin/all`,
    method: 'GET',
  })
}

/**
 * 用户自动追加保证金信息查询
 * https://yapi.nbttfc365.com/project/44/interface/api/4011
 */
export const getMemberAutoMarginInfo: MarkcoinRequest<ContractPreferenceNoParameterReq, AutoMarginInfoResp> = () => {
  return request({
    path: `/v1/perpetual/autoMargin/settings/info`,
    method: 'GET',
  })
}

/**
 * 修改保证金来源_查询是否有普通委托挂单
 * https://yapi.nbttfc365.com/project/44/interface/api/4379
 */
export const getMemberHasOpenOrders: MarkcoinRequest<ContractPreferenceNoParameterReq, boolean> = () => {
  return request({
    path: `/v1/perpetual/order/usr/existOpenOrder`,
    method: 'GET',
  })
}

/**
 * 合约组保证金币种
 * https://yapi.nbttfc365.com/project/44/interface/api/4207
 */
export const getMemberMarginCoinList: MarkcoinRequest<
  ContractPreferenceNoParameterReq,
  ContractMarginCoinLisResp
> = () => {
  return request({
    path: `/v1/perpetual/group/marginCoinList`,
    method: 'GET',
  })
}

/**
 * 切换合约版本
 * https://yapi.nbttfc365.com/project/44/interface/api/4275
 */
export const postMemberContractSwitchVersion: MarkcoinRequest<
  ContractSwitchVersionReq,
  ContractPreferenceNoParameterResp
> = options => {
  return request({
    path: `/v1/perpetual/version/switch`,
    method: 'POST',
    data: {
      version: options.version, // 合约版本，1，专业版，2，普通版
    },
  })
}

/**
 * 查询所有合约组
 * https://chandao.nbttfc365.com/zentao/doc-objectLibs-custom-0-98-1009.html#app=qa
 */
export const getMemberContractGroupAll: MarkcoinRequest<
  ContractPreferenceNoParameterReq,
  ContractGroupAllResp
> = () => {
  return request({
    path: `/v1/perpetual/group/queryAll`,
    method: 'GET',
  })
}

/**
 * 合约组追加保证金设置
 * https://yapi.nbttfc365.com/project/44/interface/api/4031
 */
export const postMemberContractGroupSettings: MarkcoinRequest<
  ContractGroupSettingsReq,
  ContractPreferenceNoParameterResp
> = options => {
  return request({
    path: `/v1/perpetual/group/autoMargin/settings`,
    method: 'POST',
    data: {
      groupAutoMarginSettingData: options.groupAutoMarginSettingData,
    },
  })
}

/**
 * 查询用户存在冻结和保证金的币种
 * https://yapi.nbttfc365.com/project/44/interface/api/4375
 */
export const getMemberQueryMarginCoinInfo: MarkcoinRequest<
  ContractPreferenceNoParameterReq,
  ContractMarginCoinInfoResp
> = () => {
  return request({
    path: `/v1/perpetual/assets/queryMarginCoinInfo`,
    method: 'GET',
  })
}

/**
 * 自动追加保证金记录列表
 * https://yapi.nbttfc365.com/project/44/interface/api/4395
 */
export const getMemberAutoAddMarginRecordLog: MarkcoinRequest<
  AutoAddMarginRecordLogReq,
  AutoAddMarginRecordLogResp
> = options => {
  return request({
    path: `/v1/perpetual/log/autoAddMarginRecord`,
    method: 'GET',
    params: {
      pageNum: options.pageNum,
      pageSize: options.pageSize,
    },
  })
}

/**
 * 开通合约专业版阈值
 * https://yapi.nbttfc365.com/project/44/interface/api/5739
 */
export const getMemberPerpetualThreshold: MarkcoinRequest<
  ContractPreferenceNoParameterReq,
  MerchantFiatCurrencyThresholdResp
> = () => {
  return request({
    path: `/v1/perpetual/specialize/perpetual/threshold`,
    method: 'GET',
  })
}
