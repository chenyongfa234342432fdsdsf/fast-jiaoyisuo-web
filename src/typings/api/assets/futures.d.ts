/** ============================================== 资产 - 合约组 ============================================== */

/**
 * 资产 - 获取合约资产
 */
export type FuturesAssetsReq = {}

export type FuturesAssetsResp = {
    /** 合约资产 */
    totalPerpetualAsset?: string | number;
    /** 可用保证金 */
    totalMarginAvailable?: string | number;
    /** 仓位资产 */
    totalPositionAssets?: string | number;
    /** 未实现盈亏 */
    totalUnrealizedProfit?: string | number
    /** 可用币种资产 */
    totalMarginCoinAvailable?: string | number,
    /** 仓位占用币种资产 */
    totalPositionCoinAsset?: string | number,
    /** 开仓冻结币种价值 */
    totalLockCoinAsset?: string | number,
    /** 开仓冻结保证金价值 */
    totalLockMarginAsset?: string | number,
    /** 追加保证金剩余额度 */
    marginAmount: string;
    /** 是否开通合约 */
    isOpen: boolean | null;
    /** 是否开启自动追加保证金 */
    isAutoAdd?: boolean;
    /** 计价币 */
    baseCoin?: string;
     /** 接口 api 响应结果，false 接口未响应，true 接口已响应 */
     apiState?: false,
}

/**
 * 资产 - 获取合约组列表
 */
export type FuturesListReq = {}

export type FuturesList = {
    /** 总收益 */
    totalRevenue: string | Number;
    /** 总收益率 */
    totalYield: string | Number;
    /** 合约组资产 */
    groupAsset: string | Number;
    /** 仓位资产 */
    positionAsset: string | Number;
    /** 可用保证金 */
    marginAvailable: string | Number;
    /** 合约组 id */
    groupId: string;
    /** 合约组名称 */
    groupName: string;
    /** 计价币 */
    baseCoin: string;
    /** 是否自动追加保证金（yes，no） */
    isAutoAdd: string;
    /** 未实现盈亏 */
    unrealizedProfit: string | Number;
    /** 可用币种资产 */
    marginCoinAvailable: string | Number;
    /** 仓位占用币种资产 */
    positionCoinAsset: string | Number;
    /** 合约币种总资产 */
    groupCoinAsset: string | Number;
    /** 开仓冻结币种价值 */
    lockCoinAsset: string | Number;
    /** 开仓冻结保证金价值 */
    lockMarginAsset: string | Number;
    /** 逐仓资产：逐仓保证金币种价值 + 未实现盈亏 */
    groupTotalAsset?: string | Number;
}

export type FuturesListResp = {
    list: FuturesList[];
}

/**
 * 合约 - 合约组是否存在委托订单
 */
export type GroupExistEntrustOrderReq = {
    /** 合约组 id */
    groupId: string;
  }

  export type GroupExistEntrustOrderResp = {
    /** 是否存在 */
    exist: boolean;
    /** 是否有锁仓 */
    lock: boolean;
  }


/**
 * 资产 - 获取商户法币配置
 */
export type AssetsCurrencySettingsReq = {}

export type AssetsCurrencySettingsResp = {
  /** 国家 ID */
  countryId: number;
  /** 法币名称 */
  currencyName: string;
  /** 法币英文名称 */
  currencyEnName: string;
  /** 国旗 */
  countryFlagImg: string;
  /** 法币符号 */
  currencySymbol: string;
  /** 法币精度 */
  offset: number;
}
/** ============================================== 资产 - 合约组详情 ============================================== */
/**
 * 合约 - 合约组详情总览
 */
export type FuturesGroupDetailReq = {
    /** 合约组 id */
    groupId: string;
}

export type GroupDetailMarginCoin = {
    /** 币种名称 */
    coinName: string;
    /** 折算价值 */
    coinConvert: string;
}

export type GroupDetailPositionAsset = {
    /** 币种名称 */
    coinName: string;
    /** long: 多仓位 short:空仓位 */
    sideInd: string;
    /** 名义价值 */
    nominalValue: string;
}

