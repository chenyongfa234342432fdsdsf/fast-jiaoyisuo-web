import { baseLayoutStore } from '@/store/layout'
import { t } from '@lingui/macro'
/** 资产相关模块 */

/** 资产左侧菜单配置 */
export enum AssetsRouteEnum {
  /** 总览 */
  overview = '/assets',
  /** 币币账户 */
  coins = '/assets/main',
  /** 杠杆账户 */
  margin = '/assets/margin',
  /** C2C 账户 */
  c2c = '/assets/c2c',
  /** 合约账户 */
  futures = '/assets/futures',
  /** 理财账户 */
  saving = '/assets/saving',
}

/** 资产推送订阅使用页面 */
export enum AssetWsSubscribePageEnum {
  /** 交易页 */
  trade = 'trade',
  /** 其他：资产总览、币币资产等页面 */
  other = 'other',
}

/** 接口错误状态码 */
export enum AssetApiErrorCode {
  /** 合约组不存在 */
  noExistGroupId = 10096004,
}

/** 币种选择 - 币种列表类型 - 充提 type 入参枚举 */
export enum CoinListTypeEnum {
  /** 充值 */
  deposit = 1,
  /** 提现 */
  withdraw = 2,
}

/**
 * 资产 - 币种选择类型
 */
export enum AssetsSelectCoinTypeEnum {
  /** 提币 */
  withdraw = 'withdraw',
  /** 充值 */
  deposit = 'deposit',
}

export const getAssetsDepositType = (type: CoinListTypeEnum) => {
  return {
    [CoinListTypeEnum.deposit]: AssetsSelectCoinTypeEnum.deposit,
    [CoinListTypeEnum.withdraw]: AssetsSelectCoinTypeEnum.withdraw,
  }[type]
}

/** 币的充提开启状态 */
export enum CoinStateEnum {
  /** 币充提状态/是否需要Memo标签状态 - 开启 */
  open = 1,
  /** 币充提状态/是否需要Memo标签状态 - 关闭 */
  close = 2,
}

/** 币的充提是否热门状态 */
export enum CoinHotStateEnum {
  /** 币充提状态 - 开启 */
  open = 1,
  /** 币充提状态 - 关闭 */
  close = 2,
}

/** 货币代码展示 */
export enum CurrencySymbolEnum {
  /** 货币符号 - 如：$、¥ */
  symbol = 'symbol',
  /** 货币简称 - 如：CNY、USD */
  code = 'code',
}

/** 折算法币符号 */
export enum CurrencyNameEnum {
  // 计算 usdBalance 值（折合美元金额，过滤小额资产处用）
  usd = 'USD', // 美元
}

/** 法币折算基础币 */
export enum DefaultRateBaseCoin {
  /** 默认 USDT */
  symbol = 'USDT',
  usdtRate = '1',
}

/**
 * 财务记录大类-tab 类型 - 资产选择 logType 类型
 */
export enum FinancialRecordLogTypeEnum {
  /** 总览 */
  overview = 0,
  // /** 现货 */
  // spot = 1,
  /** 充提 */
  main = 2,
  /** 借还款 */
  borrow = 3,
  /** 合约 */
  futures = 4,
  /** 手续费 */
  commission = 5,
  /** 衍生品 */
  derivative = 6,
  /** 其他 */
  other = 7,
  /** 代理商 - 返佣 */
  rebate = 8,
  /** c2c */
  c2c = 9,
}

export enum FinancialRecordListFromPage {
  /** 财务记录 - 合约：区分某逐仓》某逐仓无符号黑色展示，其他类型都需要涨跌色 */
  futuresRecordList = 'futuresRecordList',
  other = 'other',
}

