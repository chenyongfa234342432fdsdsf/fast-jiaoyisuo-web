/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [全仓账户--账户所有资产↗](https://yapi.coin-online.cc/project/72/interface/api/1841) 的 **请求类型**
 *
 * @分类 [全仓杠杆模块接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_422)
 * @标签 `全仓杠杆模块接口`
 * @请求头 `GET /margin/cross/account`
 * @更新时间 `2022-08-29 13:58:20`
 */
export interface YapiGetMarginCrossAccountApiRequest {}

/**
 * 接口 [全仓账户--账户所有资产↗](https://yapi.coin-online.cc/project/72/interface/api/1841) 的 **返回类型**
 *
 * @分类 [全仓杠杆模块接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_422)
 * @标签 `全仓杠杆模块接口`
 * @请求头 `GET /margin/cross/account`
 * @更新时间 `2022-08-29 13:58:20`
 */
export interface YapiGetMarginCrossAccountApiResponse {
  code?: number
  data?: YapiDtoMagCrossAssetsVO
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
/**
 * 杠杆全仓账户
 */
export interface YapiDtoMagCrossAssetsVO {
  /**
   * 总资产折合成人民币
   */
  allCrossAssetsInCny?: string
  /**
   * 总资产折合成USDT
   */
  allCrossAssetsInUsdt?: string
  /**
   * 总负债折合成人民币
   */
  allCrossDebtInCny?: string
  /**
   * 总负债折合成USDT
   */
  allCrossDebtInUsdt?: string
  /**
   * 总负债折合成人民币
   */
  allCrossNetAssetsInCny?: string
  /**
   * 账户权益折合成USDT
   */
  allCrossNetAssetsInUsdt?: string
  /**
   * 币种资产详情列表
   */
  assetDetails?: YapiDtoMagCrossAssetsDetailVO[]
  /**
   * 用户杠杆风险率
   */
  marginLevel?: string
  /**
   * 风险等级：1低风险、2中风险、3高风险
   */
  marginLevelRisk?: number
  /**
   * 杠杆倍数
   */
  marginRatio?: string
  /**
   * 隐藏小余额资产
   */
  smallAssetsHideThreshold?: string
}
export interface YapiDtoMagCrossAssetsDetailVO {
  /**
   * 当前借币数量
   */
  borrowed?: string
  /**
   * 币种id
   */
  coinId?: number
  /**
   * 币种名称
   */
  coinName?: string
  /**
   * 资产
   */
  crossAssets?: string
  /**
   * 单币种资产折合成人民币
   */
  crossAssetsInCny?: string
  /**
   * 单币种资产折合成USDT
   */
  crossAssetsInUsdt?: string
  /**
   * 单币种负债
   */
  crossDebt?: string
  /**
   * 单币种负债折合成人民币
   */
  crossDebtInCny?: string
  /**
   * 单币种负债折合成USDT
   */
  crossDebtInUsdt?: string
  /**
   * 净资产
   */
  crossNetAssets?: string
  /**
   * 单币种账户权益折合成人民币
   */
  crossNetAssetsInCny?: string
  /**
   * 单币种账户权益折合成USDT
   */
  crossNetAssetsInUsdt?: string
  /**
   * 可用数量
   */
  free?: string
  /**
   * 冻结数量
   */
  frozen?: string
  /**
   * 图片
   */
  imageUrl?: string
  /**
   * 利息
   */
  interest?: string
  /**
   * 是否负债 0-否，1-是
   */
  isDebt?: string
}

/* prettier-ignore-end */
