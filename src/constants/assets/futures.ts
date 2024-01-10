/**
 * 合约资产
 */
import { t } from '@lingui/macro'
import { UserMarginSourceEnum } from '@/constants/user'
/**
 * 合约组记录 tab
 */
export enum FuturesHistoryTabEnum {
  /** 合约组记录 */
  futures = 'futures',
  /** 保证金记录 */
  margin = 'margin',
}

/**
 * 合约组保证金币种数量类型
 */
export enum MarginAssetTypeEnum {
  /** 保证金币种总数量 */
  totalAmount = 'totalAmount',
  /** 保证金币种冻结数量 */
  lockAmount = 'lockAmount',
  /** 保证金币种可用数量 */
  availableAmount = 'availableAmount',
}

/**
 * 合约组收益搜索类型 - 合约组资产首页搜索处用
 */
export enum FuturesAssetsTypeEnum {
  /** 仅看正收益 */
  just = 'just',
  /** 仅看负收益 */
  negative = 'negative',
}

/**
 * 合约组收益搜索类型
 */
export function getFuturesAssetsTypeList() {
  return [
    {
      label: t`constants_assets_futures_5101424`,
      value: FuturesAssetsTypeEnum.just,
    },
    {
      label: t`constants_assets_futures_5101425`,
      value: FuturesAssetsTypeEnum.negative,
    },
  ]
}

/**
 * 合约组记录类型
 */
export enum FuturesHistoryTypeEnum {
  /** 提取保证金 */
  withdrawBail = 1,
  /** 充值保证金 */
  depositBail,
  /** 开仓 */
  openPosition,
  /** 平仓 */
  closePosition,
  /** 已实现盈亏 */
  realizedPNL,
  /** 开仓手续费 */
  openPositionCommission,
  /** 平仓手续费 */
  closePositionCommission,
  /** 资金费用 */
  fundingFee,
  /** 锁仓手续费 */
  lockupFee,
  /** 强制平仓 */
  liquidation,
  /** 强制减仓 */
  compulsoryReduction,
  /** 迁移 */
  transfer,
  /** 强平返还 */
  liquidationReturn,
  /** 强平手续费 */
  liquidationCommission,
  /** 穿仓保险金注入 */
  benefitsInjection,
}

/**
 * 保证金记录类型名称
 */
export function getFuturesHistoryTypeName(type: FuturesHistoryTypeEnum) {
  return {
    [FuturesHistoryTypeEnum.withdrawBail]: t`constants_assets_futures_5101426`,
    [FuturesHistoryTypeEnum.depositBail]: t`constants_assets_futures_5101427`,
    [FuturesHistoryTypeEnum.openPosition]: t`constants/assets/common-0`,
    [FuturesHistoryTypeEnum.closePosition]: t`constants/assets/common-1`,
    [FuturesHistoryTypeEnum.realizedPNL]: t`features_assets_futures_futures_details_position_details_list_5101358`,
    [FuturesHistoryTypeEnum.openPositionCommission]: t`constants/assets/common-2`,
    [FuturesHistoryTypeEnum.closePositionCommission]: t`constants/assets/common-3`,
    [FuturesHistoryTypeEnum.fundingFee]: t`constants/assets/common-8`,
    [FuturesHistoryTypeEnum.lockupFee]: t`constants/assets/common-7`,
    [FuturesHistoryTypeEnum.liquidation]: t`constants/assets/common-5`,
    [FuturesHistoryTypeEnum.compulsoryReduction]: t`constants/assets/common-6`,
    [FuturesHistoryTypeEnum.transfer]: t`constants/assets/common-9`,
    [FuturesHistoryTypeEnum.liquidationReturn]: t`constants/assets/common-10`,
    [FuturesHistoryTypeEnum.liquidationCommission]: t`constants/assets/common-11`,
    [FuturesHistoryTypeEnum.benefitsInjection]: t`constants/assets/common-12`,
  }[type]
}

/**
 * 合约组记录 - 保证金类型列表
 */
