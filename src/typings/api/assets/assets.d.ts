import { YapiGetV1BillLogDetailOtcDataC2CBillLogDetailData } from "@/typings/yapi/BillLogDetailV1GetApi";

/**
 * 资产总览 - 入参
 */
export type AssetsOverviewReq = {}
/**
 * 资产总览 - 出参
 */
export type AssetsOverviewResp = {
  symbol?: string;
  /** usdt 总数量 */
  totalAmount?: string;
  /** 理财资产 */
  financialAssetsData?: FinancialAssetsData;
  /** 币种资产 */
  coinAssetsData?: FinancialAssetsData;
  /** 流动数量 */
  availableAmount?: string;
  /** 冻结数量 */
  lockAmount?: string;
  /** 仓位数量 */
  positionAmount?: string;
  /** 合约资产 */
  futuresAssetsData?: FinancialAssetsData;
  /** c2c 资产 */
  c2cAssetsData?: FinancialAssetsData;
  /** 杠杠资产 */
  marginAssetsData?: FinancialAssetsData;
  /** 币种（只会传 USDT) */
  coinName?: string;
}


/**
 * 用户资产汇率 - 入参
 */
export type AssetsCoinRateReq = {}

/**
 * 用户资产汇率 - 出参
 */
// export type AssetsCoinRateResp = {
//   // cnyRate?: string;
//   // usdRate?: string
//   coinRate?: CoinRateResp[]
//   legalCurrencyRate?: any
// }
export type AssetsCoinRateResp = {
  /** 人民币汇率 */
  cnyRate?: string;
  /** 美元汇率 */
  usdRate?: string;
  /** 币种汇率列表 */
  coinRate?: CoinRateResp[]
 }
/**
 * 币种汇率对象
 */
// export type CoinRateResp =  {
//   coinName: string;
//   usdtRate?: string;
// }
export type CoinRateResp =  {
  coinId: string;
  /** 币种 */
  symbol: string;
  /** 币种对应 usdt 汇率 */
  usdtRate?: string;
  /** 币种精度 */
  coinPrecision: number
}

/**
 * 获取币币资产列表 - 入参
 */
export type CoinAssetsListReq = {
  isGt?: boolean
  pageNum: number;
  pageSize: number;
 }

/**
 * 获取币币资产列表 - 出参
 */
 export type CoinAssetsListResp = {
  pageNum?: number;
  pageSize?: number;
  total?: number;
  totalPage?: number;
  startIndex?: number;
  list: AssetsListResp[];
  start?: number;
  end?: number;
 }
/**
 * 所有币币资产列表
 */
 export type AssetsListResp =  {
  coinId: string
  /** 币种 app 端 logo */
  appLogo: string;
  /** 币种 web 端 logo */
  webLogo: string;
  /** 币种名称 */
  coinName: string;
  /** 币全名 */
  coinFullName: string;
  /** 可用数量 */
  availableAmount: string;
  /** 冻结数量 */
  lockAmount: string;
  /** 仓位数量 */
  positionAmount: string;
  /** 总数量 */
  totalAmount: string;
  /** 下单锁定 */
  orderLockAmount: string
  /** BTC 估值 */
  btcAmount: string
  /** USD 估值 */
  usdBalance:string
  /** 币种符号 - 钱包机返回的 */
  symbol: string;
  /** 交易对信息 */
  tradeList?:TradeListSpotResp[];
}

/**
 * 币币资产详情 - 入参
 */
export interface CoinAssetsDetailReq {
  /** 币种 id */
  coinId: number
}

/**
 * 币币资产详情 - 出参
 */
export interface CoinAssetsDetailResp {
  /**
   * 总资产数
   */
  totalAmount?: string
  /**
   * 可用数量
   */
  availableAmount?: string
  /**
   * 冻结资产
   */
  lockAmount?: string
  lockAmountData?: lockAmountDataResp
  /**
   * 仓位资产
   */
  positionAmount?: string
  /**
   * 仓位资产明细
   */
  positionAmountData?:positionAmountDataResp
  /**
   * 币种名称
   */
  coinName: string
  /** 币种符号 - 钱包机返回的 */
  symbol?: string;
}

/**
 * 仓位资产明细
 */
 export interface positionAmountDataResp {
  /**
   * 合约资产
   */
  futuresAssets?: string
  /**
   * 杠杠资产
   */
  marginAssets?: string
  /**
   * 理财资产
   */
  financialAssets?: string
}

