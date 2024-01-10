/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [查询杠杆交易区信息列表↗](https://yapi.coin-online.cc/project/72/interface/api/1946) 的 **请求类型**
 *
 * @分类 [杠杆交易行情模块↗](https://yapi.coin-online.cc/project/72/interface/api/cat_449)
 * @标签 `杠杆交易行情模块`
 * @请求头 `GET /margin/tradeArea/list`
 * @更新时间 `2022-08-29 13:58:23`
 */
export interface YapiGetMarginTradeAreaListApiRequest {}

/**
 * 接口 [查询杠杆交易区信息列表↗](https://yapi.coin-online.cc/project/72/interface/api/1946) 的 **返回类型**
 *
 * @分类 [杠杆交易行情模块↗](https://yapi.coin-online.cc/project/72/interface/api/cat_449)
 * @标签 `杠杆交易行情模块`
 * @请求头 `GET /margin/tradeArea/list`
 * @更新时间 `2022-08-29 13:58:23`
 */
export interface YapiGetMarginTradeAreaListApiResponse {
  code?: number
  data?: YapiDtoMagTradeAreaVO
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
/**
 * 杠杆交易区
 */
export interface YapiDtoMagTradeAreaVO {
  /**
   * 杠杆交易区列表
   */
  areas?: YapiDtoMagTradeArea[]
  /**
   * 杠杆交易对列表
   */
  symbols?: YapiDtoMagTradePair[]
}
/**
 * 杠杆交易区
 */
export interface YapiDtoMagTradeArea {
  /**
   * 交易区id
   */
  areaId?: number
  sort?: number
  /**
   * 交易区
   */
  tradeArea?: string
}
/**
 * 杠杆交易对
 */
export interface YapiDtoMagTradePair {
  /**
   * 交易区id
   */
  areaId?: number
  /**
   * 标的币是否可借
   */
  baseBorrowable?: boolean
  /**
   * 标的币id
   */
  baseCoinId?: number
  /**
   * 标的币名称
   */
  baseCurrency?: string
  /**
   * 买手续费
   */
  buyFee?: string
  /**
   * 全仓杠杆倍数
   */
  crossRatio?: string
  /**
   * 能否全仓杠杆交易
   */
  crossTradeable?: boolean
  /**
   * 有效小数位控制
   */
  digit?: string
  /**
   * 币种Logo
   */
  imageUrl?: string
  /**
   * 逐仓杠杆倍数
   */
  isolatedRatio?: string
  /**
   * 能否逐仓杠杆交易
   */
  isolatedTradeable?: boolean
  /**
   * 计价币是否可借
   */
  quoteBorrowable?: boolean
  /**
   * 计价币id
   */
  quoteCoinId?: number
  /**
   * 计价币名称
   */
  quoteCurrency?: string
  /**
   * 卖手续费
   */
  sellFee?: string
  /**
   * 排序id
   */
  sortId?: number
  /**
   * 交易区，比如BTC、USDT
   */
  tradeArea?: string
  /**
   * 交易对id
   */
  tradeId?: number
}

/* prettier-ignore-end */
