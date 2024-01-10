/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [全仓交易对列表↗](https://yapi.coin-online.cc/project/72/interface/api/1856) 的 **请求类型**
 *
 * @分类 [全仓杠杆模块接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_422)
 * @标签 `全仓杠杆模块接口`
 * @请求头 `GET /margin/cross/crossPairs`
 * @更新时间 `2022-08-29 13:58:20`
 */
export interface YapiGetMarginCrossCrossPairsApiRequest {}

/**
 * 接口 [全仓交易对列表↗](https://yapi.coin-online.cc/project/72/interface/api/1856) 的 **返回类型**
 *
 * @分类 [全仓杠杆模块接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_422)
 * @标签 `全仓杠杆模块接口`
 * @请求头 `GET /margin/cross/crossPairs`
 * @更新时间 `2022-08-29 13:58:20`
 */
export interface YapiGetMarginCrossCrossPairsApiResponse {
  code?: number
  data?: YapiDtoMagCrossPairVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
/**
 * 杠杆全仓交易对
 */
export interface YapiDtoMagCrossPairVO {
  /**
   * 标的币
   */
  base?: string
  id?: number
  /**
   * 杠杆倍数
   */
  marginRatio?: string
  /**
   * 能否杠杆交易，默认flase 不可交易 true可交易
   */
  marginTradeAble?: boolean
  /**
   * 计价币
   */
  quote?: string
  /**
   * 交易对id
   */
  tradeId?: number
}

/* prettier-ignore-end */