export const FuturesHistoryBailTypeList = [
  { label: t`constants_assets_futures_5101426`, value: FuturesHistoryTypeEnum.withdrawBail },
  { label: t`constants_assets_futures_5101427`, value: FuturesHistoryTypeEnum.depositBail },
]

/**
 * 合约组记录 - 合约组记录类型列表
 */
export const FuturesHistoryFuturesTypeList = [
  { label: t`constants/assets/common-0`, value: FuturesHistoryTypeEnum.openPosition },
  { label: t`constants/assets/common-1`, value: FuturesHistoryTypeEnum.closePosition },
  {
    label: t`features_assets_futures_futures_details_position_details_list_5101358`,
    value: FuturesHistoryTypeEnum.realizedPNL,
  },
  { label: t`constants_assets_futures_5101426`, value: FuturesHistoryTypeEnum.withdrawBail },
  { label: t`constants_assets_futures_5101427`, value: FuturesHistoryTypeEnum.depositBail },
  { label: t`constants/assets/common-2`, value: FuturesHistoryTypeEnum.openPositionCommission },
  { label: t`constants/assets/common-3`, value: FuturesHistoryTypeEnum.closePositionCommission },
  { label: t`constants/assets/common-8`, value: FuturesHistoryTypeEnum.fundingFee },
  { label: t`constants/assets/common-7`, value: FuturesHistoryTypeEnum.lockupFee },
  { label: t`constants/assets/common-5`, value: FuturesHistoryTypeEnum.liquidation },
  { label: t`constants/assets/common-6`, value: FuturesHistoryTypeEnum.compulsoryReduction },
  { label: t`constants/assets/common-9`, value: FuturesHistoryTypeEnum.transfer },
  { label: t`constants/assets/common-10`, value: FuturesHistoryTypeEnum.liquidationReturn },
  { label: t`constants/assets/common-11`, value: FuturesHistoryTypeEnum.liquidationCommission },
  { label: t`constants/assets/common-12`, value: FuturesHistoryTypeEnum.benefitsInjection },
]

/**
 * 合约 - 止盈止损弹窗 tab
 */
export enum StopLimitTabEnum {
  /** 止盈止损 */
  stopLimit = 1,
  /** 仓位止盈止损 */
  positionStopLimit,
}

/**
 * 合约 - 触发价格类型 - 止盈止损处用
 */
export enum TriggerPriceTypeEnum {
  /** 最新价格 */
  new = 'new',
  /** 标记价格 */
  mark = 'mark',
}
/** 合约 - 触发价格类型 - 止盈止损处用 */
export const getTriggerPriceTypeEnumName = (type: string) => {
  return {
    [TriggerPriceTypeEnum.new]: t`constants_order_5101075`,
    [TriggerPriceTypeEnum.mark]: t`future.funding-history.index-price.column.mark-price`,
  }[type]
}
/** 合约 - 触发价格类型列表 - 止盈止损处用 */
export function getTriggerPriceTypeList() {
  return [
    {
      name: t`constants_order_5101075`,
      type: TriggerPriceTypeEnum.new,
    },
    {
      name: t`future.funding-history.index-price.column.mark-price`,
      type: TriggerPriceTypeEnum.mark,
    },
  ]
}

/**
 * 合约 - 委托价格类型
 */
export enum EntrustTypeEnum {
  /** 市价 */
  market = 'market',
  /** 限价 */
  limit = 'limit',
}
/**
 * 合约 - 委托价格类型列表
 */
export function getEntrustTypeList() {
  return [
    {
      name: t`trade.tab.orderType.marketPrice`,
      type: EntrustTypeEnum.market,
    },
    {
      name: t`trade.tab.orderType.currentPrice`,
      type: EntrustTypeEnum.limit,
    },
  ]
}
export const getEntrustTypeEnumName = (type: string) => {
  return {
    [EntrustTypeEnum.market]: t`trade.tab.orderType.marketPrice`,
    [EntrustTypeEnum.limit]: t`trade.tab.orderType.currentPrice`,
  }[type]
}

/**
 * 合约 - 触发方向类型
 */