/** 财务记录状态 - 充币状态名称 */
export function getFinancialRecordLogTypeEnumName(type: FinancialRecordLogTypeEnum | any): string {
  return {
    [FinancialRecordLogTypeEnum.overview]: t`assets.financial-record.tabs.overview`,
    [FinancialRecordLogTypeEnum.main]: t`trade.c2c.trade`,
    [FinancialRecordLogTypeEnum.futures]: t`future.funding-history.future-select.future`,
    [FinancialRecordLogTypeEnum.derivative]: t`constants_assets_index_2559`,
    [FinancialRecordLogTypeEnum.other]: t`constants_assets_index_2560`,
    [FinancialRecordLogTypeEnum.commission]: t`order.columns.logFee`,
    [FinancialRecordLogTypeEnum.rebate]: t`constants_assets_index_5101570`,
    [FinancialRecordLogTypeEnum.c2c]: 'C2C',
  }[type]
}

/**
 * 财务记录 - 公共 - 类型
 */
export enum FinancialRecordTypeEnum {
  /** 全部 */
  all = 0,
  /** 充值 */
  deposit = 201,
  /** 提币 */
  withdraw = 202,
  /** Pay */
  pay = 203,
  /** 冲正 */
  reversal = 204,
  /** C2C 赔付 */
  spotCompensate = 205,
  /** 划转 */
  spotTransfer = 206,
  /** 现货 - 提取保证金 */
  spotExtractBond = 207,
  /** 现货 - 充值保证金 */
  spotRechargeBond = 208,
  /** 现货合约划转 */
  spotFuturesTransfer = 209,
  /** 现货手续费 */
  spotCommission = 501,
  /** 合约手续费 */
  futuresCommission = 502,
  /** 提币手续费 */
  extractCommission = 503,
  /** 锁仓手续费 */
  LockPositionCommission = 504,
  /** 合约组保证金 */
  futuresGroupMargin = 401,
  /** 开仓手续费 */
  openPositionFee = 401,
  /** 平仓手续费 */
  closePositionFee = 402,
  /** 平仓盈亏 */
  closePositionPnl = 403,
  /** 强制平仓 */
  liquidation = 404,
  /** 强制减仓 */
  compulsoryReduction = 405,
  /** 资金费用 */
  fundsFee = 406,
  /** 提取保证金 */
  extractBond = 407,
  /** 充值保证金 */
  rechargeBond = 408,
  /** 锁仓手续费 */
  futuresLockPositionCommission = 409,
  /** 迁移 */
  migrate = 410,
  /** 强平手续费 */
  forcedClosePositionFee = 411,
  /** 穿仓保险金注入 */
  benefitsInjection = 412,
  /** 现货合约划转 */
  futuresTransfer = 413,
  /** 现货手续费返佣 */
  spotFee = 801,
  /** 合约手续费返佣 */
  futuresFee = 802,
  /** 借币利息返佣 */
  loanInterest = 803,
  /** 划转 */
  c2cTransfer = 901,
  /** PAY */
  c2cPay = 902,
  /** C2C 赔付 */
  c2cCompensate = 903,
  /** 融合商户用户入金 */
  fusionDeposit = 210,
  /** 融合商户用户出金 */
  fusionExtract = 211,
  /** 第三方购买 */
  thirdPartyExtractBuy = 906,
  /** 第三方卖出 */
  thirdPartyExtractSell = 907,
}

/**
 * 现货交易记录 tab
 */
export enum SpotHistoryTabEnum {
  /** 充值或提币所有记录 */
  all = 'all',
  /** 当前币种记录 */
  currentCoin = 'currentCoin',
}

/**
 * 财务记录 - 合约、现货 - 充值、提取保证金类型
 * @type 充值、提取保证金类型
 */
export const RecordRechargeExtractBond: FinancialRecordTypeEnum[] = [
  FinancialRecordTypeEnum.extractBond,
  FinancialRecordTypeEnum.rechargeBond,
  FinancialRecordTypeEnum.spotExtractBond,
  FinancialRecordTypeEnum.spotRechargeBond,
  FinancialRecordTypeEnum.futuresTransfer,
  FinancialRecordTypeEnum.spotFuturesTransfer,
]