/**
 * 冻结资产明细
 */
 export interface lockAmountDataResp {
  /**
   * 现货下单冻结资产
   */
   spotLockAssets?: string
   /**
    * 杠杆下单冻结资产
    */
   marginLockAssets?: string
   /**
    * 合约下单冻结资产
    */
   swapLockAssets?: string
   /**
    * 提现冻结资产
    */
   withdrawLockAssets?: string
}


/**
 * 获取所有币种信息 - 入参
 */
 export type IAllCoinListReq = {
  name?: string;
  // 1，提币，2、充值
  type: number
 }

/**
 * 获取所有币种信息 - 出参
 */
 export type IAllCoinListResp = {
  coinList: AllCoinListResp[];
 }
/**
 * 所有币种列表
 */
 export type AllCoinListResp =  {
  id: string;
  /** 币种 */
  symbol: string;
  /** 币种简称 */
  coinName: string;
  /** 币种全称 */
  coinFullName: string;
  /** 是否开启提现，1.是。2.否 */
  isWithdraw: number;
  /** 是否开启充值，1，是。2，否 */
  isDeposit: number;
  webLogo: string
  appLogo: string
  /** 是否热门币种，1.是，2.否 */
  isPopular: number
  /** 是否使用地址标签，1 是，2 否 */
  isUseMemo: number
}

/**
 * 根据主币获取子币列表 - 入参
 */
export interface ISubCoinListReq {
  coinId: number | string
}

/**
 * 根据主币获取子币列表 - 入参
 */
 export interface ISubCoinListResp {
  subCoinList?: ISubCoinList[]
}

/**
 * 子币列表
 */
export interface ISubCoinList {
  id: number
  /** 币种 */
  symbol: string
  /** 主链类型，区块链充提币主网选择展示 */
  mainType: string
  /** 主链类型，区块链充提币信息确认展示 */
  mainnet: string
  /** 简称 */
  coinName: string
  /** 名称 */
  coinFullName: string
  /** 是否开启提现 */
  isWithdraw: number
  /** 是否开启充值 */
  isDeposit: number
  /** 是否使用地址标签，1 是，2 否 */
  isUseMemo: number
}

/**
 * 获取充值地址（钱包地址） - 入参
 */
 export interface IDepositAddressReq {
  /** 币种 id */
  coinId?: number
}

/**
 * 验证提币地址 - 入参
 */
export interface IVerifyWithdrawAddressReq {
  /** 币种代码如：USDT-ERC20 */
  symbol?: string
  /** 提现地址 */
  address?: string
}

/**
 * 验证提币地址 - 出参
 */
 export interface IVerifyWithdrawAddressResp {
  isSuccess?: boolean
}

/**
 * 获取充值地址（钱包地址） - 出参
 */
export interface IDepositAddressResp {
  /** 地址 */
  address: string;
  /** 提现说明 */
  hint: string;
  /** 地址标签 */
  memo: string
  /** 最小充值金额 */
  depositMinLimit: string;
  /** 充值确认数 */
  depositConfirmNum: string;
  /** 提现解锁确认数 */
  withdrawConfirmNum: string;
  /** 合约信息 */
  contractInfo: string;
}

/**
 * 提币前校验用户提币资质 - 入参
 */
export type AssetsWithdrawVerifyReq = {}

/**
 * 提币前校验用户提币资质 - 出参
 */
export type AssetsWithdrawVerifyResp = {
   /** 校验是否成功 */
   isSuccess: boolean;
   /** 是否开启两项验证 */
   isOpenSafeVerify: boolean;
   /** 错误码 */
   errCode: number;
   /** 错误提示 */
   errMsg: string;
}