export enum StopLimitTriggerDirectionEnum {
  /** 向上 */
  up = 'up',
  /** 向下 */
  down = 'down',
}

/**
 * 合约 - 策略类型类型
 */
export enum StopLimitStrategyTypeEnum {
  /** 止盈 */
  stopProfit = 'stop_profit',
  /** 止损 */
  stopLoss = 'stop_loss',
}

/**
 * 合约组详情 - 切换资产饼图展示类型
 */
export enum FuturesChartDataTypeEnum {
  /** 资金占比 */
  assetScale = 1,
  /** 保证金占比 */
  depositScale = 2,
  /** 持仓资产风险占比 */
  positionRiskScale = 3,
}

/** 合约组详情 - 切换资产饼图展示类型名称 */
export function getFuturesChartDataTypeEnumName(type: FuturesChartDataTypeEnum | any): string {
  return {
    [FuturesChartDataTypeEnum.assetScale]: t`constants_assets_futures_5101428`,
    [FuturesChartDataTypeEnum.depositScale]: t`constants_assets_futures_5101429`,
    [FuturesChartDataTypeEnum.positionRiskScale]: t`constants_assets_futures_5101430`,
  }[type]
}

/** 合约组详情 - 切换资产饼图展示类型列表 */
export const FuturesChartDataTypeEnumList = [
  {
    id: FuturesChartDataTypeEnum.assetScale,
  },
  {
    id: FuturesChartDataTypeEnum.depositScale,
  },
  {
    id: FuturesChartDataTypeEnum.positionRiskScale,
  },
]

export enum DelegateTypeEnum {
  /** 市价委托交易 */
  mark = '0',
  /** 限价委托交易 */
  limit = '1',
}

export enum TradeModeEnum {
  /** 现货交易 */
  spot = 'spot',
  /** 合约交易 */
  futures = 'futures',
  /** 杠杆交易 */
  margin = 'margin',
}

export const getDelegateTypeMap = () => {
  return {
    [DelegateTypeEnum.mark]: t`trade.tab.orderType.marketPrice`,
    [DelegateTypeEnum.limit]: t`trade.tab.orderType.currentPrice`,
  }
}
export enum TradeMarginEnum {
  /** 逐仓 */
  isolated = 'isolated',
  /** 全仓 */
  margin = 'margin',
}

export type ITradeSpotTabs = TradeMarginEnum | TradeModeEnum.spot

export const getTradeTabsMap = () => {
  return {
    [TradeModeEnum.spot]: t`trade.type.coin`,
    [TradeMarginEnum.isolated]: t`constants_trade_5`,
    [TradeMarginEnum.margin]: t`constants_trade_6`,
  }
}
export enum TradeOrderTypesEnum {
  /** 市价交易 */
  market = '0',
  /** 限价交易 */
  limit = '1',
  /** 计划委托 */
  trailing = '2',
}
export const getTradeOrderTypesMap = () => {
  return {
    [TradeOrderTypesEnum.market]: t`constants/trade-3`,
    [TradeOrderTypesEnum.limit]: t`constants/trade-2`,
    [TradeOrderTypesEnum.trailing]: t`features_trade_trade_setting_index_2520`,
  }
}
export enum TradePriceTypeEnum {
  /** 币种类型 */
  coinType = '0',
  /** 对手价 */
  lastPrice = 'BBO',
  /** 最优五档 */
  fivePrice = 'optimal5',
  /** 最优十档 */
  tenPrice = 'optimal10',
  /** 最优二十档 */
  twentyPrice = 'optimal20',
}
export const getTradePriceTypeMap = inputSuffix => ({
  [TradePriceTypeEnum.coinType]: inputSuffix,
  [TradePriceTypeEnum.lastPrice]: t`trade.form.price.type.2`,
  [TradePriceTypeEnum.fivePrice]: t`trade.form.price.type.3`,
  [TradePriceTypeEnum.tenPrice]: t`trade.form.price.type.4`,
  [TradePriceTypeEnum.twentyPrice]: t`trade.form.price.type.5`,
})