export type FuturesGroupDetailResp = {
    /** 合约组 ID */
    groupId: string;
    /** 合约组名称 */
    groupName: string;
    /** 计价币 */
    baseCoin: string;
    /** 合约组总价值 */
    groupAsset: string;
    /** 合约组可用保证金 */
    marginAvailable: string;
    /** 仓位保证金 */
    positionMargin: string;
    /** 保证金币种信息 */
    marginCoin: GroupDetailMarginCoin[];
    /** 持仓风险占比 */
    positionAsset: GroupDetailPositionAsset[];
    /** 可用保证金资产价值 */
    marginAssets: string;
    /** 可用保证金折算比率 */
    marginAvailableScale: string;
    /** 未实现盈亏 */
    unrealizedProfit: string;
    /** 开仓冻结保证金 */
    openLockAsset: string;
    /** 用户合约组总数量 */
    groupCount: string;
    /** 是否自动追加保证金 */
    isAutoAdd:string;
}

export type IFuturesDetailsChartData = {
    /** 计价币 */
    baseCoin: string;
    /** 合约组总价值 */
    groupAsset: string;
    /** 合约组可用保证金 */
    marginAvailable: string;
    /** 仓位保证金 */
    positionMargin: string;
    /** 开仓冻结保证金 */
    openLockAsset: string;
    /** 保证金币种信息 */
    marginCoin: GroupDetailMarginCoin[];
    /** 持仓风险占比 */
    positionAsset: GroupDetailPositionAsset[];
}

/**
 * 合约组详情 - 合约组保证金列表
 */
export type FuturesDetailMarginListReq = {
    /** 合约组 ID */
    groupId: string;
}

export type DetailMarginListChild = {
    /** 币种 id */
    coinId: string;
    /** 币种名称 */
    coinName: string;
    /** 币种符号 */
    symbol:string;
    /** 币种总数量 */
    amount: string;
    /** 币种冻结数量 */
    lockAmount: string;
    /** 币种可用数量 */
    availableAmount: string;
    /** app 图标 */
    appLogo: string;
    /** web 图标 */
    webLogo: string;
}

export type FuturesDetailMarginListResp = {
    list: DetailMarginListChild[]
    /** 计价币 */
    baseCoin: string;
}


/**
 * 合约组详情 - 合约组保证金币种信息（合约组提取币种下拉框）
 */
export type FuturesDetailWithdrawCoinListReq = {
    /** 合约组 ID */
    groupId: string;
 }

export type DetailMarginCoinList = {
    /** 币种 id */
    coinId: string;
    /** 币种名称 */
    coinName: string;
    /** 可提数量 */
    amount?: string;
    // /** 可用 */
    // canDeposit?: string;
    /** app 图标 */
    appLogo: string;
    /** web 图标 */
    webLogo: string;
    /** 币种符号 */
    symbol: string;
}

export type FuturesDetailWithdrawCoinListResp = {
    list: DetailMarginCoinList[];
}

/**
 * 合约组详情 - 资产账户保证金币种信息（合约组充值币种下拉框）
 */
export type FuturesDetailRechargeCoinListReq = {}

export type FuturesDetailRechargeCoinListResp = {
    list: DetailMarginCoinList[];
}

/**
 * 合约组详情 - 合约组保证金提取
 */
export type FuturesDetailWithdrawMarginReq = {
    /** 合约组 id */
    groupId: string;
    /** 币种 id */
    coinId: string;
    /** 数量 */
    amount: string;
}

export type FuturesDetailWithdrawMarginResp = {
    /** 是否成功 */
    isSuccess: boolean;
}

/**
 * 合约组详情 - 合约组保证金充值
 */
export type FuturesDetailRechargeMarginReq = {
    /** 合约组 id */
    groupId: string;
    /** 币种 id */
    coinId: string;
    /** 数量 */
    amount: string;
}

export type FuturesDetailRechargeMarginResp = {
    /** 是否成功 */
    isSuccess: boolean;
}

/**
 * 合约组详情 - 持仓详情列表
 */
export type FuturesDetailPositionListReq = {
    /** 合约组 id */
    groupId: string;
}

/**
 * 合约组详情 - 闪电平仓
 */
export type FuturesDetailPositionFlashAllReq = {
    flashOrders: FlashOrdersReq[];
}
/**
 * 合约组详情 - 闪电平仓
 */
