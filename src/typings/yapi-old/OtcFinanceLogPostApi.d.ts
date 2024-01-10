/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [法币账户-财务日志↗](https://yapi.coin-online.cc/project/72/interface/api/2363) 的 **请求类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `POST /otc/finance/log`
 * @更新时间 `2022-08-29 15:32:09`
 */
export interface YapiPostOtcFinanceLogApiRequest {
  /**
   * 币种,0或空查全部
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
   * 时间范围(1：一周内，2：一月内，3：一年内)
   */
  timeRange?: number
  /**
   * 类型 0或者空查全部 1转入  ，2转出，3买入，4卖出，5冻结，6解冻，7扣除
   */
  type?: number
}

/**
 * 接口 [法币账户-财务日志↗](https://yapi.coin-online.cc/project/72/interface/api/2363) 的 **返回类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `POST /otc/finance/log`
 * @更新时间 `2022-08-29 15:32:09`
 */
export interface YapiPostOtcFinanceLogApiResponse {
  code?: number
  data?: YapiDtoFinanceLogVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoFinanceLogVO {
  /**
   * 数量
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
   * logo
   */
  logo?: string
  /**
   * 小数位精度
   */
  precision?: number
  /**
   * 余额
   */
  remainingBalance?: string
  /**
   * 币种简称
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
   * 币种
   */
  typeDesc?: string
}

/* prettier-ignore-end */
