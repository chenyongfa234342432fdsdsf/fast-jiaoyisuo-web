/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [逐仓借款--前置查询↗](https://yapi.coin-online.cc/project/72/interface/api/1940) 的 **请求类型**
 *
 * @分类 [逐仓杠杆交易↗](https://yapi.coin-online.cc/project/72/interface/api/cat_461)
 * @标签 `逐仓杠杆交易`
 * @请求头 `GET /margin/isolated/userBorrowInfo`
 * @更新时间 `2022-08-29 13:58:23`
 */
export interface YapiGetMarginIsolatedUserBorrowInfoApiRequest {
  /**
   * tradeId
   */
  tradeId: string
  /**
   * coinId
   */
  coinId: string
}

/**
 * 接口 [逐仓借款--前置查询↗](https://yapi.coin-online.cc/project/72/interface/api/1940) 的 **返回类型**
 *
 * @分类 [逐仓杠杆交易↗](https://yapi.coin-online.cc/project/72/interface/api/cat_461)
 * @标签 `逐仓杠杆交易`
 * @请求头 `GET /margin/isolated/userBorrowInfo`
 * @更新时间 `2022-08-29 13:58:23`
 */
export interface YapiGetMarginIsolatedUserBorrowInfoApiResponse {
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