export type FlashOrdersReq = {
    /** 合约组 ID */
    groupId: string;
    /** 仓位 ID */
    positionId: string;
    /** 仓位的方向类型 open_long 开多，open_short 开空 */
    sideInd: string;
    /** 交易对 ID */
    tradeId: number;
    /** 平仓数量 */
    size: string;
}

export type FuturesDetailPositionFlashAllResp = {
    /** 下单情况 code 值 成功:200  , 其他 code 值为下单失败原因对应的 code */
    code: number;
    /** 下单成功:success，下单失败：其他错误描述 */
    message: string;
    /** 平仓的 positionId */
    sourceId: string;
    /** 生成的平仓单订单 id */
    orderId: string;
    /** true 下单成功 false 下单失败 */
    success: boolean;
}

/**
 * 交易 - 检查能否锁仓
 */
export type PositionCheckLockReq = {
    /** 仓位 ID */
    positionId: string;
    /** 合约组 ID */
    groupId: string;
}

export type PositionCheckLockResp = {
    /** 检查是否通过 */
    pass: boolean;
}


/**
 * 交易 - 计算锁仓费用等信息
 */
export type PositionLockFeeReq = {
    /** 仓位 ID */
    positionId: string;
    /** 合约组 ID */
    groupId: string;
    /** 锁仓数量 */
    size: string;
}

export type PositionLockFeeResp = {
    /** 本次手续费 */
    fee: string;
    /** 下次收费时间 */
    nextTime: number;
    /** 预计锁仓费用 */
    predictFee: string;
}

/**
 * 交易-获取锁仓时间周期/费率等设置
 */
export type FuturesLockPositionSettingReq = {
    /** 币对 id */
    tradeId: number;
}

export type FuturesLockPositionSettingResp = {
    /** 时间段 单位 min 5,10,15,20,25,30 */
    interval: number;
    /** 费率比例 */
    fees: string;
}


/**
 * 交易 - 一键锁仓
 */
export type PositionLockReq = {
    positionId: string;
    groupId	: string;
    /** 锁仓数量 */
    size: string;
    /** 锁仓比例 */
    percent:string
}

export type PositionLockResp = {
    isSuccess: boolean;
}


/**
 * 资产 - 合约组 - 撤销合约组所有委托
 */
export type FuturesGroupCancelOrderReq = {
    /** 合约组 ID */
    groupId: string;
}

export type FuturesGroupCancelOrderResp = {
    /** 是否成功 */
    isSuccess: boolean;
}

/**
 * 资产 - 合约组 - 一键合并
 */
export type FuturesGroupMergeReq = {
    /** 原始合约组 id */
    fromGroupId: string;
    /** 目标合约组 id */
    toGroupId: string;
}

export type FuturesGroupMergeResp = {
    /** 是否成功 */
    isSuccess: boolean;
}


/**
 * 交易 - 一键反向 - 获取币对数量
 */
export type FuturesPositionSymbolSizeReq = {
    /** 币对 id */
    tradeId: number;
    /** 交易方向（开多，开空） */
    sideInd: string;
    /** 杠杆倍数 */
    lever: string;
}

export type FuturesPositionSymbolSizeResp = {
    /** 持仓数量 */
    size: string;
}

/**
 * 交易 - 一键反向 - 获取反向开仓信息
 */
export type FuturesPositionReverseInfoReq = {
    /** 合约组 id */
    groupId: string;
    /** 仓位 id */
    positionId: string;
    /** wallet 使用资产账户的资金开仓 group 使用当前合约组的额外保证金开仓 */
    marginType:string;
}

export type FuturesPositionReverseInfoResp = {
    /** taker 手续费率 */
    takerFeeRate: string;
    /** 对手价 */
    opponentPrice: string;
    /** 可用开仓保证金 */
    availableOpenMargin: string;
}

/**
 * 交易 - 一键反向 - 获取币对最大可开仓数量
 */
export type FuturesPositionMaxSizeLimitReq = {
    /** 币对 id */
    tradeId: number;
    /** 杠杆倍数 */
    lever: string;
}