export const getTradePriceTypeLabelMap = isBuy => {
  if (isBuy) {
    return {
      [TradePriceTypeEnum.lastPrice]: t`trade.form.price.type.label.lastPrice.1`,
      [TradePriceTypeEnum.fivePrice]: t`trade.form.price.type.label.3${5}`,
      [TradePriceTypeEnum.tenPrice]: t`trade.form.price.type.label.3${10}`,
      [TradePriceTypeEnum.twentyPrice]: t`trade.form.price.type.label.3${20}`,
    }
  }
  return {
    [TradePriceTypeEnum.lastPrice]: t`trade.form.price.type.label.lastPrice.2`,
    [TradePriceTypeEnum.fivePrice]: t`trade.form.price.type.label.3${5}`,
    [TradePriceTypeEnum.tenPrice]: t`trade.form.price.type.label.3${10}`,
    [TradePriceTypeEnum.twentyPrice]: t`trade.form.price.type.label.3${20}`,
  }
}

export enum TradeBuyOrSellEnum {
  buy = '0',
  sell = '1',
}
/** 市价交易交易类型 */
export enum TradeMarketAmountTypesEnum {
  amount = 'amount',
  funds = 'funds',
}
export const getTradeMarketAmountTypesMap = (funds, amount) => ({
  [TradeMarketAmountTypesEnum.amount]: amount,
  [TradeMarketAmountTypesEnum.funds]: funds,
})
/** 杠杆交易类型 */
export enum TradeMarginTypesEnum {
  /** 普通 */
  normal = 'normal',
  /** 自动借款 */
  borrow = 'borrow',
  /** 自动还款 */
  repay = 'repay',
}
/** 杠杆交易类型 */
export const getTradeMarginTypesMap = () => ({
  [TradeMarginTypesEnum.normal]: t`constants_trade_7`,
  [TradeMarginTypesEnum.borrow]: t`constants_trade_8`,
  [TradeMarginTypesEnum.repay]: t`constants_trade_9`,
})
/** 合约交易类型 */
export enum TradeFuturesTypesEnum {
  /** 开仓 */
  open = 'open',
  /** 平仓 */
  close = 'close',
}
export const getTradeFuturesTypesMap = () => ({
  [TradeFuturesTypesEnum.open]: t`constants_trade_10`,
  [TradeFuturesTypesEnum.close]: t`constants_trade_11`,
})
/** 合约前提条件单位类型 */
export enum TradeFuturesOptionUnitEnum {
  /** 最新 */
  last = 'last',
  /** 标记 */
  mark = 'mark',
}
export const getTradeFuturesOptionUnitMap = () => ({
  [TradeFuturesOptionUnitEnum.last]: t`constants_trade_12`,
  [TradeFuturesOptionUnitEnum.mark]: t`constants_trade_13`,
})
/** 合约前提条件止盈止损类型 */
export enum TradeFuturesOptionEnum {
  /** 止盈 */
  takeProfit = 'takeProfit',
  /** 止损 */
  stopLoss = 'stopLoss',
}
export const getTradeFuturesOptionMap = () => ({
  [TradeFuturesOptionEnum.takeProfit]: t`constants/order-6`,
  [TradeFuturesOptionEnum.stopLoss]: t`constants/order-7`,
})

export type TradeEntrustModalType = Record<'openModal' | 'closeModal', () => void>

/** 手续费页面 tab 类型 */
export enum HelpFeeTabTypeEnum {
  /** 充提 */
  withdrawFee = 1,
  /** 现货 */
  spotFee,
}

export enum TradeLayoutEnum {
  default = 'default',
  left = 'left',
  right = 'right',
}

/**
 * 合约 - 迁移｜划转输入类型
 */
export enum TransferInputTypeEnum {
  /** 迁移仓位数量 */
  positionAmount = 'positionAmount',
  /** 迁移保证金 */
  bail = 'bail',
}

/**
 * 合约 - 新建委托 - 下单选择币种是标的币还是计价币
 */
