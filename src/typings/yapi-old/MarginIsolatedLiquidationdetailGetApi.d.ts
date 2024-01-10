/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [逐仓-强平订单↗](https://yapi.coin-online.cc/project/72/interface/api/1913) 的 **请求类型**
 *
 * @分类 [逐仓杠杆交易↗](https://yapi.coin-online.cc/project/72/interface/api/cat_461)
 * @标签 `逐仓杠杆交易`
 * @请求头 `GET /margin/isolated/liquidationDetail`
 * @更新时间 `2022-08-29 13:58:22`
 */
export interface YapiGetMarginIsolatedLiquidationDetailApiRequest {
  /**
   * txId
   */
  txId?: string
}

/**
 * 接口 [逐仓-强平订单↗](https://yapi.coin-online.cc/project/72/interface/api/1913) 的 **返回类型**
 *
 * @分类 [逐仓杠杆交易↗](https://yapi.coin-online.cc/project/72/interface/api/cat_461)
 * @标签 `逐仓杠杆交易`
 * @请求头 `GET /margin/isolated/liquidationDetail`
 * @更新时间 `2022-08-29 13:58:22`
 */
export interface YapiGetMarginIsolatedLiquidationDetailApiResponse {
  code?: number
  data?: YapiDtoEntrustVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoEntrustVO {
  /**
   * 委托下单总额
   */
  amount?: string
  /**
   * 成交均价
   */
  averagePrice?: string
  /**
   * 计价币
   */
  buyCoinShortName?: string
  /**
   * 计划委托撤销时间
   */
  cancelTime?: number
  /**
   * 委托数量
   */
  count?: string
  /**
   * 成交价格
   */
  dealPrice?: string
  /**
   * 方向(0-买入 1-卖出)
   */
  direction?: number
  /**
   * 委单id
   */
  entrustId?: number
  /**
   * 成交明细
   */
  entrustLogs?: YapiDtoEntrustLogVO[]
  /**
   * 委托价格
   */
  entrustPrice?: string
  /**
   * 委托时间
   */
  entrustTime?: number
  /**
   * 是否强平 0否 1是
   */
  forcedLiquidation?: boolean
  /**
   * 下单金额
   */
  funds?: string
  /**
   * true表示历史委单，默认为false
   */
  history?: boolean
  /**
   * 委单ID
   */
  id?: number
  /**
   * 剩余下单金额
   */
  leftfunds?: string
  /**
   * 杠杆模式 nonmag非杠杆，cross全仓杠杆，isolated逐仓杠杆
   */
  marginMode?: string
  /**
   * 杠杆订单交易模式 normal普通模式，borrow自动借款，repay自动还款
   */
  marginTradeMode?: string
  /**
   * 市价计量单位:amount - 数量，funds - 金额
   */
  marketUnit?: string
  /**
   * 委托类型（0-限价委托、1-市价委托、4-计划委托）
   */
  matchType?: number
  /**
   * 计划委托价格类型（BBO-对手价 optimal5-最优5档 optimal10-最优10档 optimal20-最优20档）
   */
  priceType?: string
  /**
   * 推送版本号，默认为1
   */
  pushVersion?: number
  /**
   * 备注，比如计划委托失败原因
   */
  remark?: string
  /**
   * true表示已撤单需移除，默认为false
   */
  remove?: boolean
  /**
   * 标的币
   */
  sellCoinShortName?: string
  /**
   * 状态（1-未成交 2部分成交 3-完全成交 4-撤单处理中 5-已撤销 6-未触发 7-已触发 8-部分成交已撤单）
   */
  status?: number
  /**
   * 成交数量
   */
  successCount?: string
  /**
   * 交易id
   */
  tradeId?: number
  /**
   * 交易对状态，true可用 false禁用
   */
  tradeStatus?: boolean
  /**
   * 触发价格
   */
  triggerPrice?: string
  /**
   * 1-大于等于 2-小于等于
   */
  triggerSign?: number
  /**
   * 触发时间
   */
  triggerTime?: number
  /**
   * 类型(1-现货)
   */
  type?: number
  /**
   * 用户UID
   */
  uid?: number
}
export interface YapiDtoEntrustLogVO {
  /**
   * 交易额
   */
  amount?: string
  /**
   * 数量
   */
  count?: string
  /**
   * 创建时间
   */
  createTime?: number
  /**
   * 委单ID
   */
  entrustId?: number
  /**
   * 委单类型
   */
  entrustType?: number
  /**
   * 手续费
   */
  fee?: string
  /**
   * id
   */
  id?: number
  /**
   * 更新时间
   */
  lastupdattime?: number
  /**
   * 成交ID
   */
  matchId?: number
  /**
   * 价格
   */
  prize?: string
  /**
   *  备注
   */
  remark?: string
  /**
   * 来源
   */
  source?: number
  /**
   * 交易ID
   */
  tradeId?: number
  /**
   * 用户ID
   */
  uid?: number
}

/* prettier-ignore-end */
