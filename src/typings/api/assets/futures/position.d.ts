/** ============= 资产 - 合约组 - 持仓 ================= */

import { IPostCoinInfoReq } from "../../market"

/**
 * 接口 [是否存在委托订单↗](https://yapi.nbttfc365.com/project/44/interface/api/3975) 的 **请求类型**
 *
 * @分类 [资产 - 合约组接口↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_538)
 * @请求头 `POST /v1/perpetual/position/existEntrustOrder`
 * @更新时间 `2023-01-17 15:07:47`
 */
export interface IPerpetualPositionExistEntrustOrderReq {
    groupId: string
    positionId: string
  }
  
  /**
   * 接口 [是否存在委托订单↗](https://yapi.nbttfc365.com/project/44/interface/api/3975) 的 **返回类型**
   */  export interface IPerpetualPositionExistEntrustOrderResp {
    /**
     * 是否存在
     */
    exist: boolean
  }
  /** 交易页 - 合约当前持仓列表 */
  export interface IPositionListRep {
    /**
     * symbol
     */
    symbol?: string
  }

  /** 交易页 - 合约当前持仓列表 */
  export interface IPositionListResp {
    list: IPositionListData[]
  }
  export interface IPositionListData {
    /** 合约组 Id */
    groupId: string;
    /** 合约组名称 */
    groupName: string;
    /** 合约组保证金 */
    groupMargin: string;
    /** 交易对 id */
    tradeId: number;
    /** 交易对名称 */
    symbol: string;
    /** 基础币 */
    baseSymbolName: string;
    /** 计价币 */
    quoteSymbolName: string;
    /** wass 钱包币对名称  */
    symbolWassName: string;
    /** 合约类型 */
    typeInd: string;
    /** 持仓 id */
    positionId: string;
    /** long: 多仓位 short:空仓位 */
    sideInd: string;
    /** 杠杆倍数 */
    lever: string;
    /** 未实现盈亏 */
    unrealizedProfit: string;
    /** 收益率 */
    profitRatio: string;
    /** 持仓数量 */
    size: string;
    /** 仓位保证金率 */
    marginRatio: string;
    /** 维持保证金 */
    maintMargin?: string;
    /** 维持保证金率 */
    maintMarginRatio: string;
    /** 开仓均价 */
    openPrice: string;
    /** 标记价格 */
    markPrice: string;
    /** 最新价 */
    latestPrice: string;
    /** 预估强平价 */
    liquidatePrice: string;
    /** 已实现盈亏 */
    realizedProfit: string;
    /** 收益 */
    profit: string;
    /** 仓位状态：opened:已开仓，closed:已关闭，locked:锁仓中 */
    statusCd: string;
    /** 委托冻结的数量 */
    entrustFrozenSize: string
    /** 锁仓价格 */
    lockPrice: string;
    /** 锁仓数量 */
    lockSize: string;
    /** 锁仓利息 */
    lockFees: string;
    /** 锁仓比例 */
    lockPercent: string;
    /** 数量精度 */
    amountOffset: string;
    /** 价格精度 */
    priceOffset: string;
    /** 卖出手续费率 */
    sellFeeRate: string;
    /** 创建时间 */
    createdByTime: number;
    /** 更新时间 */
    updatedByTime: number;
    /** 锁仓记录 */
    lockRecord: PositionListLockRecordData|null;
    /** 止盈止损委托 */
    profitLossEntrust: PositionListProfitLossEntrustData[];
    /** 合约组可用保证金 */
    groupAvailableMargin: string;
    /** 仓位初始保证金 */
    initMargin: string;
  }

/**
 * 持仓列表 - 锁仓记录
 */
export interface PositionListLockRecordData {
  /**
   * 首次锁仓价格
   */
  lockPrice: string
  /**
   * 锁仓手续费总和
   */
  fees: string
}
/**
 * 持仓列表 - 仓位止盈止损记录
 */