/**
 * 财务记录 - 融合模式
 */
export const RecordFusionTypeList: FinancialRecordTypeEnum[] = [
  FinancialRecordTypeEnum.fusionDeposit,
  FinancialRecordTypeEnum.fusionExtract,
]

/**
 * 财务记录 - 变动值不需要加减的符号的日志类型
 * @type 日志类型
 */
export const RecordValueNoSymbol: FinancialRecordTypeEnum[] = [FinancialRecordTypeEnum.migrate]

/**
 * 财务记录 - 合约相关划转类型
 */
export const AssetsTransferTypeList: FinancialRecordTypeEnum[] = [
  FinancialRecordTypeEnum.spotFuturesTransfer,
  FinancialRecordTypeEnum.futuresTransfer,
]

/**
 * 财务记录 - 合约类型
 * @type 开仓手续费/平仓手续费/平仓盈亏/强制平仓/强制减仓/资金费用/提取保证金/充值保证金/锁仓手续费/迁移/强平手续费/穿仓保险金注入
 */
export const RecordFuturesTypeList: FinancialRecordTypeEnum[] = [
  FinancialRecordTypeEnum.openPositionFee,
  FinancialRecordTypeEnum.closePositionFee,
  FinancialRecordTypeEnum.closePositionPnl,
  FinancialRecordTypeEnum.liquidation,
  FinancialRecordTypeEnum.compulsoryReduction,
  FinancialRecordTypeEnum.fundsFee,
  FinancialRecordTypeEnum.extractBond,
  FinancialRecordTypeEnum.rechargeBond,
  FinancialRecordTypeEnum.futuresLockPositionCommission,
  FinancialRecordTypeEnum.migrate,
  FinancialRecordTypeEnum.forcedClosePositionFee,
  FinancialRecordTypeEnum.benefitsInjection,
  FinancialRecordTypeEnum.futuresTransfer,
  FinancialRecordTypeEnum.spotFuturesTransfer,
]

/**
 * 财务记录 - C2C 类型
 * @type 划转/PAY/C2C 赔付
 */
export const RecordC2CTypeList: FinancialRecordTypeEnum[] = [
  FinancialRecordTypeEnum.c2cTransfer,
  FinancialRecordTypeEnum.c2cPay,
  FinancialRecordTypeEnum.c2cCompensate,
  FinancialRecordTypeEnum.spotCompensate,
  FinancialRecordTypeEnum.spotTransfer,
  FinancialRecordTypeEnum.thirdPartyExtractBuy,
  FinancialRecordTypeEnum.thirdPartyExtractSell,
]

/** 财务记录类型名称 */
// export function getFinancialRecordTypeEnumName(type: FinancialRecordTypeEnum): string {
//   return {
//     [FinancialRecordTypeEnum.all]: t`common.all`,
//     [FinancialRecordTypeEnum.withdraw]: t`assets.financial-record.search.withdraw`,
//     [FinancialRecordTypeEnum.deposit]: t`assets.financial-record.search.deposit`,
//     [FinancialRecordTypeEnum.reversal]: t`constants_assets_index_2561`,
//     [FinancialRecordTypeEnum.pay]: 'Pay',
//     [FinancialRecordTypeEnum.spotCommission]: t`constants_assets_index_2741`,
//     [FinancialRecordTypeEnum.futuresCommission]: t`constants_assets_index_2742`,
//     [FinancialRecordTypeEnum.extractCommission]: t`constants_assets_index_2743`,
//     [FinancialRecordTypeEnum.LockPositionCommission]: t`constants/assets/common-7`,
//     // [FinancialRecordTypeEnum.openPosition]: t`constants/assets/common-0`,
//     // [FinancialRecordTypeEnum.closePosition]: t`constants/assets/common-1`,
//     // [FinancialRecordTypeEnum.openPositionCommission]: t`constants/assets/common-2`,
//     // [FinancialRecordTypeEnum.closePositionCommission]: t`constants/assets/common-3`,
//     [FinancialRecordTypeEnum.closePositionPnl]: t`constants/assets/common-4`,
//     [FinancialRecordTypeEnum.liquidation]: t`constants/assets/common-5`,
//     [FinancialRecordTypeEnum.compulsoryReduction]: t`constants/assets/common-6`,
//     // [FinancialRecordTypeEnum.fundingFee]: t`constants/assets/common-8`,
//     // [FinancialRecordTypeEnum.transfer]: t`constants/assets/common-9`,
//     // [FinancialRecordTypeEnum.liquidationReturn]: t`constants/assets/common-10`,
//     // [FinancialRecordTypeEnum.liquidationCommission]: t`constants/assets/common-11`,
//     [FinancialRecordTypeEnum.benefitsInjection]: t`constants/assets/common-12`,
//     [FinancialRecordTypeEnum.extractBond]: t`constants/assets/common-13`,
//     [FinancialRecordTypeEnum.rechargeBond]: t`constants/assets/common-14`,
//   }[type]
// }