export enum EntrustPlaceUnit {
  /** 标的币 */
  base = 'BASE',
  /** 计价币 */
  quote = 'QUOTE',
}

/**
 * 合约 - 持仓 - 是否自动追加保证金类型
 */
export enum FuturesAutoAddMarginTypeEnum {
  /** 是 */
  yes = 'yes',
  /** 否 */
  no = 'no',
}

/**
 * 合约 - 持仓 - 止盈止损操作类型
 */
export enum StrategyOptionTypeEnum {
  /** 分批 */
  part = 'part',
  /** 仓位 */
  position = 'position',
}

/**
 * 合约 - 新建委托 - 订单类型
 * limit_order 限价委托单  market_order 市价委托单 forced_liquidation_order 强平委托单 forced_lighten_order 强减委托单
 */
export enum EntrustOrderTypeInd {
  /** 限价委托单  */
  limitOrder = 'limit_order',
  /** 市价委托单 */
  marketOrder = 'market_order',
  /** 强平委托单  */
  forcedLiquidationOrder = 'forced_liquidation_order',
  /** 强减委托单 */
  forcedLightenOrder = 'forced_lighten_order',
}

/**
 * 合约交易状态 - 1 开盘中、2 停盘中、3 预约开盘
 */
export enum TradePairMarketStatus {
  /** 开盘中  */
  open = 1,
  /** 停盘中 */
  stop = 2,
  /** 预约开盘  */
  subscribe = 3,
}

/** 交易方向 - 仓位类型 */
export enum FuturePositionDirectionEnum {
  /** 多仓位 */
  openBuy = 'long',
  /** 空仓位 */
  openSell = 'short',
}
export function getFuturePositionListDirectionEnumName(value: string) {
  return {
    [FuturePositionDirectionEnum.openSell]: t`constants_assets_futures_5101510`,
    [FuturePositionDirectionEnum.openBuy]: t`features_assets_futures_futures_detail_position_list_index_5101370`,
  }[value]
}
export function getFuturePositionDirectionEnumName(value: string) {
  return {
    [FuturePositionDirectionEnum.openSell]: t`constants/order-18`,
    [FuturePositionDirectionEnum.openBuy]: t`constants/order-17`,
  }[value]
}

/**
 * 合约 - 持仓 - 订单方向类型
 */
export enum FuturesOrderSideTypeEnum {
  /** 开多 */
  openLong = 'open_long',
  /** 开空 */
  openShort = 'open_short',
  /** 平多 */
  closeLong = 'close_long',
  /** 平空 */
  closeShort = 'close_short',
}

/**
 * 合约 - 持仓 - 市价单单位
 */
export enum FuturesMarketUnitTypeEnum {
  /** 按金额 */
  amount = 'amount',
  /** 按数量 */
  quantity = 'quantity',
}

/**
 * 合约 - 持仓列表 - 仓位状态
 */
export enum FuturesPositionStatusTypeEnum {
  /** 已开仓 */
  opened = 'opened',
  /** 已关闭 */
  closed = 'closed',
  /** 锁仓中 */
  locked = 'locked',
}

/** 合约持仓列表 - 更多功能操作列表 */
export enum MoreOperateEnum {
  /** 迁移 */
  migrate = 'migrate',
  /** 一键锁仓 */
  lock = 'lock',
  /** 一键反向 */
  reverse = 'reverse',
  /** 平仓 */
  close = 'close',
  /** 止盈止损 */
  stopLimit = 'stopLimit',
}
export function getMoreOperateList(lockStatus?: string, isProfessionalVersion?: boolean) {
  const operateList = [
    {
      name:
        lockStatus === FuturesPositionStatusTypeEnum.opened
          ? t`constants_assets_futures_5101431`
          : t`constants_assets_futures_5101530`,
      type: MoreOperateEnum.lock,
    },
    {
      name: t`features_assets_futures_futures_details_position_details_list_5101360`,
      type: MoreOperateEnum.reverse,
    },
    {
      name: t`constants/assets/common-1`,
      type: MoreOperateEnum.close,
    },
    {
      name: t`order.tabs.profitLoss`,
      type: MoreOperateEnum.stopLimit,
    },
  ]
  if (isProfessionalVersion) {
    return [
      {
        name: t`constants/assets/common-9`,
        type: MoreOperateEnum.migrate,
      },
      ...operateList,
    ]
  }
  return operateList
}

