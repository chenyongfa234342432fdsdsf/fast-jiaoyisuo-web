/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [订单管理-卖方确认收款，确认放行↗](https://yapi.coin-online.cc/project/72/interface/api/2399) 的 **请求类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `POST /otc/order/confirmCollect`
 * @更新时间 `2022-09-02 14:13:15`
 */
export interface YapiPostOtcOrderConfirmCollectApiRequest {
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
   * 订单号
   */
  orderNo: string
  /**
   * 资金密码
   */
  capitalPwd: string
}

/**
 * 接口 [订单管理-卖方确认收款，确认放行↗](https://yapi.coin-online.cc/project/72/interface/api/2399) 的 **返回类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `POST /otc/order/confirmCollect`
 * @更新时间 `2022-09-02 14:13:15`
 */
export interface YapiPostOtcOrderConfirmCollectApiResponse {
  code?: number
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}

/* prettier-ignore-end */