/**
 * 财务记录详情 - 返佣类型列表
 * @type 现货手续费返佣/合约手续费返佣/借币利息返佣
 */
export const RecordRebateTypeList: FinancialRecordTypeEnum[] = [
  FinancialRecordTypeEnum.spotFee,
  FinancialRecordTypeEnum.futuresFee,
  FinancialRecordTypeEnum.loanInterest,
]

/** 财务记录状态 - 提现状态 */
export enum FinancialRecordWithdrawStateEnum {
  /** 待审核 */
  toBeReviewed = 1,
  /** 处理中 */
  processing = 2,
  /** 已完成 */
  completed = 3,
  /** 已撤销 */
  revocation = 4,
  /** 处理中 */
  processing2 = 5,
  /** 已汇出 */
  outward = 6,
  /** 驳回 */
  reject = 7,
  /** 失败 */
  fail = 8,
}

/** 财务记录状态 - 提现状态名称 */
export function getFinancialRecordWithdrawStateEnumName(state: FinancialRecordWithdrawStateEnum): string {
  return {
    [FinancialRecordWithdrawStateEnum.toBeReviewed]: t`constants/assets/index-19`,
    [FinancialRecordWithdrawStateEnum.processing]: t`constants/assets/index-20`,
    [FinancialRecordWithdrawStateEnum.completed]: t`constants/assets/index-21`,
    [FinancialRecordWithdrawStateEnum.revocation]: t`order.constants.status.canceled`,
    [FinancialRecordWithdrawStateEnum.processing2]: t`constants/assets/index-20`,
    [FinancialRecordWithdrawStateEnum.outward]: t`constants/assets/index-22`,
    [FinancialRecordWithdrawStateEnum.reject]: t`constants/assets/index-23`,
    [FinancialRecordWithdrawStateEnum.fail]: t`assets.financial-record.search.failure`,
  }[state]
}

/** 财务记录状态 - 充币状态 */
export enum FinancialRecordDepositeStateEnum {
  /** 确认中 */
  confirming = 0,
  /** 已完成 */
  completed = 3,
  /** 失败 */
  fail = 4,
}

/** 财务记录状态 - 充币状态名称 */
export function getFinancialRecordDepositeStateEnumName(state: FinancialRecordDepositeStateEnum): string {
  return {
    [FinancialRecordDepositeStateEnum.confirming]: t`constants/assets/index-24`,
    [FinancialRecordDepositeStateEnum.completed]: t`constants/assets/index-21`,
    [FinancialRecordDepositeStateEnum.fail]: t`assets.financial-record.search.failure`,
  }[state]
}

/**
 * 财务日志详情 - 渠道
 */

export enum RecordDetailsChannelIdEnum {
  /** 区块链充提币 */
  blockchain = 1,
  /** pay */
  platform,
  /** 平台内区块链地址 */
  platformBlockchain,
}

