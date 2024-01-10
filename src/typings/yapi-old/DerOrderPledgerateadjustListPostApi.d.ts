/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [质押借币质押率调整记录列表↗](https://yapi.coin-online.cc/project/72/interface/api/1589) 的 **请求类型**
 *
 * @分类 [hotcoin-der-service-controller↗](https://yapi.coin-online.cc/project/72/interface/api/cat_398)
 * @标签 `hotcoin-der-service-controller`
 * @请求头 `POST /der/order/pledgeRateAdjust/list`
 * @更新时间 `2022-08-29 13:58:10`
 */
export interface YapiPostDerOrderPledgeRateAdjustListApiRequest {
  /**
   * 调整方向:转入调低 1, 转出调高 2
   */
  adjustDirection?: number
  /**
   * 调整时间-end
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
  orderId?: number
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
   * 调整时间-start
   */
  startTime?: number
}

/**
 * 接口 [质押借币质押率调整记录列表↗](https://yapi.coin-online.cc/project/72/interface/api/1589) 的 **返回类型**
 *
 * @分类 [hotcoin-der-service-controller↗](https://yapi.coin-online.cc/project/72/interface/api/cat_398)
 * @标签 `hotcoin-der-service-controller`
 * @请求头 `POST /der/order/pledgeRateAdjust/list`
 * @更新时间 `2022-08-29 13:58:10`
 */
export interface YapiPostDerOrderPledgeRateAdjustListApiResponse {
  code?: number
  data?: YapiDtoDerPledgeRateAdjustListResp[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
/**
 * 质押率调整记录列表请求响应
 */
export interface YapiDtoDerPledgeRateAdjustListResp {
  /**
   * 调整数量
   */
  adjustAmount?: string
  /**
   * 调整方向:转入调低 1, 转出调高 2
   */
  adjustDirection?: number
  /**
   * 调整时间
   */
  adjustTime?: number
  /**
   * 调整后质押率
   */
  afterPledgeRate?: string
  /**
   * 调整期质押率
   */
  beforePledgeRate?: string
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
  orderNo?: string
  /**
   * 质押币种
   */
  pledgeSymbol?: string
  /**
   * 质押币种Id
   */
  pledgeSymbolId?: number
  /**
   * 用户ID
   */
  userId?: number
}

/* prettier-ignore-end */
