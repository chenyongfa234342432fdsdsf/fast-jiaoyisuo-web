/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [根据sellName和buyName获取一条交易对信息,默认获取交易区1中BTC\/USDT的交易对信息,如果状态异常则随机取出一条正常的交易对信息↗](https://yapi.coin-online.cc/project/72/interface/api/2207) 的 **请求类型**
 *
 * @分类 [trade-ws-api-controller↗](https://yapi.coin-online.cc/project/72/interface/api/cat_413)
 * @标签 `trade-ws-api-controller`
 * @请求头 `GET /v3/getOneTradeInfo`
 * @更新时间 `2022-08-29 13:58:33`
 */
export interface YapiGetV3GetOneTradeInfoApiRequest {
  /**
   * 交易区id
   */
  type?: string
  /**
   * sellShortName
   */
  sellShortName?: string
  /**
   * buyShortName
   */
  buyShortName?: string
  /**
   * tradeId
   */
  tradeId?: string
}

/**
 * 接口 [根据sellName和buyName获取一条交易对信息,默认获取交易区1中BTC\/USDT的交易对信息,如果状态异常则随机取出一条正常的交易对信息↗](https://yapi.coin-online.cc/project/72/interface/api/2207) 的 **返回类型**
 *
 * @分类 [trade-ws-api-controller↗](https://yapi.coin-online.cc/project/72/interface/api/cat_413)
 * @标签 `trade-ws-api-controller`
 * @请求头 `GET /v3/getOneTradeInfo`
 * @更新时间 `2022-08-29 13:58:33`
 */
export interface YapiGetV3GetOneTradeInfoApiResponse {
  code?: number
  data?: YapiDtoTradeRankCoinResp
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoTradeRankCoinResp {
  buyShortName?: string
  buySymbol?: string
  change?: string
  cny?: string
  digit?: string
  favorite?: boolean
  imageUrl?: string
  /**
   * 是否支持杠杆
   */
  isMarginTrade?: boolean
  isOpen?: string
  /**
   * 是否支持价格订阅
   */
  isPriceAlert?: boolean
  last?: string
  /**
   * 最大杠杆倍数
   */
  marginRatio?: string
  sellShortName?: string
  sellSymbol?: string
  totalAmount?: string
  tradeArea?: number
  tradeId?: number
  volume?: string
}

/* prettier-ignore-end */
