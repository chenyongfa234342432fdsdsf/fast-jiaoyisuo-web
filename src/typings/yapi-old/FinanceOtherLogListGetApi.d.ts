/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [分页查询其他记录↗](https://yapi.coin-online.cc/project/72/interface/api/1670) 的 **请求类型**
 *
 * @分类 [充提币相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_419)
 * @标签 `充提币相关接口`
 * @请求头 `GET /finance/other/log/list`
 * @更新时间 `2022-08-29 13:58:13`
 */
export interface YapiGetFinanceOtherLogListApiRequest {
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
  /**
   * 查询条件 币种id
   */
  coinId?: string
  /**
   * 查询条件 时间范围(1：一周内，2：一月内，3：三月内)
   */
  timeRange?: string
}

/**
 * 接口 [分页查询其他记录↗](https://yapi.coin-online.cc/project/72/interface/api/1670) 的 **返回类型**
 *
 * @分类 [充提币相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_419)
 * @标签 `充提币相关接口`
 * @请求头 `GET /finance/other/log/list`
 * @更新时间 `2022-08-29 13:58:13`
 */
export interface YapiGetFinanceOtherLogListApiResponse {
  code?: number
  data?: YapiDtoOtherLogVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoOtherLogVO {
  /**
   * 币种
   */
  coinShortName?: string
  /**
   * 数量
   */
  quantity?: string
  /**
   * 时间
   */
  time?: string
  /**
   * 类型(9-创新区解冻、10-创新区分红、12-创新区分红奖励、21-空投糖果、23-发红包、24-收红包、25-退还红包、26-扣除红包、60-手工充值)
   */
  type?: number
}

/* prettier-ignore-end */