export enum FuturesGroupTypeEnum {
  /** 永续 */
  perpetual = 'perpetual',
  /** 交割 */
  delivery = 'delivery',
}

/**
 * 合约 - 合约类型名称
 */
export const getFuturesGroupTypeName = (type: string) => {
  return {
    [FuturesGroupTypeEnum.perpetual]: t`assets.enum.tradeCoinType.perpetual`,
    [FuturesGroupTypeEnum.delivery]: t`constants_market_market_list_index_5101351`,
  }[type]
}

/**
 * 合约 - 合约保证金动作类型
 */
export enum FuturesOperationTypeEnum {
  /** 手动 */
  handler = 'handler',
  /** 自动 */
  auto = 'auto',
}

/**
 * 合约 - 合约保证金动作类型名称
 */
export const getFuturesOperationTypeName = (type: string) => {
  return {
    [FuturesOperationTypeEnum.handler]: t`constants/order-19`,
    [FuturesOperationTypeEnum.auto]: t`constants/order-21`,
  }[type]
}

/**
 * 合约 - 持仓 - 开仓额外保证金来源
 */
export enum FuturesAdditionalMarginTypeEnum {
  /** 账户资产作为额外保证金  */
  assets = 'assets',
  /** 开仓资金作为额外保证金 */
  openFunds = 'open_funds',
}

/**
 * 合约 - 持仓 - 根据合约偏好设置获取开仓额外保证金来源
 */
export const getFuturesAdditionalMarginType = (type: string) => {
  return {
    [UserMarginSourceEnum.wallet]: FuturesAdditionalMarginTypeEnum.assets,
    [UserMarginSourceEnum.group]: FuturesAdditionalMarginTypeEnum.openFunds,
  }[type]
}

/**
 * 合约迁移类型
 */
export enum PerpetualMigrateTypeEnum {
  /** 合组 */
  merge = 'merge',
  /** 迁移 */
  migrate = 'migrate',
}

/**
 * 保证金币种汇率类型
 */
export enum PerpetualMigrateRateTypeEnum {
  /** 固定 */
  fixed = 'fixed',
  /** 浮动 */
  float = 'float',
}

/**
 * 合约订单是否接管单
 */
export enum PerpetualOrderAcceptTypeEnum {
  /** 接管单 */
  yes = 1,
  /** 非接管单 */
  no,
}

/** 合约保证金资产列表 - 划出、划入枚举 */
export enum FuturesTransferEnum {
  /** 划入 */
  in = 1,
  /** 划出 */
  out = 2,
}

export enum AssetsTransferTypeEnum {
  /** 从 (划出) */
  from = 'from',
  /** 到 (划入) */
  to = 'to',
}

export function getFuturesTransferList() {
  const operateList = [
    {
      name: t`constants_assets_futures_csby62i3ft99c8b9dvjun`,
      type: AssetsTransferTypeEnum.from,
    },
    {
      name: t`constants_assets_futures_q5wfmtnqqp0edc5cg1wab`,
      type: AssetsTransferTypeEnum.to,
    },
  ]
  return operateList
}

/** 合约划转 - 划转账户 */
export enum TransferAccountEnum {
  /** 交易账户 */
  spotAccount = 'asset',
  /** 新建逐仓 */
  newGroup = 'group',
}

/**
 * 合约组详情 - 保证金价值和折算率详情
 */
export enum PerpetualMarginScaleTypeEnum {
  /** 逐仓总价值 */
  total = 'total',
  /** 可用保证金 */
  available = 'available',
  /** 仓位占用保证金 */
  positionOccupy = 'positionOccupy',
  /** 开仓冻结保证金 */
  openLockAsset = 'openLockAsset',
}
