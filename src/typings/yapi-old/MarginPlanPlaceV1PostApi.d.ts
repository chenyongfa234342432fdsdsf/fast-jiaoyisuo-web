/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [杠杆计划委托下单↗](https://yapi.coin-online.cc/project/72/interface/api/2129) 的 **请求类型**
 *
 * @分类 [杠杆交易行情模块↗](https://yapi.coin-online.cc/project/72/interface/api/cat_449)
 * @标签 `杠杆交易行情模块`
 * @请求头 `POST /v1/margin/plan/place`
 * @更新时间 `2022-09-02 13:59:17`
 */
export interface YapiPostV1MarginPlanPlaceApiRequest {
  /**
   * 加密后的业务数据
   */
  bizData?: string
  bizDataView: YapiDtoundefined
  /**
   * 随机向量
   */
  randomIv?: string
  /**
   * 随机密钥
   */
  randomKey?: string
  /**
   * 签名串
   */
  signature?: string
  targetObj?: {}
  /**
   * 时间戳
   */
  timestamp?: number
}
/**
 * bizData的请求参数格式（仅展示）
 */
export interface YapiDtoundefined {
  id: number
  /**
   * 交易额/交易量 计划委托限价(买入单位-标的币 卖出单位-标的币) 计划委托市价(买入单位-计价币 卖出单位-标的币)
   */
  tradeAmount: number
  /**
   * 币对id
   */
  tradeId: number
  /**
   * 计划委托触发价格
   */
  triggerPrice: number
  /**
   * 0-买入 1-卖出
   */
  direction: number
  /**
   * 计划委托价格类型（BBO-对手价 optimal5-最优5档 optimal10-最优10档 optimal20-最优20档）
   */
  priceType?: string
  /**
   * 市价计量单位：amount-数量，funds-金额
   */
  marketUnit?: string
  /**
   * 计划委托价格
   */
  tradePrice?: number
  /**
   * 杠杆模式：nonmag非杠杆，cross全仓杠杆，isolated逐仓杠杆
   */
  marginMode?: string
  /**
   * 杠杆订单交易模式：normal普通模式，borrow自动借款，repay自动还款
   */
  marginTradeMode?: string
  /**
   * 杠杆金额，借款金额或还款金额
   */
  marginAmount?: number
}

/**
 * 接口 [杠杆计划委托下单↗](https://yapi.coin-online.cc/project/72/interface/api/2129) 的 **返回类型**
 *
 * @分类 [杠杆交易行情模块↗](https://yapi.coin-online.cc/project/72/interface/api/cat_449)
 * @标签 `杠杆交易行情模块`
 * @请求头 `POST /v1/margin/plan/place`
 * @更新时间 `2022-09-02 13:59:17`
 */
export interface YapiPostV1MarginPlanPlaceApiResponse {
  code?: number
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}

/* prettier-ignore-end */