export interface PositionListProfitLossEntrustData {
  /**
   * 策略类型 stop_profit 止盈 stop_loss 止损
   */
  strategyTypeInd: string
  /**
   * 触发价格
   */
  triggerPrice: string
}

/**
 * 接口 [合约币对详情↗](https://yapi.nbttfc365.com/project/44/interface/api/4047) 的 **请求类型**
 *
 * @分类 [合约行情↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_190)
 * @请求头 `GET /v1/perpetual/tradePair/detail`
 * @更新时间 `2023-01-30 14:39:56`
 */
export interface ITradePairDetailDataReq {
  symbol: string
}

/** 合约币对详情 */
export interface ITradePairDetailData {
  /**
   * marker 费率
   */
  markerFeeRate?: null
  /**
   * 标的币 ID
   */
  sellCoinId?: number
  /**
   * 标的币名称
   */
  sellCoinName: string
  /**
   * 最小下单数量
   */
  minAmount?: null
  /**
   * 合约交易对阶梯杠杆设置
   */
  tradePairLeverList?: ITradePairLeverList[]
  tradeArea?: null
  /**
   * 最小资金费率
   */
  minusFeeRate?: number
  /**
   * 商户 ID
   */
  businessId?: number
  /**
   * 最大下单数量
   */
  maxCount?: null
  /**
   * 结算时间 比如 0，8，16，东八区时间。下一次结算倒计时由此计算
   */
  cycle?: string
  /**
   * 流通量
   */
  circulatingSupply?: null
  /**
   * 最高价
   */
  high?: string
  /**
   * 最低价
   */
  low?: string
  isPriceAlert?: null
  /**
   * taker 费率
   */
  takerFeeRate?: null
  /**
   * 币对名
   */
  symbolName?: string
  /**
   * 深度
   */
  depthOffset?: null
  id?: number
  priceFloatRatio?: string
  /**
   * 最大下单金额
   */
  maxAmount?: null
  /**
   * 计价币 ID
   */
  buyCoinId?: number
  /**
   * 计价币名称
   */
  buyCoinName: string
  /**
   * waas 钱包币对名
   */
  symbolWassName?: string
  enableState?: number
  /**
   * 合约类型 delivery= 交割，perpetual =永续
   */
  typeInd?: string
  /**
   * 涨跌幅
   */
  chg?: string
  /**
   * 最新价
   */
  last?: string
  /**
   * 下单数量偏移
   */
  amountOffset?: number
  /**
   * 价格精度
   */
  priceOffset?: number
  quoteVolume?: string
  sort?: number
  /**
   * 是否添加自选
   */
  favourite?: number
  volume?: string
  quoteSymbolName?: string
  baseSymbolName?: string
  /**
   * 结算周期 1，2，4，8 个小时
   */
  settlementRules?: number
  plusFeeRate?: number
  marketStatus?: number
  isShare?: number
  /**
   * 最小下单数量
   */
  minCount?: null
  time?: null
  open?: string
  sellFee?: null
  /**
   * 当前资金费率
   */
  assetFeeRate: number
  /**
   * 指数价格
   */
  indexPrice: string
  /**
   * 标记价格
   */
  markPrice: string
  /**
   * 最大杠杆倍数
   */
  maxLever: number
}

/**
 * 合约币对详情 - 合约交易对阶梯杠杆设置
 */
export interface ITradePairLeverList {
  /**
   * 限制下单最大金额数量，单位为计价币
   */
  maxLimitAmount?: number
  /**
   * 维持保证金率
   */
  marginRate?: number
  /**
   * 层级
   */
  degree?: number
  /**
   * 最低维持保证金率
   */
  minMarginRate?: number
  /**
   * 金额区间内最大可用杠杆倍数
   */
  maxLever?: number
  tradeId?: number
  /**
   * 最小杠杆倍数
   */
  minLever: number
}

/**
 * 接口 [仓位迁移--获取能迁移的数量↗](https://yapi.nbttfc365.com/project/44/interface/api/3955) 的 **请求类型**
 */
