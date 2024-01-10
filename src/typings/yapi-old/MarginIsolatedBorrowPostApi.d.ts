/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [杠杆-逐仓借款↗](https://yapi.coin-online.cc/project/72/interface/api/1898) 的 **请求类型**
 *
 * @分类 [逐仓杠杆交易↗](https://yapi.coin-online.cc/project/72/interface/api/cat_461)
 * @标签 `逐仓杠杆交易`
 * @请求头 `POST /margin/isolated/borrow`
 * @更新时间 `2022-08-29 13:58:22`
 */
export interface YapiPostMarginIsolatedBorrowApiRequest {
  /**
   * 借款数量
   */
  borrowAmount?: string
  borrowType?: 'MANUAL' | 'AUTOMATIC'
  /**
   * 币种id
   */
  coinId?: number
  /**
   * 逐仓交易对id
   */
  tradeId?: number
  userId?: number
}

/**
 * 接口 [杠杆-逐仓借款↗](https://yapi.coin-online.cc/project/72/interface/api/1898) 的 **返回类型**
 *
 * @分类 [逐仓杠杆交易↗](https://yapi.coin-online.cc/project/72/interface/api/cat_461)
 * @标签 `逐仓杠杆交易`
 * @请求头 `POST /margin/isolated/borrow`
 * @更新时间 `2022-08-29 13:58:22`
 */
export interface YapiPostMarginIsolatedBorrowApiResponse {
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
