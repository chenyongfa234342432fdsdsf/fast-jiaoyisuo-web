/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [逐仓-借款记录↗](https://yapi.coin-online.cc/project/72/interface/api/1901) 的 **请求类型**
 *
 * @分类 [逐仓杠杆交易↗](https://yapi.coin-online.cc/project/72/interface/api/cat_461)
 * @标签 `逐仓杠杆交易`
 * @请求头 `GET /margin/isolated/borrowRecord`
 * @更新时间 `2022-08-29 13:58:22`
 */
export interface YapiGetMarginIsolatedBorrowRecordApiRequest {
  /**
   * 页码
   */
  pageNum?: string
  /**
   * 每页显示条数
   */
  pageSize?: string
  /**
   * 是否返回总记录数，默认true
   */
  count?: string
  marginMode?: string
  userId?: string
  /**
   * 交易对id
   */
  tradeId?: string
  /**
   * 币种id
   */
  coinId?: string
  /**
   * 开始时间
   */
  startDate?: string
  /**
   * 结束时间
   */
  endDate?: string
  startDateTime?: string
  endDateTime?: string
}

/**
 * 接口 [逐仓-借款记录↗](https://yapi.coin-online.cc/project/72/interface/api/1901) 的 **返回类型**
 *
 * @分类 [逐仓杠杆交易↗](https://yapi.coin-online.cc/project/72/interface/api/cat_461)
 * @标签 `逐仓杠杆交易`
 * @请求头 `GET /margin/isolated/borrowRecord`
 * @更新时间 `2022-08-29 13:58:22`
 */
export interface YapiGetMarginIsolatedBorrowRecordApiResponse {
  code?: number
  data?: YapiDtoMagBorrowRecordVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
/**
 * 杠杆借款记录
 */
export interface YapiDtoMagBorrowRecordVO {
  /**
   * 数量
   */
  amount?: string
  /**
   * 借款类型，0手动借款，1自动借款
   */
  borrowType?: number
  /**
   * 币种id
   */
  coinId?: number
  /**
   * 币种名称
   */
  coinName?: string
  /**
   * 时间
   */
  createdTime?: string
  /**
   * 借款id
   */
  id?: number
  /**
   * 逐仓交易对id，当全仓时为0
   */
  tradeId?: number
}

/* prettier-ignore-end */