/** 财务记录状态 - 划转状态 */
export enum FinancialRecordTransferStateEnum {
  /** 已完成 */
  completed = 1,
}

/** 财务记录状态 - 划转状态名称 */
export function FinancialRecordTransferStateEnumName(state: FinancialRecordTransferStateEnum): string {
  return {
    [FinancialRecordTransferStateEnum.completed]: t`constants/assets/index-21`,
  }[state]
}

/** 财务记录状态 */
// 1、进行中 2、成功 3、失败 4、错误
export enum FinancialRecordStateEnum {
  /** 进行中 */
  processing = 1,
  /** 成功 */
  success,
  /** 失败 */
  fail,
  /** 错误 */
  error,
}
/** 财务记录状态 - 充币状态名称 */
export function getFinancialRecordStateEnumName(state: FinancialRecordStateEnum): string {
  return {
    [FinancialRecordStateEnum.processing]: t`assets.financial-record.search.underway`,
    [FinancialRecordStateEnum.success]: t`assets.enum.tradeRecordStatus.success`,
    [FinancialRecordStateEnum.fail]: t`assets.financial-record.search.failure`,
    [FinancialRecordStateEnum.error]: t`assets.financial-record.search.error`,
  }[state]
}

/** 充提 - 财务记录类型 */
export const FinancialRecordTypeMainList = [
  {
    id: FinancialRecordTypeEnum.withdraw,
    // name: getFinancialRecordTypeEnumName(FinancialRecordTypeEnum.withdraw),
  },
  {
    id: FinancialRecordTypeEnum.deposit,
    // name: getFinancialRecordTypeEnumName(FinancialRecordTypeEnum.deposit),
  },
  {
    id: FinancialRecordTypeEnum.reversal,
    // name: getFinancialRecordTypeEnumName(FinancialRecordTypeEnum.reversa),
  },
  {
    id: FinancialRecordTypeEnum.pay,
    // name: getFinancialRecordTypeEnumName(FinancialRecordTypeEnum.pay),
  },
]

/** 手续费 - 财务记录类型 */
export const FinancialRecordTypeCommissionList = [
  {
    id: FinancialRecordTypeEnum.spotCommission,
  },
  // TODO 功能未好，暂时注释
  // {
  //   id: FinancialRecordTypeEnum.futuresCommission,
  // },
  {
    id: FinancialRecordTypeEnum.extractCommission,
  },
  // TODO 功能未好，暂时注释
  // {
  //   id: FinancialRecordTypeEnum.LockPositionCommission,
  // },
]

/** 所有财务记录状态 */
export const FinancialRecordStateList = [
  {
    id: FinancialRecordStateEnum.processing,
    // name: getFinancialRecordStateEnumName(FinancialRecordStateEnum.processing),
  },
  {
    id: FinancialRecordStateEnum.success,
    // name: getFinancialRecordStateEnumName(FinancialRecordStateEnum.success),
  },
  {
    id: FinancialRecordStateEnum.fail,
    // name: getFinancialRecordStateEnumName(FinancialRecordStateEnum.fail),
  },
  {
    id: FinancialRecordStateEnum.error,
    // name: getFinancialRecordStateEnumName(FinancialRecordStateEnum.error),
  },
]

/** 财务记录 PayType */
export enum FinancialRecordPayTypeEnum {
  /** 发出 */
  send = 1,
  /** 接收 */
  receive = 2,
}

/** 财务记录日期时间选择器 active 类型 */
export enum FinancialRecordTimePickerEnum {
  /** 开始时间选择器 */
  startTime = 1,
  /** 结束时间选择器 */
  endTime = 2,
}

/** 资产提现 tabs 类型 - （和查提币的币种详情信息接口的入参保持一致，不要随意修改枚举值） */
export enum WithDrawTypeEnum {
  /** 区块链提币 */
  blockChain = 1,
  /** brand Pay(平台内提币) */
  platform = 2,
}

