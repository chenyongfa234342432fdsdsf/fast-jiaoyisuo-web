/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [法币账户-划转历史记录↗](https://yapi.coin-online.cc/project/72/interface/api/2417) 的 **请求类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `POST /otc/transfer/log`
 * @更新时间 `2022-08-29 15:32:11`
 */
export interface YapiPostOtcTransferLogApiRequest {
  /**
   * 币种id
   */
  coinId?: number
  /**
   * 是否返回总记录数，默认true
   */
  count?: boolean
  /**
   * 页码
   */
  pageNum?: number
  /**
   * 每页显示条数
   */
  pageSize?: number
  /**
   * 状态,0或不传,查全部，1审核中,2已完成,3审核失败
   */
  status?: number
  /**
   * 时间范围(1：一周内，2：一月内，3：一年内)
   */
  timeRange?: number
  /**
   * 类型(1-币币到otc 2-otc到币币)
   */
  type?: number
}

/**
 * 接口 [法币账户-划转历史记录↗](https://yapi.coin-online.cc/project/72/interface/api/2417) 的 **返回类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `POST /otc/transfer/log`
 * @更新时间 `2022-08-29 15:32:11`
 */
export interface YapiPostOtcTransferLogApiResponse {
  code?: number
  data?: YapiDtoTransferLogVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoTransferLogVO {
  /**
   * 数量
   */
  amount?: number
  /**
   * 币种id
   */
  coinId?: number
  /**
   * 币种logo
   */
  coinLogo?: string
  /**
   * 小数位精度
   */
  precision?: number
  /**
   * 状态
   */
  status?: number
  /**
   * 状态描述
   */
  statusDesc?: string
  /**
   * 币种
   */
  symbol?: string
  /**
   * 时间
   */
  time?: number
  /**
   * 类型
   */
  type?: number
  /**
   * 类型描述
   */
  typeDesc?: string
}

/* prettier-ignore-end */