/**
 * 获取提币信息 - 入参
 */
 export type IWithdrawCoinInfoReq = {
  /** 币种 id，type 为 1 时，传子币 id，type 为 3 时，传主币 id */
  coinId: number;
  /** 1.链上转账，3，内部转账 */
  type: number;
 }

 /**
 * 获取提币信息 - 出参参
 */
 export type IWithdrawCoinInfoResp = {
  /** 最小提币数量 */
  minAmount: string;
  /** 主网手续费 */
  fee: string;
  /** 可用提币数量 */
  availableAmount: string
  /** 总金额 */
  amount:string
  /** 剩余 24 小时内可提现 USD 额度，-1 表示无限制 */
  remainingWithdrawalAmount:string
  /** 提币精度 */
  withdrawPrecision?: number;
  /** 手续费币种 */
  feeCoinName?: string;
  /** 手续费币种符号 */
  feeSymbol?: string;
  /** 用户手续费币种可用数量 */
  usrFeeAmount?: string;
  /** 单次最大提币数量（根据提币币种） */
  maxWithdrawAmount?: string;
  /** 24 小时最大提现额度 */
  dayMaxWithdrawAmount: string;
  /** 合约信息 */
  contractInfo?: string;
 }


/**
 * 个人中心 - 通过 uid 查询昵称
 */
export type AssetsNickNameReq = {
  /** 用户 uid */
  uid: string;
}
export type AssetsNickNameResp = {
  /** 昵称 */
  nickname: string;
}

/**
 * 资产 - 设置币种充提通知
 */
 export type AssetsSettingCoinPushReq = {
  /** 子币 id */
  coinId: number | string;
  /** 类型 1、充值 2、提现 */
  type: number;
  /** 状态 1、开启 2、关闭 */
  status: number;
 }

 export type AssetsSettingCoinPushResp = {
  isSuccess: boolean
 }

/**
 * 资产 - 获取币种开启充提推送状态
 */
 export type AssetsCoinPushStatusReq = {
   /** 子币 id */
   coinId: number | string;
   /** 类型 1、充值 2、提现 */
   type: number;
 }

export type AssetsCoinPushStatusResp = {
  /** 是否开启 */
  isOpen: boolean;
}

/**
 * 获取常用提现地址列表 - 入参
 */
export interface IWithdrawAddressListReq {}

/**
 * 获取常用提现地址列表 - 出参
 */
export interface IWithdrawAddressListResq {
  addressList?: IWithdrawAddressList[]
}
/**
 * 获取常用提现地址列表
 */
export interface IWithdrawAddressList {
  id: number
  /** 备注 */
  remark: string
  /** 地址 */
  address: string
}

/**
 * 设置常用提币地址 - 入参
 */
 export interface IAddWithdrawAddressReq {
  id?: number
  /** 备注 */
  remark?: string
  /** 地址 */
  address: string
}

/**
 * 设置常用提币地址 - 出参
 */
 export interface IAddWithdrawAddressResp {
  isSuccess?: boolean
  errMsg?: string
 }


/**
 * 删除常用提币地址 - 入参
 */
 export interface IDeleteWithdrawAddressReq {
  id: number
}

/**
 * 删除常用提币地址 - 出参
 */
 export interface IDeleteWithdrawAddressResp {
  isSuccess?: boolean
  errMsg?: string
 }

/**
 * 发起提币申请 - 入参
 */
export interface ISubmitWithdrawReq {
  /**
   * 币种 ID
   */
   coinId: number
   /**
    * 提币地址，连上转账必传
    */
   address?: string
   /**
    * 币种符号（子币名称 USDT-TRC20）
    */
   symbol?: string
   /**
    * 提币数量
    */
   amount: number
   /**
    * 充值地址标签，如果需要 memo，此处为必填
    */
   memo?: string
   /**
    * 1.链上转账，3，内部转账
    */
   type: number
   /**
    * 用户唯一的 uid，内部转账必传
    */
   uid?: string
   /**
    * 短信验证码
    */
   smsCode?: string
   /**
    * 邮箱验证码
    */
   emailCode?: string
   /**
    * 谷歌验证码
    */
   googleCode?: string
}

/**
 * 发起提币申请 - 出参
 */
 export interface ISubmitWithdrawResp {
  isSuccess: boolean
 }
export type FinancialAssetsData = {
  /** BTC 总数量 */
  totalAmount: string;
  /** 可用数量 */
  availableAmount: string;
  /** 仓位资产数 */
  lockAmount: string;
  /** 币种（只会传 BTC)-币名称简称 - 商户可在后管可以设置 */
  coinName: string;
  /** 币种符号 - 钱包机返回的 */
  symbol?: string;
  /** 仓位资产 */
  positionAmount?: string
}



