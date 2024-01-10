/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [批量撤单-取消用户所有订单↗](https://yapi.coin-online.cc/project/72/interface/api/2093) 的 **请求类型**
 *
 * @分类 [order-api-controller↗](https://yapi.coin-online.cc/project/72/interface/api/cat_410)
 * @标签 `order-api-controller`
 * @请求头 `POST /v1/entrust/batchcancel`
 * @更新时间 `2022-09-02 13:43:02`
 */
export interface YapiPostV1EntrustBatchcancelApiRequest {
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
  /**
   * 杠杆模式：nonmag非杠杆，cross全仓杠杆，isolated逐仓杠杆
   */
  marginMode: string
  /**
   * 委托类型（0-限价委托、1-市价委托、4-计划委托）
   */
  placeOrderType: number
}

/**
 * 接口 [批量撤单-取消用户所有订单↗](https://yapi.coin-online.cc/project/72/interface/api/2093) 的 **返回类型**
 *
 * @分类 [order-api-controller↗](https://yapi.coin-online.cc/project/72/interface/api/cat_410)
 * @标签 `order-api-controller`
 * @请求头 `POST /v1/entrust/batchcancel`
 * @更新时间 `2022-09-02 13:43:02`
 */
export interface YapiPostV1EntrustBatchcancelApiResponse {
  code?: number
  data?: {}
  msg?: string
  time?: number
}

/* prettier-ignore-end */
