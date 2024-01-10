/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [杠杆-逐仓还款↗](https://yapi.coin-online.cc/project/72/interface/api/1928) 的 **请求类型**
 *
 * @分类 [逐仓杠杆交易↗](https://yapi.coin-online.cc/project/72/interface/api/cat_461)
 * @标签 `逐仓杠杆交易`
 * @请求头 `POST /margin/isolated/repay`
 * @更新时间 `2022-08-29 13:58:23`
 */
export interface YapiPostMarginIsolatedRepayApiRequest {
  /**
   * 币种id
   */
  coinId?: number
  /**
   * 还款数量
   */
  repayAmount?: string
  /**
   * 逐仓币对id
   */
  tradeId?: number
  userId?: number
}

/**
 * 接口 [杠杆-逐仓还款↗](https://yapi.coin-online.cc/project/72/interface/api/1928) 的 **返回类型**
 *
 * @分类 [逐仓杠杆交易↗](https://yapi.coin-online.cc/project/72/interface/api/cat_461)
 * @标签 `逐仓杠杆交易`
 * @请求头 `POST /margin/isolated/repay`
 * @更新时间 `2022-08-29 13:58:23`
 */
export interface YapiPostMarginIsolatedRepayApiResponse {
  code?: number
  data?: number
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}

/* prettier-ignore-end */
