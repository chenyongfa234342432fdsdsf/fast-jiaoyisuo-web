/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [查询杠杆全仓资产最大可借↗](https://yapi.coin-online.cc/project/72/interface/api/1871) 的 **请求类型**
 *
 * @分类 [全仓杠杆模块接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_422)
 * @标签 `全仓杠杆模块接口`
 * @请求头 `GET /margin/cross/maxBorrowable`
 * @更新时间 `2022-08-29 13:58:21`
 */
export interface YapiGetMarginCrossMaxBorrowableApiRequest {
  /**
   * coinId
   */
  coinId: string
}

/**
 * 接口 [查询杠杆全仓资产最大可借↗](https://yapi.coin-online.cc/project/72/interface/api/1871) 的 **返回类型**
 *
 * @分类 [全仓杠杆模块接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_422)
 * @标签 `全仓杠杆模块接口`
 * @请求头 `GET /margin/cross/maxBorrowable`
 * @更新时间 `2022-08-29 13:58:21`
 */
export interface YapiGetMarginCrossMaxBorrowableApiResponse {
  code?: number
  data?: string
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}

/* prettier-ignore-end */
