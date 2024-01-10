/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [根据条件-批量撤单↗](https://yapi.coin-online.cc/project/72/interface/api/2498) 的 **请求类型**
 *
 * @分类 [newex-dax-perpetual-rest↗](https://yapi.coin-online.cc/project/72/interface/api/cat_473)
 * @请求头 `DELETE /v2/perpetual/products/batch-order`
 * @更新时间 `2022-08-29 16:50:32`
 */
export interface YapiDeleteV2PerpetualProductsBatchOrderApiRequest {
  /**
   * 合约code
   */
  contractCode: string
  /**
   * 指数基础货币
   */
  indexBase: string
  /**
   * 计价币
   */
  quote: string
  /**
   * 订单方向
   */
  detailSide: string
  /**
   * 类型 10 限价 11 市价
   */
  systemType: string
  /**
   * 计划类型 0 止盈  1 止损  2 计划
   */
  stopLimitType: string
  /**
   * 状态 部分成交  0 未成交
   */
  status: string
}

/**
 * 接口 [根据条件-批量撤单↗](https://yapi.coin-online.cc/project/72/interface/api/2498) 的 **返回类型**
 *
 * @分类 [newex-dax-perpetual-rest↗](https://yapi.coin-online.cc/project/72/interface/api/cat_473)
 * @请求头 `DELETE /v2/perpetual/products/batch-order`
 * @更新时间 `2022-08-29 16:50:32`
 */
export interface YapiDeleteV2PerpetualProductsBatchOrderApiResponse {
  code?: number
  data?: {}
  msg?: string
}

/* prettier-ignore-end */
