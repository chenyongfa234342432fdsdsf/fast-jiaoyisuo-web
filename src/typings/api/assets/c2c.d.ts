
/**
 * 资产-c2c 列表
 */
export type AssetsC2CListReq = {}

export type AssetsC2CListResp = {
  uid?: string;
  /** 币种 ID */
  coinId?: string;
  /** 币种代码 用于匹配汇率 */
  symbol?: string;
  /** 可用余额 */
  balance?: number;
  businessId?: number;
  /** 冻结金额 */
  freezeBalance?: number;
  /** 申请广告商真实冻结资产（赔付会扣减） */
  merchantFreezeBalance?:number
  appLogo: string;
  webLogo: string;
  coinName: string;
  coinFullName: string;
  usdBalance?: number;
}

export interface YapiGetV1C2CBalanceAllListData {
  /**
   * 币种代码（匹配汇率）
   */
  symbol?: string
  /**
   * 币种 app 端 logo
   */
  appLogo?: string
  /**
   * BTC 估值
   */
  btcAmount?: string
  /**
   * 币种 id
   */
  coinId?: string
  /**
   * 总数量
   */
  totalAmount?: string
  /**
   * usd 估值
   */
  usdBalance?: string
  /**
   * 可用数量
   */
  availableAmount?: string
  /**
   * 冻结数量
   */
  lockAmount?: string
  /**
   * 币种 web 端 logo
   */
  webLogo?: string
  /**
   * 币全名（展示）
   */
  coinFullName?: string
  /**
   * 下单锁定
   */
  orderLockAmount?: string
  /**
   * 币种名称（展示）
   */
  coinName?: string
  /**
   * 仓位数量
   */
  positionAmount?: string
}