/** 财务记录类型名称 */
export function getWithDrawTypeEnumName(type: WithDrawTypeEnum | any): string {
  return {
    [WithDrawTypeEnum.platform]: t`features_assets_common_withdraw_action_index_5101072`,
    [WithDrawTypeEnum.blockChain]: t`assets.withdraw.blockchain`,
  }[type]
}

/** 账户列表 - 划转功能用到 */
export enum TransferAccountListEnum {
  /** 逐仓杠杆账户 */
  marginIsolatedAccount = 1,
  /** 全仓杠杆账户 */
  marginCrossAccount = 2,
  /** C2C 账户 */
  C2CAccount = 3,
  /** 合约账户 */
  futuresAccount = 5,
  // 4 认购账户已不用
}

/** 划转类型 */
export enum TransferTypeEnum {
  /** 币币至合约 */
  transfers30 = 30,
  /** 合约至币币 */
  transfers31 = 31,
  /** 币币至认购 */
  transfers34 = 34,
  /** 认购至币币 */
  transfers35 = 35,
  /** OTC 至币币 */
  transfers36 = 36,
  /** 币币至 OTC */
  transfers37 = 37,
  /** 币币至逐仓杠杆 */
  transfers50 = 50,
  /** 逐仓杠杆至币币 */
  transfers51 = 51,
  /** 币币至全仓杠杆 */
  transfers52 = 52,
  /** 全仓杠杆至币币 */
  transfers53 = 53,
}

/** 钱包类型 */
export enum WalletTypeEnum {
  /** 杠杆钱包 */
  margin = 1,
  /** 币币钱包 */
  coin = 2,
  /** OTC */
  OTC = 3,
  /** IEO 钱包 */
  IEO = 4,
  /** 合约钱包 */
  futures = 5,
  /** 杠杆全仓钱包 */
  marginCross = 6,
  /** 逐仓杠杆钱包 */
  marginIsolated = 7,
}

/** 合约 - 新增常量 */

/**
 * 财务记录详情 - 展示费用明细模块类型列表
 * @type 资金费用/强平手续费/开仓手续费/平仓手续费/平仓盈亏/锁仓手续费
 */
export const RecordExpenseDetailsList: FinancialRecordTypeEnum[] = [
  FinancialRecordTypeEnum.fundsFee,
  FinancialRecordTypeEnum.forcedClosePositionFee,
  FinancialRecordTypeEnum.openPositionFee,
  FinancialRecordTypeEnum.closePositionFee,
  FinancialRecordTypeEnum.closePositionPnl,
  FinancialRecordTypeEnum.futuresLockPositionCommission,
]
/**
 * 财务记录详情 - 展示成交明细模块类型列表
 * @type 开仓/平仓/强制平仓/强制减仓
 */
export const RecordTransactionDetailsList: FinancialRecordTypeEnum[] = [
  FinancialRecordTypeEnum.liquidation,
  FinancialRecordTypeEnum.compulsoryReduction,
]
/**
 * 财务记录详情 - 展示成交明细模块类型列表
 * @type 充值/冲正/提币/pay
 */
export const RecordRechargeTypeList: FinancialRecordTypeEnum[] = [
  FinancialRecordTypeEnum.deposit,
  FinancialRecordTypeEnum.reversal,
  FinancialRecordTypeEnum.withdraw,
  FinancialRecordTypeEnum.pay,
]
/**
 * 财务记录详情 - 手续费模块类型列表
 * @type 现货手续费/合约手续费/锁仓手续费/提币手续费
 */
export const RecordFeeTypeList: FinancialRecordTypeEnum[] = [
  // FinancialRecordTypeEnum.spotCommission,
  FinancialRecordTypeEnum.futuresCommission,
  FinancialRecordTypeEnum.LockPositionCommission,
  FinancialRecordTypeEnum.extractCommission,
]
/**
 * 财务记录 - 状态
 */