export interface IPerpetualPositionMigrateSizeReq {
  /**
   * 迁移的仓位 id
   */
  positionId: string
  fromGroupId: string
}

/**
 * 接口 [仓位迁移--获取能迁移的数量↗](https://yapi.nbttfc365.com/project/44/interface/api/3955) 的 **请求类型**
 */
export interface IPerpetualPositionMigrateSizeResp {
    /**
     * 可迁移的数量
     */
    quantity: string
}

/**
 * 接口 [仓位迁移--获取能迁移的保证金↗](https://yapi.nbttfc365.com/project/44/interface/api/3959) 的 **请求类型**
 */
export interface IPerpetualPositionMigrateMarginReq {
 /**
   * 迁移的仓位 id
   */
 positionId: string
 fromGroupId: string
 /**
  * 迁移数量
  */
 size: string
}

/**
* 接口 [仓位迁移--获取能迁移的保证金↗](https://yapi.nbttfc365.com/project/44/interface/api/3959) 的 **返回类型**
 */
export interface IPerpetualPositionMigrateMarginResp {
  /**
   * 最小可用迁移的保证金
   */
  min: string
  /**
   * 最大可迁移的值
   */
  max: string
}

/**
 * 接口 [仓位迁移--检查是否有可合并的仓位↗](https://yapi.nbttfc365.com/project/44/interface/api/3967) 的 **请求类型**
 */
export interface IPerpetualPositionCheckMergeReq {
  /**
   * 迁移的仓位 id
   */
  positionId: string
  fromGroupId: string
  /**
   * 目标合约组
   */
  toGroupId: string
}
/**
 * 接口 [仓位迁移--检查是否有可合并的仓位↗](https://yapi.nbttfc365.com/project/44/interface/api/3967) 的 **请求类型**
 */
export interface IPerpetualPositionCheckMergeResp {
  /**
   * 是否存在可合并的持仓
   */
  exist: boolean
}

/**
 * 接口 [仓位迁移↗](https://yapi.nbttfc365.com/project/44/interface/api/3859) 的 **请求类型**
 */
export interface IPerpetualPositionMigrateReq {
  /**
   * 迁移的仓位 id
   */
  positionId: string
  /**
   * 迁移的合约组
   */
  fromGroupId: string
  /**
   * 目标合约组
   */
  toGroupId: string
  /**
   * 迁移数量
   */
  size: string
  /**
   * 迁移的保证金
   */
  margin: string
}

/**
 * 接口 [仓位迁移↗](https://yapi.nbttfc365.com/project/44/interface/api/3859) 的 **请求类型**
 */
export interface IPerpetualPositionMigrateResp {
  isSuccess: boolean
}

/**
 * 接口 [仓位迁移--检查迁移的保证金↗](https://yapi.nbttfc365.com/project/44/interface/api/4359) 的 **请求类型**
 */
export interface IPerpetualPositionCheckMigrateMarginReq {
  /**
   * 迁移的合约组
   */
  fromGroupId: string
  /**
   * 迁移的仓位 id
   */
  positionId: string
  /**
   * 迁移数量
   */
  size: string
  /**
   * 迁移的保证金
   */
  margin: string
}

/** 仓位迁移--检查迁移的保证金 */
export interface IPerpetualPositionCheckMigrateMarginResp {
  /**
   * 检查通过
   */
  pass: boolean
}
/**
 * 交易 - 新建普通委托单（平仓/一键反向）
 */
export type stopProfitReq = {
  /** 触发价格 */
  triggerPrice: number;
  /** 触发价格类型（mark 标记，new 最新） */
  triggerPriceTypeInd: string;
  /** 方向 close_long 平多 , close_short 平空 */
  triggerSideInd: string;
  /** 委托价格类型 limit 限价 market 市价 */
  entrustTypeInd: string;
  /** 策略类型 stop_profit 止盈  */
  strategyTypeInd: string;
  /** 触发方向（up=向上，down=向下），平多止盈为 up，平空止盈为 down */
  triggerDirectionInd: string;
}

