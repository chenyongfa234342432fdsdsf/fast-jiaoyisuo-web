/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [全仓借款--前置查询↗](https://yapi.coin-online.cc/project/72/interface/api/1886) 的 **请求类型**
 *
 * @分类 [全仓杠杆模块接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_422)
 * @标签 `全仓杠杆模块接口`
 * @请求头 `GET /margin/cross/userBorrowInfo`
 * @更新时间 `2022-08-29 13:58:21`
 */
export interface YapiGetMarginCrossUserBorrowInfoApiRequest {
  /**
   * coinId
   */
  coinId?: string
}

/**
 * 接口 [全仓借款--前置查询↗](https://yapi.coin-online.cc/project/72/interface/api/1886) 的 **返回类型**
 *
 * @分类 [全仓杠杆模块接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_422)
 * @标签 `全仓杠杆模块接口`
 * @请求头 `GET /margin/cross/userBorrowInfo`
 * @更新时间 `2022-08-29 13:58:21`
 */
export interface YapiGetMarginCrossUserBorrowInfoApiResponse {
  code?: number
  data?: YapiDtoMagUserBorrowVO
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
/**
 * 用户借款信息
 */
export interface YapiDtoMagUserBorrowVO {
  /**
   * 可用余额
   */
  available?: string
  /**
   * 当前已借
   */
  borrowed?: string
  /**
   * 币种id
   */
  coinId?: number
  /**
   * 币种名称
   */
  coinName?: string
  /**
   * 小时利率
   */
  hourInterestRate?: string
  /**
   * 逐仓档位，仅逐仓时有效
   */
  ladder?: number
  /**
   * 最大可借数量
   */
  maxBorrowable?: string
  /**
   * 币种精度
   */
  precision?: number
  /**
   * 币对名称
   */
  symbol?: string
  /**
   * 币对id
   */
  tradeId?: number
}

/* prettier-ignore-end */