/** ============================================== 财务记录 ============================================== */
/**
 * 财务记录列表 - 入参
 */
 export type AssetsRecordsCoinListReq = {
  /** 财务类型：全部时不传，1，现货，2、充提、3、借还款、4、合约、5、手续费、6、衍生品、7、其他 */
  logType?: number;
  type?: number | string;
  /** 合约组 id */
  groupId?: string;
}

/**
 * 财务记录列表 - 出参
 */
export type AssetsRecordsCoinListResp = {
  coinList: RecordsCoinListResp[]
}

/**
 * 财务记录列表数据
 */
export type RecordsCoinListResp = {
  /** 币种 id */
  id: number;
  /** 币种 */
  symbol: string;
  /** 币种简称 */
  coinName: string;
  /** 名称 */
  coinFullName: string;
  webLogo: string;
  appLogo: string;
}

/**
 * 资产 - 财务记录列表
 */
export type AssetsRecordsListReq = {
  /** 类型，1. 充币，2. 提币 ,3 pay , 4. 冲正 */
  type?: number | number[];
  /** 开始时间 */
  startDate?: number;
  /** 结束时间 */
  endDate?: number;
  /** 币种 id */
  coinId?: string;
  /** 状态，1、进行中 2、成功 3、失败 4、错误 */
  status?: number;
  /** 页数 */
  pageNum: number;
  /** 条数 */
  pageSize: number;
  /** 财务类型：1、总览，2、充提，3、合约，4、衍生品，5、其他，6、手续费 */
  logType?: number;
  /** 合约组 id */
  groupId?: string;
  /** 代理商返佣类型：数据字典：rebate_type_cd，selfRebate：自返佣，teamRebate：团队返佣 */
  rebateType?: string;
  /** 0 或者 1，返回的数据金额是否大于 0，充值页面过滤用 1，返回金额小于 0 传 0，不需要过滤不传该参数 */
  isGt?: number;
}

export type AssetsRecordsListResp = {
  pageNum: number;
  pageSize: number;
  total: number;
  totalPage: number;
  startIndex: number;
  list: RecordsListResp[];
  start: number;
  end: number;
}

export type RecordsListResp = {
  id: string;
  /** 币种 */
  businessCoin: string;
  /** 总金额 */
  total: string;
  /** 创建时间 */
  createdByTime: number;
  /** 状态，1、进行中 2、成功 3、失败 4、错误 */
  status: number;
  /** 类型 1、充值 2、提币 3、pay 4、冲正 5、现货手续费 6、合约手续费 7、提币手续费 8、锁仓手续费 */
  type: number;
  /** 合约类型 */
  groupType?: number;
  /** 手动/自动 */
  operationType?: string;
  /** 合约组名称 */
  groupName?: string;
  typeName?: string;
  statusName?: string
}

/**
 * 资产 - 财务记录详情
 */
export type AssetsRecordsDetailsReq = {
  id: string
}
/**
 * 资产 - 财务记录详情 - 出参
 */
export type AssetsRecordsDetailsResp = {
  depositWithdraw?: DepositWithdrawResp;
  fee?: FeeResp;
  perpetual?: perpetualResp
  /** 佣金详情 */
  commission?: AssetsRecordsDetails;
  c2cBillLogDetail?: AssetsRecordsDetails;

}

