/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [全仓利息记录↗](https://yapi.coin-online.cc/project/72/interface/api/1862) 的 **请求类型**
 *
 * @分类 [全仓杠杆模块接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_422)
 * @标签 `全仓杠杆模块接口`
 * @请求头 `GET /margin/cross/interestRecord`
 * @更新时间 `2022-08-29 13:58:21`
 */
export interface YapiGetMarginCrossInterestRecordApiRequest {
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
 * 接口 [全仓利息记录↗](https://yapi.coin-online.cc/project/72/interface/api/1862) 的 **返回类型**
 *
 * @分类 [全仓杠杆模块接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_422)
 * @标签 `全仓杠杆模块接口`
 * @请求头 `GET /margin/cross/interestRecord`
 * @更新时间 `2022-08-29 13:58:21`
 */
export interface YapiGetMarginCrossInterestRecordApiResponse {
  code?: number
  data?: YapiDtoMagInterestRecordVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
/**
 * 杠杆利息记录
 */
export interface YapiDtoMagInterestRecordVO {
  /**
   * 币种id
   */
  coinId?: number
  /**
   * 币种Name
   */
  coinName?: string
  /**
   * 时间
   */
  createdTime?: string
  /**
   * 日利率
   */
  dailyInterestRate?: string
  /**
   * id
   */
  id?: number
  /**
   * 利息
   */
  interest?: string
  /**
   * 利息类型，1借款利息，2定时计息
   */
  interestType?: number
  /**
   * 本金
   */
  principal?: string
  /**
   * 交易对id
   */
  tradeId?: number
}

/* prettier-ignore-end */
