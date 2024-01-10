/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [用户总资产↗](https://yapi.coin-online.cc/project/72/interface/api/2183) 的 **请求类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `GET /v3/balance`
 * @更新时间 `2022-08-29 13:58:32`
 */
export interface YapiGetV3BalanceApiRequest {}

/**
 * 接口 [用户总资产↗](https://yapi.coin-online.cc/project/72/interface/api/2183) 的 **返回类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `GET /v3/balance`
 * @更新时间 `2022-08-29 13:58:32`
 */
export interface YapiGetV3BalanceApiResponse {
  code?: number
  data?: YapiDtoBalanceVO
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoBalanceVO {
  /**
   * 折合成人民币总资产
   */
  totalCny?: string
}

/* prettier-ignore-end */