export type AssetsRecordsDetails = {
  /** 充值地址 memo/标签 */
  memo?: string;
  /** 交易 hash */
  txHash?: string;
  /** 手续费 */
  fee?: string;
  /** 币种代码 */
  symbol?: string;
  /** 总金额 */
  total?: number;
  /** 区块确认数/当前确认数  */
  confirmation?: number;
  /** 财务流水 */
  serialNo?: string;
  /** 1、进行中 2、成功 3、失败 4、错误 */
  statusCd: number;
  /** 到账金额/金额/数量 */
  amount?: number;
   /** 创建时间 */
  createdByTime?: number;
  /** 类型，1. 充币，2. 提币，3.pay，4.冲正，5、现货手续费 6、合约手续费 7、提币手续费 8、锁仓手续费 */
  typeInd: number;
  /** 充值地址/地址 */
  address?: string;
  /** 区块总数/ 提现总确认数 */
  blockTotal?: number;
  /** 完成时间 */
  updatedByTime?: number;
  /** 1 区块链充提币；2 Pay；3 平台内区块链地址 */
  channelInd?: number;
  /** 驳回原因 */
  reason?: string;
  /** 目标 uid */
  toUid?: string;
  /** 币种 */
  businessCoin?: string;
  /** 来源 uid */
  fromUid?: string;
  mainnet?:	string;
  /** 手续费币种 */
  feeCoinName?: string;
  /** 1 买单 2 卖单/开空/开多 */
  side: number | string;
  /** 1 限价 2 市价 */
  orderType: number,
  /** 合约相关 */
  /** 币种名称 */
  coinName?: string;
  /** 合约组名称 */
  groupName?: string;
  /** 手动/自动 */
  operationType?: string;
  /** 目标合约组名称 */
  toGroupName?: string;
  /** 杠杆倍数 */
  lever?: string;
  /** 委托价格 */
  price?: string;
  /** 委托类型 */
  entrustTypeInd?: string;
  /** 订单状态 */
  orderStatus?: string;
  /** 委托数量 */
  size?: string;
  /** 成交数量 */
  tradeSize?: string;
  /** 成交均价 */
  tradePrice?: string;
  /** 收益 */
  realizedProfit?: string;
  /** 收益率 */
  realizedProfitYield?: string;
  /** 资金明细 */
  assetDetail?: PerpetualAssetDetail[];
  /** 成交明细 */
  dealDetail?: PerpetualDealDetail[];
  /** 计价币 */
  quoteCoinShortName?: string;
  /** 标的币 */
  baseCoinShortName?: string;
  /** 委托价格类型 */
  orderTypeInd?: string;
  /** 迁移类型 */
  migrateMargin?: string;
  /** 迁移可用保证金 */
  migrateType?: string;
  /** 合约组类型 */
  groupType?: string;
  /** c2c 业务类型 */
  typeStr?: string;
  /** 订单编号 */
  orderNumber?: string;
  /** 转出账户 */
  transferOut?: string;
  /** 转入账户 */
  transferIn?:string
  /** 1：接管单，2:非接管单 */
  isAccept?:number;
  /** 申诉人 */
  appealUserName?:string
  /** 申诉原因 */
  appealReason?:string
  /** 申诉人 UID */
  appealUid?: string
  /** 返佣类型：数据字典：RebateTypeCdEnum */
  rebateTypeCd?: string
  /** otc 详情 */
  otcData?:YapiGetV1BillLogDetailOtcDataC2CBillLogDetailData
}

/** 现货 - 充提详情 */
export type DepositWithdrawResp = {
  /** 充值地址 memo */
  memo?: string;
  /** 交易 hash */
  txHash?: string;
  /** 手续费 */
  fee?: number;
  /** 币种代码 */
  symbol?: string;
  /** 总金额 */
  total?: number;
  /** 区块确认数 */
  confirmation?: number;
  /** 财务流水 */
  serialNo?: number;
  /** 1、进行中 2、成功 3、失败 4、错误 */
  statusCd?: number;
  /** 到账金额 */
  amount?: number;
   /** 创建时间 */
  createdByTime?: number;
  /** 类型，1. 充币，2. 提币，3.pay ,4.冲正 */
  typeInd?: number;
  /** 充值地址 */
  address?: string;
  /** 区块总数 */
  blockTotal?: number;
  /** 完成时间 */
  updatedByTime?: number;
  /** 1 区块链充提币；2 Pay；3 平台内区块链地址 */
  channelInd?: number;
  /** 驳回原因 */
  reason?: string;
  /** 目标 uid */
  toUid?: number;
  /** 币种 */
  businessCoin?: string;
  /** 来源 uid */
  fromUid?: number;
  /** 手续费的 - 转账网络 */
  mainnet?: string
  /** 手续费币种 */
  feeCoinName?: string
}

/** 手续费详情 */
export type FeeResp = {
  /** 币种 */
  businessCoin?: string;
	/** 提现总确认数 */
  blockTotal?: string;
	/** 当前确认数 */
  confirmation?:	string;
	/** 转账网络 */
  mainnet?:	string;
	/** 地址 */
  address?:	string;
	/** 标签 */
  memo?: string;
	/** 交易 hash */
  txHash?: string;
	/** 金额 */
  amount?:number;
  /** 手续费 */
  fee?: number;
  /** 创建时间 */
  createdByTime?:	number;
	/** 完成时间 */
  updatedByTime?:	number;
	/** 交易流水 */
  serialNo?: string;
	/** 类型：5、现货手续费 6、合约手续费 7、提币手续费 8、锁仓手续费 */
  typeInd?:	number;
	/** 状态：1、进行中 2、成功 3、失败 4、错误 */
  statusCd?: number;
  /** 手续费币种 */
  feeCoinName?: string;
  /** 1 买单 2 卖单 */
  side?: number
  /** 1 限价 2 市价	 */
  orderType?: number
  /** 交易对 */
  symbol?: string
}