export type FuturesPositionMaxSizeLimitResp = {
    /** 持仓数量 */
    maxSize: string;
    /** 标的币 */
    baseSymbolName: string;
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
export type StrategyPlaceReq = {
    /** 止盈对象 */
    stopProfit: stopProfitReq;
    /** 止损对象 */
    stopLoss: stopProfitReq;
}
export type StrategyPlaceResp = {
    code: number;
    message: string;
    data: string;
}

/**
 * 交易 - 获取仓位止盈止损详情
 */
export type FuturesPositionStrategyDetailsReq = {
    /** 仓位 id */
    id: string;
}

export type StopProfitResp = {
    /** 止盈止损策略 id */
    id: string;
    /** 策略类型 stop_profit 止盈 stop_loss 止损  */
    strategyTypeInd: string;
    /** 委托状态 revoke 已撤销，revoke_sys 系统撤销，,alreay_triggered 已生效，triggered_failed 已生效 - 委托失败 */
    statusCd: string;
    /** not_triggered 未生效 already_triggered 已生效 expired 已失效 */
    statusDisplay: string;
    /** 方向 close_long 平多，close_short 平空 */
    triggerSideInd: string;
    /** 委托价格类型 limit 限价 market 市价 */
    entrustTypeInd: string;
    /** 委托价格 */
    price: string;
    /** 委托数量 */
    size: string;
    /** 标的币 symbol */
    baseCoinShortName: string;
    /** 计价币 symbol */
    quoteCoinShortName: string;
    /** 触发价格类型（mark 标记，new 最新） */
    triggerPriceTypeInd: string;
    /** 触发价格  */
    triggerPrice: string;
    /** 触发方向 up=向上  大于等于，down=向下  小于等于 */
    triggerDirectionInd: string;
    /** 市价单时会有值，市价单单位 amount 按金额 quantity 按数量 */
    marketUnit: string;
}

export type FuturesPositionStrategyDetailsResp = {
    /** 止盈策略 */
    stopProfit: StopProfitResp;
    /** 止损策略 */
    stopLoss: StopProfitResp;
}

/**
 * 交易 - 止盈止损 - 取消仓位止盈止损
 */
export type FuturesPositionStrategyCancelReq = {
    /** 止盈止损 ID */
    id: string;
}

export type FuturesPositionStrategyCancelResp = {
    isSuccess: boolean;
}

/**
 * 交易 - 止盈止损 - 撤销全部仓位止盈止损
 */
export type FuturesPositionStrategyCancelAllReq = {
    /** 交易对 id */
    tradeId: number;
    /** 合约组 id */
    groupId: string;
    /** 订单类型 limit 限价  market 市价 */
    entrustTypeInd: string;
    /** 针对某个仓位的仓位止盈止损界面 撤销当前仓位的全部止盈止损 */
    positionId: string;
}

export type FuturesPositionStrategyCancelAllResp = {
    /** 返回状态码 200 为成功，其他 code 值为失败 */
    code: number;
    /** 返回信息说明 success */
    message: string;
    data: string;
}


/**
 * 资产 - 合约组详情 - 保证金折算率列表
 */
export type FuturesDetailMarginScaleListReq = {
    /** 合约组 id */
    groupId: string;
}

export type  MarginScaleListResp = {
    /** 币种 id */
    coinId: string;
    /** 币种名称 */
    coinName: string;
    appLogo: string;
    webLog: string
    /** 折算率 */
    scale: string;
}

export type FuturesDetailMarginScaleListResp = {
    list: MarginScaleListResp[]
}

/**
 * 交易 - 平仓 - 合约组额外保证金
 */
export type FuturesGroupPurchasingPowerReq = {
    /** 合约组 id */
    groupId: string;
}

export type FuturesGroupPurchasingPowerResp = {
    /** 剩余购买力 */
    purchasingPower: string;
}


/**
 * 资产 - 获取商户保证金币种配置
 */
export type AssetsMarginSettingsReq = {}

export type AssetsMarginSettingsResp = {
    merAssetsMarginSettingData: MerAssetsMarginSettingData[]
}

export type  MerAssetsMarginSettingData = {
    /** 币种 ID */
    coinId: string;
    /** 币种代码 */
    coinCode: string;
    /** 汇率类型，fixed 固定，float 浮动 */
    rateTypeInd: string;
    /** 浮动汇率比列 */
    scale: string;
}

/**
 * 资产 - 合约组 - 是否强平中
 */
export type FuturesDetailIsLiquidateReq = {
    groupId: string;
}

export type FuturesDetailIsLiquidateResp = {
    /** 是否强平中 */
    isLiquidate: boolean;
}

/**
 * 合约 - 修改逐仓名称
 */
export type PerpetualGroupModifyNameReq = {
    /** 合约组 id */
    groupId: string;
    /** 合约组名称 */
    name: string;
}

export type PerpetualGroupModifyNameResp = {
    isSuccess: boolean;
}


/**
 * 合约资产首页 - 获取合约保证金资产列表
 */
export type FuturesAssetsListReq = {}

export type FuturesAssetsListResp = {
    list: IFuturesAssetsList[];
    baseCoin: string;
}

export type IFuturesAssetsList = {
    /** 币种 id */
    coinId: string;
    webLogo: string;
    appLogo: string;
    /** 币种数量 */
    amount: string;
    /** 币种冻结数量 */
    lockAmount: string;
    /** 币种可用数量 */
    availableAmount: string;
    /** 币种名称 */
    coinName: string;
    /** 币种符号 */
    symbol: string;
    /** 折算价值 */
    convertedValue: string;
    groupList: IFuturesAssetsGroupList[];
}

export type IFuturesAssetsGroupList = {
    /** 合约组 id */
    groupId: string;
    /** 合约组名称 */
    groupName: string;
    /** 合约组币种数量 */
    amount: string;
    /** 币种冻结数量 */
    lockAmount: string;
    /** 币种可用数量 */
    availableAmount: string;
    /** 折算价值 */
    convertedValue: string;
}

/**
 * 逐仓详情 - 逐仓总价值
 */
export type FuturesDetailMarginScaleDetailReq = {
    /** 合约组 id */
    groupId: string;
}

export type FuturesDetailMarginScaleDetailResp = {
    /** 计价币 */
    baseCoin: string;
    /** 币种价值 */
    coinValue: string;
    /** 保证金价值 */
    marginValue: string;
    /** 平均折算比率 */
    averageScale: string;
    /** 保证金折算率列表 */
    marginScale: IMarginScaleList[];
}

export type IMarginScaleList = {
    /** 币种 id	 */
    coinId: string;
    /** 币种名称 */
    coinName: string;
    appLogo: string;
    webLogo: string;
	/** 保证金折算率 */
    scale: string;
}

  /** 划转》合约 - 现货 */
  export interface IFuturesSpotTransferReq {
    /** 目标合约组 id，type 为空时必传 */
    fromGroupId?: string | null
    /** 账户类型，合约组 id 为空时必传，asset 资产 */
    fromType?: string
    /** 币种 id */
    coinId: string
    /** 数量 */
    amount: string
    /** 账户类型，合约组 id 为空时必传，asset 资产，group 新建合约组 */
    toType?: string
    /** 目标合约组 id，type 为空时必传 */
    toGroupId?: string | null
  }

  export interface IFuturesSpotTransferResp {
    /** 是否成功 */
    isSuccess: boolean
  }

  export interface ITransferAccountListReq {
    /** 币种 id */
    coinId?: string
  }

  export interface ITransferAccountListResp {
    list: ITransferAccountListData[]
  }

  export interface ITransferAccountListData {
    /** 合约组 id，没有时前端写死交易账户 */
    groupId?: string | null
    /** 合约组名称 */
    groupName?: string
    /** 可划转币种数量 */
    amount: string
    /** 币种 id */
    coinId?: string
    /**币种名称*/
    coinName?: string
    /** 币种数量 */
    totalAmount?: string
  }


/**
 * [修改仓位杠杆倍数↗](https://yapi.nbttfc365.com/project/44/interface/api/5674)
 */
export interface ModifyPositionLeverReq {
    /** 合约组 id */
    groupId: string
    /** 仓位 Id */
    positionId: string
    /** 杠杆倍数 */
    lever: string
  }
  
  /**
   * [修改仓位杠杆倍数]
   */
  export interface ModifyPositionLeverResp {
    isSuccess: boolean
  }