export type strategyReq = {
  /** 止盈 */
  stopProfit?: stopProfitReq;
  /** 止损 */
  stopLoss?: stopProfitReq;
}
/**
 * 接口 [新建普通委托单↗](https://yapi.nbttfc365.com/project/44/interface/api/3639) 的 **请求类型**
 *
 * @分类 [合约主流程↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_532)
 * @请求头 `POST /v1/perpetual/orders/place`
 */
export type IPerpetualOrdersPlaceReq = {
    /** 合约组 id */
    groupId: string;
    /** 仓位 id ,减仓单，平仓单必传 */
    positionId?: string;
    /** 交易对 id */
    tradeId: number;
    /** 订单类型 limit_order 限价委托单  market_order 市价委托单 forced_liquidation_order 强平委托单 forced_lighten_order 强减委托单 */
    typeInd: string;
    /** 委托价格类型 limit 限价 market 市价   */
    entrustTypeInd: string
    /** 方向类型 open_long 开多 , open_short 开空 ,close_long 平多，close_short 平空  */
    sideInd: string;
    /** 委托价格;限价单必传，市价单不传 */
    price?: number;
    /** 委托数量;限价单市价单按数量必传 */
    size?: string;
    /** 市价单单位 amount 按金额 quantity 按数量 */
    marketUnit?: string;
    /** 下单金额或减仓价值，市价单按金额 market_unit=amount 时必传 */
    funds?: number;
    /** 下单选择的币种是标的币还是计价币；如果是标的币传 BASE，如果是计价币传 QUOTE */
    placeUnit?: string;
    /** 开仓保证金来源  assets 使用资产账户的资金开仓 cgroup 使用当前合约组的额外保证金开仓 */
    marginType?: string;
    /** 开仓初始仓位保证金 */
    initMargin?: number;
    /** 开仓额外保证金来源  assets 账户资产作为额外保证金 open_funds 开仓资金作为额外保证金 */
    additionalMarginType?: string;
    /** 开仓额外保证金 */
    additionalMargin?: number;
    /** 开仓杠杆倍数 */
    lever?: string;
    /** 止盈止损 */
    strategy?: strategyReq;
    /** 是否自动追加保证金 开仓时，如果选择创建新合约组时，必传 yes，是；no，否； */
    autoAddMargin?: string;
}

export type IPerpetualOrdersPlaceResp = {
    /** 200 表示成功 其他 code 表示失败 */
    code: number;
    /** 错误消息 */
    message: string;
    /** 订单 ID */
    data: string;
}

/**
 * 交易-新增止盈止损/仓位止盈止损
 */
export type StopProfitReq = {
    /** 委托价格类型 limit 限价 market 市价  */
    entrustTypeInd: string;
    /** 合约组 */
    groupId: string;
    /** 仓位 */
    positionId: string;
    /** 价格 */
    price: string;
    /** 数量 */
    size: string;
    /** part 分批 , position 仓位 */
    strategyOperationType: string;
    /** 策略类型 stop_profit 止盈 stop_loss 止损 */
    strategyTypeInd: string;
    /** 交易对 ID */
    tradeId: string;
    /** 触发方向（up=向上，down=向下） */
    triggerDirectionInd: string;
    /** 触发价格 */
    triggerPrice: string;
    /** 触发方式（mark 标记，new 最新） */
    triggerPriceTypeInd: string;
    /** close_long 平多，close_short 平空  */
    triggerSideInd: string;
}

export type StrategyPlaceReq = {
    /** 止盈对象 */
    stopProfit: StopProfitReq;
    /** 止损对象 */
    stopLoss: StopProfitReq;
}
export type StrategyPlaceResp = {
    code: number;
    message: string;
    data: string;
}

/**
 * 止盈止损
 */
