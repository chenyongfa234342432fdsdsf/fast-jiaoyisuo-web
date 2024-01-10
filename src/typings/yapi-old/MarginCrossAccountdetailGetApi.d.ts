/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [全仓账户--单个币种↗](https://yapi.coin-online.cc/project/72/interface/api/1844) 的 **请求类型**
 *
 * @分类 [全仓杠杆模块接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_422)
 * @标签 `全仓杠杆模块接口`
 * @请求头 `GET /margin/cross/accountDetail`
 * @更新时间 `2022-08-29 13:58:20`
 */
export interface YapiGetMarginCrossAccountDetailApiRequest {
  userId?: string
  /**
   * 交易对id
   */
  tradeId?: string
  /**
   * 币种id
   */
  coinId?: string
}

/**
 * 接口 [全仓账户--单个币种↗](https://yapi.coin-online.cc/project/72/interface/api/1844) 的 **返回类型**
 *
 * @分类 [全仓杠杆模块接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_422)
 * @标签 `全仓杠杆模块接口`
 * @请求头 `GET /margin/cross/accountDetail`
 * @更新时间 `2022-08-29 13:58:20`
 */
export interface YapiGetMarginCrossAccountDetailApiResponse {
  code?: number
  data?: YapiDtoMagCrossAssetsDetailVO
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
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