export enum StatusEnum {
  /** 已成交 */
  closed = 'closed',
  /** 部成已撤 */
  partHasBeenWithdrawn = 'partHasBeenWithdrawn',
  /** 已撤销 */
  rescinded = 'rescinded',
}

/**
 * 财务记录 - 委托类型
 */
export enum DelegationTypeEnum {
  /** 限价委托 */
  limitOrder = 1,
  /** 市价委托 */
  marketOrder,
  /** 计划委托 */
  planDelegation,
  /** 市价止盈 */
  marketTargetProfit,
  /** 限价止盈 */
  limitTargetProfit,
  /** 市价止损 */
  marketStopLoss,
  /** 限价止损 */
  limitStopLoss,
  /** 强平 */
  liquidation,
  /** 强减 */
  forcedDecrement,
}

/**
 * 财务记录 - 交易方向
 */
export enum TransactionDirectionEnum {
  /** 做多 */
  buy = 'buy',
  /** 做空 */
  sell = 'sell',
  /** 平多 */
  flatBuy = 'flatBuy',
  /** 平空 */
  flatSell = 'flatSell',
}

/**
 * 资产 - 数据字典
 */
export enum AssetsDictionaryTypeEnum {
  /** 财务日志状态 */
  recordStatusType = 'statusInd',
  /** 财务日志列表 - 类型 - 总览 */
  recordType = 'typeCd',
  /** 财务日志列表 - 类型 - 充提 */
  recordWithdrawType = 'dwTypeCd',
  /** 财务日志列表 - 类型 - 手续费 */
  recordFeeType = 'feeTypeCd',
  /** 财务日志列表 - 类型 - 合约 */
  recordPerpetualType = 'perpetualTypeCd',
  /** 合约组记录列表 - 类型 - 保证金 */
  recordPerpetualMarginType = 'marginTypeCd',
  /** 财务日志列表 - 类型 - 返佣 */
  recordCommissionType = 'commissionTypeCd',
  /** 合约 - 合约类型：交割/永续 */
  perpetualSwapType = 'swapTypeInd',
  /** 合约 - 保证金触发类型：手动/自动 */
  perpetualOperationType = 'operationTypeCd',
  /** 合约 - 委托单限价类型：限价/市价 */
  perpetualOrderEntrustType = 'ctt_entrust_type_ind',
  /** 合约 - 委托单类型：限价/市价/强平/强减 */
  perpetualOrderType = 'ctt_order_type_ind',
  /** 合约 - 委托单状态：已撤销/部成已撤 */
  perpetualOrderEntrustStatusType = 'entrust_status_cd',
  /** 合约 - 计划委托类型：开多/开空/平多/平空 */
  perpetualOrderSideType = 'ctt_side_ind',
  /** 合约 - 仓位类型：多仓位/空仓位 */
  perpetualPositionType = 'ctt_position_side',
  /** 合约 - 资金类型 */
  perpetualBillType = 'perpetualBillType',
  /** 合约 - 迁移类型 */
  perpetualMigrateType = 'perpetualMigrateType',
  /** 财务日志列表 - 类型-c2c */
  recordC2CType = 'c2cTypeCd',
  /** c2c-业务类型 */
  c2cBillLogType = 'c2cBillLogTypeStr',
  /** c2c-划转账户类型 */
  assetAccountType = 'assetAccountType',
  /** c2c-赔付申诉原因 */
  c2cOrderAppealReason = 'c2c_order_appeal_reason',
  /** 代理商 - 返佣类型 */
  rebateType = 'rebate_type_cd',
  /** 钱包财务记录 */
  walletOverviewType = 'fastpayBillType',
}

export enum ErrorTypeEnum {
  authError = 'authError', // 身份失效错误
  serverError = 'serverError', // 服务端错误
  uncategorizedError = 'uncategorizedError', // 未分类的错误
}
