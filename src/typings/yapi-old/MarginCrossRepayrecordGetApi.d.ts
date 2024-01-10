/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [全仓还款记录↗](https://yapi.coin-online.cc/project/72/interface/api/1880) 的 **请求类型**
 *
 * @分类 [全仓杠杆模块接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_422)
 * @标签 `全仓杠杆模块接口`
 * @请求头 `GET /margin/cross/repayRecord`
 * @更新时间 `2022-08-29 13:58:21`
 */
export interface YapiGetMarginCrossRepayRecordApiRequest {
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
 * 接口 [全仓还款记录↗](https://yapi.coin-online.cc/project/72/interface/api/1880) 的 **返回类型**
 *
 * @分类 [全仓杠杆模块接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_422)
 * @标签 `全仓杠杆模块接口`
 * @请求头 `GET /margin/cross/repayRecord`
 * @更新时间 `2022-08-29 13:58:21`
 */
export interface YapiGetMarginCrossRepayRecordApiResponse {
  code?: number
  data?: YapiDtoMagRepayRecordVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
/**
 * 杠杆还款记录
 */
export interface YapiDtoMagRepayRecordVO {
  /**
   * 总额
   */
  amount?: string
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
   * 还款id
   */
  id?: number
  /**
   * 利息
   */
  interest?: string
  /**
   * 本金
   */
  principal?: string
  /**
   * 还款类型，0手动还款，1自动还款，2强平还款
   */
  repayType?: number
  /**
   * 交易对名称
   */
  symbol?: number
  /**
   * 交易对id
   */
  tradeId?: number
  /**
   * 交易流水号
   */
  transNo?: number
}

/* prettier-ignore-end */
