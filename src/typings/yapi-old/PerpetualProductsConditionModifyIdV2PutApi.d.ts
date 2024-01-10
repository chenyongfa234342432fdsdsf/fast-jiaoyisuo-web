/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [修改条件单的订单类型，触发价，委托价↗](https://yapi.coin-online.cc/project/72/interface/api/2444) 的 **请求类型**
 *
 * @分类 [newex-dax-perpetual-rest↗](https://yapi.coin-online.cc/project/72/interface/api/cat_473)
 * @请求头 `PUT /v2/perpetual/products/condition/modify/{id}`
 * @更新时间 `2022-08-29 16:11:56`
 */
export interface YapiPutV2PerpetualProductsConditionModifyIdApiRequest {
  /**
   * 订单ID
   */
  orderId: number
  /**
   * 触发价
   */
  triggerPrice: number
  /**
   * 委托价
   */
  price: number
  /**
   * 委托张数
   */
  amount: number
  /**
   * 单位
   */
  tradeUnit: string
  /**
   * 单位数量
   */
  tradeAmountUnit: number
  /**
   * 10 限价  11 市价
   */
  systemType: number
  /**
   * 数据id
   */
  id: string
}

/**
 * 接口 [修改条件单的订单类型，触发价，委托价↗](https://yapi.coin-online.cc/project/72/interface/api/2444) 的 **返回类型**
 *
 * @分类 [newex-dax-perpetual-rest↗](https://yapi.coin-online.cc/project/72/interface/api/cat_473)
 * @请求头 `PUT /v2/perpetual/products/condition/modify/{id}`
 * @更新时间 `2022-08-29 16:11:56`
 */
export interface YapiPutV2PerpetualProductsConditionModifyIdApiResponse {
  code?: number
  data?: {}
  msg?: string
}

/* prettier-ignore-end */