export interface IPerpetualOrdersPlaceStrategyReq {
  stopProfit?: IPerpetualOrdersPlaceStopProfitStrategyReq
  stopLoss?: IPerpetualOrdersPlaceStopLossStrategyReq
}
/**
 * 止盈
 */
export interface IPerpetualOrdersPlaceStopProfitStrategyReq {
  /**
   * 触发价格
   */
  triggerPrice: number
  /**
   * 触发价格类型（mark 标记，new 最新）
   */
  triggerPriceTypeInd: string
  /**
   * 方向 close_long 平多 , close_short 平空
   */
  triggerSideInd: string
  /**
   * 委托价格类型 limit 限价 market 市价
   */
  entrustTypeInd: string
  /**
   * 策略类型 stop_profit 止盈
   */
  strategyTypeInd: string
  /**
   * 触发方向（up=向上，down=向下），平多止盈为 up，平空止盈为 down
   */
  triggerDirectionInd: string
}
/**
 * 止损
 */
export interface IPerpetualOrdersPlaceStopLossStrategyReq {
  /**
   * 触发价格
   */
  triggerPrice: number
  /**
   * 触发价格类型（mark 标记，new 最新）
   */
  triggerPriceTypeInd: string
  /**
   * 方向 close_long 平多 , close_short 平空
   */
  triggerSideInd: string
  /**
   * 委托价格类型 market 市价
   */
  entrustTypeInd: string
  /**
   * 策略类型 stop_loss 止损
   */
  strategyTypeInd: string
  /**
   * 触发方向（up=向上，down=向下），平多止损为 down，平空止损为 up
   */
  triggerDirectionInd: string
}

/**
 * 接口 [仓位迁移--检查最小持仓数量↗](https://yapi.nbttfc365.com/project/44/interface/api/3963) 的 **请求类型**
 */
export interface IPerpetualPositionCheckMinSizeReq {
  /**
   * 迁移的合约组
   */
  fromGroupId: string
  /**
   * 迁移的仓位 id
   */
  positionId: string
  /**
   * 迁移数量
   */
  size: string
}

/**
 * 接口 [仓位迁移--检查最小持仓数量↗](https://yapi.nbttfc365.com/project/44/interface/api/3963) 的 **返回类型**
 */
export interface IPerpetualPositionCheckMinSizeResp {
  /**
   * 检查通过
   */
  pass: boolean
}

/**
 * 接口 [仓位是否存在↗](https://yapi.nbttfc365.com/project/44/interface/api/4323) 的 **请求类型**
 */
export interface IPositionCheckExistReq {
  /**
   * 合约组 id
   */
  groupId: string
  /**
   * 仓位 id
   */
  positionId: string
}
export interface IPositionCheckExistResp {
  exist: boolean
}

/**
 * 交易 - 撤销仓位的委托订单
 */
export type IPositionCancelOrderReq = {
  /** 合约组 ID */
  groupId: string;
  /** 仓位 ID */
  positionId: string;
}

export type IPositionCancelOrderResp = {
  /** 是否成功 */
  isSuccess: boolean;
}


/**
 * 合约组分组持仓列表
 */
export interface IPositionGroupList {
  /** 合约组 ID */
  groupId: string;
  /** 持仓列表 */
  data: IPositionListData[];
  /** 未实现盈亏总额 */
  unrealizedProfitTotal?: string;
  /** 维持保证金总额 */
  maintMarginRatioTotal?: string;
  /** 开仓保证金总额 */
  openMarginTotal?: string;
}

/**
 * 交易 - 调整持仓杠杆 - 修改仓位杠杆倍数检查最大持仓量
 */
export type FuturesPositionLeverCheckMaxSizeReq = {
  /** 合约组 id */
  groupId: string;
  /** 仓位 Id */
  positionId: string;
  /** 杠杆倍数 */
  lever: string;
}

export type FuturesPositionLeverCheckMaxSizeResp = {
  isSuccess: boolean;
}