/**
 * 合约详情
 */
export interface perpetualResp {
  /**
   * 流水号
   */
  serialNumber?: string
  /**
   * 日志类型
   */
  type?: string
  /**
   * 币种名称
   */
  coinName?: string
  /**
   * 状态
   */
  status?: string
  /**
   * 购买力
   */
  purchasingPower?: string
  /**
   * 合约组名称
   */
  groupName?: string
  /**
   * 手动/自动
   */
  operationType?: string
  /**
   * 创建时间
   */
  createTime?: string
  /**
   * 完成时间
   */
  updateTime?: string
  /**
   * 目标合约组名称
   */
  toGroupName?: string
  /**
   * 杠杆倍数
   */
  lever?: string
  /**
   * 开空/开多
   */
  side?: string
  /**
   * 资金明细
   */
  assetDetail?: PerpetualAssetDetail[]
  /**
   * 成交明细
   */
  dealDetail?: PerpetualDealDetail[]
  /** 1：接管单，2:非接管单 */
  isAccept?:number;
}

export interface PerpetualAssetDetail {
  /** 时间 */
  time: number;
  /** 数量 */
  amount: string;
  /** 类型 */
  assetType: string;
  /** 当时汇率 */
  rate: string;
  /** 法币 */
  currencyName: string;
  /** 币种 */
  coinName: string;
}
export interface PerpetualDealDetail {
  /** 时间 */
  time: number;
  /** 数量 */
  size: string;
  /** 价格 */
  price: string;
  /** 手续费 */
  fee: string;
  /** 计价币 */
  quoteSymbolName: string;
  /** 标的币 名 */
  baseSymbolName?: string;
}

/**
 * 行情 - 搜索交易对 (币对模糊查询，交易币搜索)
 */
 export type AssetsTradeListReq = {
  /** 交易币的 id，精确查询 */
  sellCoinId?: string;
  /** 模糊查询，搜索输入框的文本 */
  symbolName?: string;
 }

 export type AssetsTradeListResp = {
  spot?: TradeListSpotResp[]
  perpetual?:TradeListFuturesResp[]
 }

 export type TradeListSpotResp = {
  id?: number;
  /** 标的币 */
  sellCoinId?: number;
  /** 计价币 */
  buyCoinId?: number;
  /** 交易区 */
  tradeArea?: number;
  symbolName?: string;
  /** 涨跌幅 */
  chg?: string;
  /** 最高价 */
  high?: string;
  /** 当前价 */
  last?: string;
  /** 最低价 */
  low?: string;
  /** 开盘价 */
  open?: string;
  /** 成交量 */
  volume?: string;
  /** 成交额 */
  quoteVolume?: string;
  time?: number;
  /** 标的币 名 */
  baseSymbolName?: string;
  /** 计价币 名 */
  quoteSymbolName?: string;
  /** 钱包币对名 */
  symbolWassName?: string;
  /** 排序字段 */
  sort?: number;
  /** 交易对精度 */
  priceOffset?: number
  /** ws 推送上次的 last 值 */
  lastPrev?: number | string
 }

 export type TradeListFuturesResp = {
  /**
   * 标的币 id
   */
  sellCoinId?: number
  /**
   * 最小下单金额
   */
  minAmount?: null
  tradeArea?: null
  minusFeeRate?: number
  /**
   * 商户 id
   */
  businessId?: number
  /**
   * 最大下单数量
   */
  maxCount?: null
  /**
   * 结算时间
   */
  cycle?: string
  /**
   * 流通量
   */
  circulatingSupply?: number
  /**
   * 最高价
   */
  high?: string
  /**
   * 最低价
   */
  low?: string
  /**
   * 币对名
   */
  symbolName?: string
  id?: number
  /**
   * 最大下单金额
   */
  maxAmount?: null
  /**
   * 计价币 id
   */
  buyCoinId?: number
  /**
   * wass 钱包名
   */
  symbolWassName?: string
  /**
   * 1=启用 2=禁用
   */
  enableState?: number
  /**
   * 合约类型 delivery =交割 ,perpetual =永续
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
   * 下单价格偏移
   */
  priceOffset?: number
  /**
   * 是否删除 2=未删除 1=已删除
   */
  isDelete?: number
  /**
   * 成交额
   */
  quoteVolume?: string
  /**
   * 排序字段
   */
  sort?: number
  /**
   * 是否添加自选 1=自选
   */
  favourite?: number
  /**
   * 成交量
   */
  volume?: string
  /**
   * 计价币名
   */
  quoteSymbolName?: null
  /**
   * 标的币名
   */
  baseSymbolName?: string
  /**
   * 结算规则
   */
  settlementRules?: number
  plusFeeRate?: number
  /**
   * 是否开盘;1=开盘中，2=停盘中，3=预约开盘
   */
  marketStatus?: number
  /**
   * 1=交易 2=不交易
   */
  isShare?: number
  /**
   * 最小下单数量
   */
  minCount?: null
  /**
   * 时间
   */
  time?: null
  /**
   * 开盘价
   */
  open?: string
  sellFee?: null
  /**
   * 标的币精度
   */
  baseSymbolScale: number
  /**
   * 计价币精度
   */
  quoteSymbolScale: number
 }


