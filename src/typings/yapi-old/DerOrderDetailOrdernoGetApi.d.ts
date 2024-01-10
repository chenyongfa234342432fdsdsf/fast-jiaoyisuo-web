/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [质押借币用户订单详情↗](https://yapi.coin-online.cc/project/72/interface/api/1571) 的 **请求类型**
 *
 * @分类 [hotcoin-der-service-controller↗](https://yapi.coin-online.cc/project/72/interface/api/cat_398)
 * @标签 `hotcoin-der-service-controller`
 * @请求头 `GET /der/order/detail/{orderNo}`
 * @更新时间 `2022-08-29 13:58:09`
 */
export interface YapiGetDerOrderDetailOrderNoApiRequest {
  /**
   * orderNo
   */
  orderNo: string
}

/**
 * 接口 [质押借币用户订单详情↗](https://yapi.coin-online.cc/project/72/interface/api/1571) 的 **返回类型**
 *
 * @分类 [hotcoin-der-service-controller↗](https://yapi.coin-online.cc/project/72/interface/api/cat_398)
 * @标签 `hotcoin-der-service-controller`
 * @请求头 `GET /der/order/detail/{orderNo}`
 * @更新时间 `2022-08-29 13:58:09`
 */
export interface YapiGetDerOrderDetailOrderNoApiResponse {
  code?: number
  data?: YapiDtoDerOrderListResp
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
/**
 * 质押借币订单详情
 */
export interface YapiDtoDerOrderListResp {
  /**
   * 累计计息周期（单位/小时）
   */
  calcInterestPeriod?: string
  /**
   * 补仓质押率
   */
  callMarginRate?: string
  /**
   * 平仓质押率
   */
  closeOutRate?: string
  /**
   * 借款时间
   */
  createTime?: number
  /**
   * 距离强平价
   */
  distanceLiquidation?: string
  /**
   * 到期时间
   */
  expireTime?: number
  /**
   * 初始质押率
   */
  initPledgeRate?: string
  /**
   * 利率
   */
  lastLoanRate?: string
  /**
   * 强平价
   */
  liquidationPrice?: string
  /**
   * 剩余本金
   */
  loanAmount?: string
  /**
   * 借出币币种Id
   */
  loanCoinId?: number
  /**
   * 借出币
   */
  loanCoinName?: string
  /**
   * 借币周期
   */
  loanPeriod?: number
  /**
   * 借出币Id
   */
  loanSymbolId?: number
  /**
   * 订单编号
   */
  orderNo?: string
  /**
   * 订单状态: 放款中0,计息中1,已逾期2,已还款3,已平仓4,失败-1
   */
  orderStatus?: number
  /**
   * 订单类型: 正常1, 续借 2
   */
  orderType?: number
  /**
   * 质押金额
   */
  pledgeAmount?: string
  /**
   * 质押币币种Id
   */
  pledgeCoinId?: number
  /**
   * 质押币
   */
  pledgeCoinName?: string
  /**
   * 当前质押率
   */
  pledgeRate?: string
  /**
   * 质押币Id
   */
  pledgeSymbolId?: number
  /**
   * 剩余利息
   */
  remainInterest?: string
  /**
   * 服务器时间
   */
  serverTime?: number
  /**
   * 总负债
   */
  totalLiability?: string
  /**
   * 用户ID
   */
  userId?: number
}

/* prettier-ignore-end */
