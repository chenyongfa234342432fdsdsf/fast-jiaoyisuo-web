/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [全仓还款--前置查询↗](https://yapi.coin-online.cc/project/72/interface/api/1889) 的 **请求类型**
 *
 * @分类 [全仓杠杆模块接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_422)
 * @标签 `全仓杠杆模块接口`
 * @请求头 `GET /margin/cross/userRepayInfo`
 * @更新时间 `2022-08-29 13:58:21`
 */
export interface YapiGetMarginCrossUserRepayInfoApiRequest {
  /**
   * coinId
   */
  coinId?: string
}

/**
 * 接口 [全仓还款--前置查询↗](https://yapi.coin-online.cc/project/72/interface/api/1889) 的 **返回类型**
 *
 * @分类 [全仓杠杆模块接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_422)
 * @标签 `全仓杠杆模块接口`
 * @请求头 `GET /margin/cross/userRepayInfo`
 * @更新时间 `2022-08-29 13:58:21`
 */
export interface YapiGetMarginCrossUserRepayInfoApiResponse {
  code?: number
  data?: YapiDtoMagUserRepayVO
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
/**
 * 用户还款信息
 */
export interface YapiDtoMagUserRepayVO {
  /**
   * 可用余额
   */
  available?: string
  /**
   * 已借
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
   * 利息
   */
  interest?: string
  /**
   * 最大可还数量
   */
  maxReturnable?: string
  /**
   * 币种精度
   */
  precision?: number
  /**
   * 总负债
   */
  totalDebt?: string
  /**
   * 币对id
   */
  tradeId?: number
  /**
   * 用户id
   */
  userId?: number
}

/* prettier-ignore-end */
