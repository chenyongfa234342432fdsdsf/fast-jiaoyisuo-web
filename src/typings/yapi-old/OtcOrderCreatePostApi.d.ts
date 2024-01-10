/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [创建订单↗](https://yapi.coin-online.cc/project/72/interface/api/2405) 的 **请求类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `POST /otc/order/create`
 * @更新时间 `2022-09-02 14:14:41`
 */
export interface YapiPostOtcOrderCreateApiRequest {
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
  adId: number
  /**
   * 广告id
   */
  quantity: number
  /**
   * 价格,数量，数量和总额只传一个
   */
  price?: number
  /**
   * 总额，数量和总额只传一个
   */
  amount?: number
  /**
   * 资金密码，如果广告类型为购买，需要资金密码
   */
  capitalPwd?: string
}

/**
 * 接口 [创建订单↗](https://yapi.coin-online.cc/project/72/interface/api/2405) 的 **返回类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `POST /otc/order/create`
 * @更新时间 `2022-09-02 14:14:41`
 */
export interface YapiPostOtcOrderCreateApiResponse {
  code?: number
  data?: YapiDtoCreateOtcOrderVO
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoCreateOtcOrderVO {
  /**
   * 订单id
   */
  orderId?: number
  /**
   * 订单号
   */
  orderNo?: string
}

/* prettier-ignore-end */
