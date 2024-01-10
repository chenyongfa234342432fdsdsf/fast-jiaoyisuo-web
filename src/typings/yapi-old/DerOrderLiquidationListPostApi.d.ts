/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [质押借币用户平仓列表↗](https://yapi.coin-online.cc/project/72/interface/api/1574) 的 **请求类型**
 *
 * @分类 [hotcoin-der-service-controller↗](https://yapi.coin-online.cc/project/72/interface/api/cat_398)
 * @标签 `hotcoin-der-service-controller`
 * @请求头 `POST /der/order/liquidation/list`
 * @更新时间 `2022-08-29 13:58:10`
 */
export interface YapiPostDerOrderLiquidationListApiRequest {
  /**
   * 平仓状态：1-平仓中-押金退回中；2-已完成-押金已退回
   */
  closeOutStatus?: number
  /**
   * 调整时间-end
   */
  endTime?: number
  /**
   * 还款币种
   */
  loanSymbol?: string
  /**
   * 还款币种Id
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
   * 调整时间-start
   */
  startTime?: number
}

/**
 * 接口 [质押借币用户平仓列表↗](https://yapi.coin-online.cc/project/72/interface/api/1574) 的 **返回类型**
 *
 * @分类 [hotcoin-der-service-controller↗](https://yapi.coin-online.cc/project/72/interface/api/cat_398)
 * @标签 `hotcoin-der-service-controller`
 * @请求头 `POST /der/order/liquidation/list`
 * @更新时间 `2022-08-29 13:58:10`
 */
export interface YapiPostDerOrderLiquidationListApiResponse {
  code?: number
  data?: YapiDtoDerLiquidationListResp[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
/**
 * 质押借币-品仓详情
 */
export interface YapiDtoDerLiquidationListResp {
  /**
   * 平仓状态：1-平仓中-押金退回中；2-已完成-押金已退回
   */
  closeOutStatus?: number
  /**
   * 平仓时间
   */
  createdTime?: number
  /**
   * 利息
   */
  interest?: string
  /**
   * 平仓手续费
   */
  liquidationFee?: string
  /**
   * 借款金额
   */
  loanAmount?: string
  /**
   * 借款币种
   */
  loanSymbol?: string
  /**
   * 借出币Id
   */
  loanSymbolId?: number
  /**
   * 订单编号
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
   * 剩余质押金
   */
  remainingPledgeAmount?: string
  /**
   * 总负债
   */
  totalLiability?: string
  /**
   * 总质押金
   */
  totalPledgeAmount?: string
  /**
   * 使用质押金
   */
  usePledgeAmount?: string
  /**
   * 用户ID
   */
  userId?: number
}

/* prettier-ignore-end */
