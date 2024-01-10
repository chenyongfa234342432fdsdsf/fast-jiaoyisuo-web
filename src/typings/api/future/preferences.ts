/* ========== 个人合约偏好设置 ========== */
export type ContractPreferenceNoParameterReq = {}

export type ContractPreferenceNoParameterResp = {}

export type ContractPreferenceResp = {
  isAutoAdd: string // 是否自动追加保证金  yes 是  no 否
  autoAddThreshold: number // 自动追加保证金 补齐保证金档位  低  70%  中 85%   高 100%  取值范围 (0-1]  例：0.70
  autoAddQuota: number // 用户设置的自动追加保证金法币 (USD) 价值
  isAutoAddExtra: string // 是否自动转入额外保证金  yes 是  no 否
  retrieveWay: string //  保证金取回方式   auto 自动取回 , manual 手动取回
  protect: string // 价差保护   open 开启   close 关闭
  isAvg: string //  扣款是否均摊     yes 是  no 否
  marginSource: string // 开仓保证金来源   --wallet   资金账户      --group   合约组剩余额外保证金
  isSettingAutoMargin: boolean // 是否设置过自动追加保证金，true，设置过，false，未设置
  perpetualVersion: number // 合约版本
  autoCloseIsolatedPosition: string // 无保证金自动关闭逐仓 open 开启 close 关闭
  clearCoinSymbol: string // 结算币种
  hasOpenSpecializeVersion: number // 是否开通过专业版合约
}

export type ContractAssetsMarginCoinType = {
  coinId: number // 币种 Id
  sort: number // 排序
  rate: string // 汇率
  currencySymbol: string // 法币符号
  coinName: string // 币种名称
  selected?: boolean // 是否勾选
}

export type ContractAssetsMarginResp = {
  isAvg: string // 扣款是否均摊     yes 是（等比扣款）no 否（顺序扣款）
  coinData: Array<ContractAssetsMarginCoinType>
}

export type ContractAssetsMarginSettingType = {
  coinId: number // 币种 Id
  sort: number // 排序
  coinName?: string // 币种名称
}

export type ContractAssetsMarginSettingsReq = {
  isAvg: string // 扣款是否均摊     yes 是（等比扣款）no 否（顺序扣款）
  coinData: Array<ContractAssetsMarginSettingType>
}

export type ContractSettlementCurrencyType = {
  coinId: number // 币种 Id
  rate: string // 汇率
  currencySymbol: string // 法币符号
  coinName: string // 币种名称
}
export type ContractPlatformCAssetsMarginResp = Array<ContractAssetsMarginSettingType>

export type ContractMemberSettlementCurrencyResp = Array<ContractSettlementCurrencyType>

export type ContractPlatformSettlementCurrencyResp = Array<ContractSettlementCurrencyType>

export type ContractSettlementCurrencySettingsReq = {
  coinData: Array<{
    coinId: number // 币种 Id
  }>
}

export type MemberOpenContractReq = {
  assetsMarginData: ContractAssetsMarginResp // 保证金币种配置
  clearingCoinData: Array<{
    coinId: number // 币种 Id
  }> // 结算币种配置
  perpetualVersion: number // 合约版本

}

export type ContractPreferenceSettingReq = Partial<ContractPreferenceResp>

export type AutoMarginAllContractGroupType = {
  id: number // 合约组 Id
  name: string // 合约组名称
  isAutoAdd: string // 是否自动追加保证金 yes 是 no 否
  realizedProfit: string // 已实现盈亏
}

export type AutoMarginAllContractGroupResp = Array<AutoMarginAllContractGroupType>

export type AutoMarginInfoResp = {
  available: string // 可用 usd 数量
  currencySymbol: string // 法币符号
  isSettingAutoMargin: boolean // 是否设置过自动追加保证金，true，设置过，false，未设置过
  remaining: string // 上次设置保证金剩余量 usd
  maxSettingAmount: string // 最大可设置
  total: string // 已追加的保证金 usd
  lastTimeSettingAutoMargin: boolean // 上一次是否设置过自动追加保证金，true，设置过，false，未设置过
  lastTimeRemaining: string // 上次设置剩余量
}

export type MarginCoinLisType = {
  coinId: number // 币种 id
  coinName: string // 币种名称
}
export type ContractMarginCoinLisResp = {
  coinList: Array<MarginCoinLisType>
}

export type ContractSwitchVersionReq = {
  version: number // 合约版本，1，专业版，2，普通版
}

export type ContractGrouplistType = {
  id: string // id
  name: string // 合约组名称
  isAutoAdd: string // 是否自动追加保证金
  realizedProfit: string // 已实现盈亏
  unrealizedProfit: string // 未实现盈亏
  baseCoin: string // 法币符号
}

export type ContractGroupAllResp = {
  list: Array<ContractGrouplistType>
}

export type ContractGroupSettingsListType = {
  groupId: string // 合约组 Id
  isAutoAdd: string // 是否追加保证金，true，追加 false，不追加
}

export type ContractGroupSettingsReq = {
  groupAutoMarginSettingData: Array<ContractGroupSettingsListType>
}

export type ContractMarginCoinInfoResp = {
  list: Array<MarginCoinLisType>
}


export type AutoAddMarginRecordLogType = {
  id:	string	
  time:	number // 时间	
  coinName:	string // 币种名称	
  groupName: string // 合约组名称	
  amount:	string // 数量	
  status:	string // 状态	
  logType: string // 日志类型	
  operationType: string // 自动/手动
}

export type AutoAddMarginRecordLogReq = {
  pageNum: number
  pageSize: number
  startDate?: number
  endDate?: number
}

export type AutoAddMarginRecordLogResp = {
  pageNum: number // 页码
  pageSize: number // 条数
  total: number // 总数
  list: Array<AutoAddMarginRecordLogType>
}

export type MerchantFiatCurrencyThresholdResp= {
  symbol: string // 法币符号
  threshold: string // 阈值
}