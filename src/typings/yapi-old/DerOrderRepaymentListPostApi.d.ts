/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [质押借币用户还款列表↗](https://yapi.coin-online.cc/project/72/interface/api/1601) 的 **请求类型**
 *
 * @分类 [hotcoin-der-service-controller↗](https://yapi.coin-online.cc/project/72/interface/api/cat_398)
 * @标签 `hotcoin-der-service-controller`
 * @请求头 `POST /der/order/repayment/list`
 * @更新时间 `2022-08-29 13:58:11`
 */
export interface YapiPostDerOrderRepaymentListApiRequest {
  /**
   * 还款时间-end
   */
  endTime?: number
  /**
   * 借款币种
   */
  loanSymbol?: string
  /**
   * 借款币种Id
   */
  loanSymbolId?: number
  /**
   * 订单ID
   */
  orderNo?: number
  /**
   * 第几页
   */
  pageNum?: number
  /**
   * 页面大小
   */
  pageSize?: number
  /**
   * 质押币种
   */
  pledgeSymbol?: string
  /**
   * 质押币种Id
   */
  pledgeSymbolId?: number
  /**
   * 还款状态: 成功 1，失败 -1
   */
  repaymentStatus?: number
  /**
   * 还款时间-start
   */
  startTime?: number
}

/**
 * 接口 [质押借币用户还款列表↗](https://yapi.coin-online.cc/project/72/interface/api/1601) 的 **返回类型**
 *
 * @分类 [hotcoin-der-service-controller↗](https://yapi.coin-online.cc/project/72/interface/api/cat_398)
 * @标签 `hotcoin-der-service-controller`
 * @请求头 `POST /der/order/repayment/list`
 * @更新时间 `2022-08-29 13:58:11`
 */
export interface YapiPostDerOrderRepaymentListApiResponse {
  code?: number
  data?: YapiDtoDerRepaymentListResp[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
/**
 * 质押借币-还款记录结果
 */
export interface YapiDtoDerRepaymentListResp {
  /**
   * 利息还款
   */
  interestRepaymentAmount?: string
  /**
   * 还款币种
   */
  loanSymbol?: string
  /**
   * 借出币Id
   */
  loanSymbolId?: number
  /**
   * 借款时间
   */
  loanTime?: number
  /**
   * 订单ID
   */
  orderNo?: string
  /**
   * 质押币种
   */
  pledgeSymbol?: string
  /**
   * 质押币Id
   */
  pledgeSymbolId?: number
  /**
   * 本金还款
   */
  principalRepaymentAmount?: string
  /**
   * 释放质押金数量
   */
  releasePledgeAmount?: string
  /**
   * 还款金额
   */
  repaymentAmount?: string
  /**
   * 还款时间
   */
  repaymentDate?: number
  /**
   * 还款状态: 成功 1，失败 -1
   */
  repaymentStatus?: number
  /**
   * 返款类型 1 完全还款  2 部分还款
   */
  repaymentType?: number
  /**
   * 用户ID
   */
  userId?: number
}

/* prettier-ignore-end */
