/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [全仓借款↗](https://yapi.coin-online.cc/project/72/interface/api/1847) 的 **请求类型**
 *
 * @分类 [全仓杠杆模块接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_422)
 * @标签 `全仓杠杆模块接口`
 * @请求头 `POST /margin/cross/borrow`
 * @更新时间 `2022-08-29 13:58:20`
 */
export interface YapiPostMarginCrossBorrowApiRequest {
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
   * 还款数量
   */
  repayAmount?: string
  repayType?: 'MANUAL' | 'AUTOMATIC' | 'LIQUIDATION'
  userId?: number
}

/**
 * 接口 [全仓借款↗](https://yapi.coin-online.cc/project/72/interface/api/1847) 的 **返回类型**
 *
 * @分类 [全仓杠杆模块接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_422)
 * @标签 `全仓杠杆模块接口`
 * @请求头 `POST /margin/cross/borrow`
 * @更新时间 `2022-08-29 13:58:20`
 */
export interface YapiPostMarginCrossBorrowApiResponse {
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
