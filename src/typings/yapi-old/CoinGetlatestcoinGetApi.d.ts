/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [获取最新上币↗](https://yapi.coin-online.cc/project/72/interface/api/1529) 的 **请求类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `GET /coin/getLatestCoin`
 * @更新时间 `2022-08-29 13:58:08`
 */
export interface YapiGetCoinGetLatestCoinApiRequest {}

/**
 * 接口 [获取最新上币↗](https://yapi.coin-online.cc/project/72/interface/api/1529) 的 **返回类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `GET /coin/getLatestCoin`
 * @更新时间 `2022-08-29 13:58:08`
 */
export interface YapiGetCoinGetLatestCoinApiResponse {
  code?: number
  data?: YapiDtoLatestCoinVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoLatestCoinVO {
  /**
   * 计价币id
   */
  buyCoinId?: number
  /**
   * 计价币logo
   */
  buyCoinLogo?: string
  /**
   * 计价币简称
   */
  buyCoinShortName?: string
  /**
   * 标的币id
   */
  sellCoinId?: number
  /**
   * 标的币logo
   */
  sellCoinLogo?: string
  /**
   * 标的币简称
   */
  sellCoinShortName?: string
  /**
   * 交易对id
   */
  systemTradeId?: number
}

/* prettier-ignore-end */
