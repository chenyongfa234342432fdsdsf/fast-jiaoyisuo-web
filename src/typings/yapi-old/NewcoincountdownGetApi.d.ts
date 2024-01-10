/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [新币倒计时↗](https://yapi.coin-online.cc/project/72/interface/api/1958) 的 **请求类型**
 *
 * @分类 [币对相关↗](https://yapi.coin-online.cc/project/72/interface/api/cat_437)
 * @标签 `币对相关`
 * @请求头 `GET /newCoinCountdown`
 * @更新时间 `2022-08-29 13:58:24`
 */
export interface YapiGetNewCoinCountdownApiRequest {
  /**
   * tradeId
   */
  tradeId: string
}

/**
 * 接口 [新币倒计时↗](https://yapi.coin-online.cc/project/72/interface/api/1958) 的 **返回类型**
 *
 * @分类 [币对相关↗](https://yapi.coin-online.cc/project/72/interface/api/cat_437)
 * @标签 `币对相关`
 * @请求头 `GET /newCoinCountdown`
 * @更新时间 `2022-08-29 13:58:24`
 */
export interface YapiGetNewCoinCountdownApiResponse {
  code?: number
  data?: YapiDtoNewCoinCountdownResp
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
/**
 * 新币倒计时返回信息
 */
export interface YapiDtoNewCoinCountdownResp {
  /**
   * 倒计时、单位秒
   */
  countdown?: number
  /**
   * 项目简介url
   */
  projectBrief?: string
  /**
   * 项目官网url
   */
  projectWebsite?: string
}

/* prettier-ignore-end */