/**
 * 资产 - 币种资产详情 - 交易页面用
 */
export interface ICoinBalanceRequest {
  /**
   * 币种 id 数组
   */
  coinId: string
}

/**
 * 资产 - 币种资产详情 - 交易页面用
 * YAPI：https://yapi.admin-devops.com/project/44/interface/api/2987
 */
export interface ICoinBalanceResponse {
  code?: number
  message?: string
  data?: ICoinBalanceData
}
export interface ICoinBalanceData {
  list?: ICoinBalanceDataList[]
}
export interface ICoinBalanceDataList {
  /**
   * app 图标
   */
  appLogo: string
  /**
   * web 图标
   */
  webLogo: string
  /**
   * 币种名称
   */
  coinName: string
  /**
   * 币全名
   */
  coinFullName: string
  /**
   * 可用数量
   */
  availableAmount: string
  /**
   * 锁定数量
   */
  lockAmount: string
  /**
   * 仓位数量
   */
  positionAmount: string
  /**
   * 总数量
   */
  totalAmount: string
  /**
   * 币种 id
   */
  coinId: string
  /**
   * 钱包币种代码
   */
  symbol: string
}


export type WithdrawsFeeListReq = {
  /** 币种或者主网 */
  param?: string
 }

 export type WithdrawsFeeListResp = {
  coinRemarks: string;
  createdByTime: string;
  issuePrice?: any;
  payHint?: any;
  appLogo: string;
  minWithdrawCount?: any;
  issueAllNum?: any;
  monitoringPlatform?: any;
  circulatingSupply: number;
  officialUrl: string;
  monitoringPlatformRule: number;
  favouritePercent: number;
  publicChain: string;
  monitoringStatus?: any;
  minPayCount?: any;
  startTime: string;
  id: number;
  maxSupply: number;
  addressSelect: string;
  createdById: number;
  startPrice: number;
  feeCoinId: number;
  memoCheck?: any;
  maxWithdrawCount?: any;
  updatedByTime: string;
  fullName: string;
  favouritePercentFrom: number;
  updatedById: number;
  withdrawFee: number;
  lowest: number;
  version: number;
  whitePaper: string;
  lowestTime: string;
  coinId: number;
  txidSelect?: any;
  highest: number;
  webLogo?: any;
  highestTime?: any;
  coinName: string;
  explorerAddressUrl?: any;
  circulatingPercent?: any;
  publicChains?: string;
  withdrawFees?: string;
 }
 /**
 * 资产 - 币种资产总览
 */
export type AssetsCoinOverviewReq = {}

export type AssetsCoinOverviewResp = {
  /** 冻结资产 */
  lockAmount: string;
  /** 币种名称 */
  coinName: string;
  /** 总资产 */
  totalAmount: string;
  /** 币种符号 */
  symbol: string;
  /** 流动资产 */
  availableAmount: string;
  /** 仓位资产 */
  positionAmount: string;
}

