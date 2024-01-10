/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [商家查询自己发布的广告列表↗](https://yapi.coin-online.cc/project/72/interface/api/2369) 的 **请求类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `POST /otc/merchant/adv/list`
 * @更新时间 `2022-08-29 15:32:09`
 */
export interface YapiPostOtcMerchantAdvListApiRequest {
  advId?: number
  /**
   * 是否返回总记录数，默认true
   */
  count?: boolean
  /**
   * 页码
   */
  pageNum?: number
  /**
   * 每页显示条数
   */
  pageSize?: number
  /**
   * 广告状态（0全部，1 进行中，2下架）
   */
  processStatus?: number
}

/**
 * 接口 [商家查询自己发布的广告列表↗](https://yapi.coin-online.cc/project/72/interface/api/2369) 的 **返回类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `POST /otc/merchant/adv/list`
 * @更新时间 `2022-08-29 15:32:09`
 */
export interface YapiPostOtcMerchantAdvListApiResponse {
  code?: number
  data?: YapiDtoMerChantAdvVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoMerChantAdvVO {
  /**
   * 广告id
   */
  advId?: number
  /**
   * 广告备注
   */
  advRemark?: string
  /**
   * 价格数量精度
   */
  amountPrecision?: number
  /**
   * 自动回复
   */
  autoReplyMsg?: string
  /**
   * 广告支付方式id
   */
  bankInfoIds?: number[]
  /**
   * 币种id
   */
  coinId?: number
  /**
   * 币种数量精度
   */
  coinPrecision?: number
  /**
   * 币种
   */
  coinShortName?: string
  /**
   * 支付货币id
   */
  currencyId?: number
  /**
   * 浮动比率
   */
  floatRatio?: number
  /**
   * 是否存在进行中的订单
   */
  isHasProcessingOrder?: boolean
  /**
   * 市场
   */
  market?: string
  /**
   * 单笔订单限额最大
   */
  maxAmount?: number
  /**
   * 付款期限
   */
  maxPaytime?: number
  /**
   * 单笔订单限额最小
   */
  minAmount?: number
  /**
   * 可以的支付方式id
   */
  paymentIdList?: YapiDtoOtcPaymentVO[]
  /**
   * 单价
   */
  price?: number
  /**
   * 价格类型 1 浮动价格，2 固定价格
   */
  priceType?: number
  /**
   * 价格类型字符串
   */
  priceTypeDesc?: string
  /**
   * 单价单位
   */
  priceUnit?: string
  /**
   * 类型(1- 购买 2-出售)
   */
  side?: number
  /**
   * 状态(1 开启，2关闭，3下架)
   */
  status?: number
  /**
   * 状态描述
   */
  statusDesc?: string
  /**
   * 成单量
   */
  successOrderNum?: number
  /**
   * 成交数量
   */
  turnover?: number
  /**
   * 修改时间，如果是下架的状态，那就是下架时间
   */
  updateTime?: number
  /**
   * 当前数量
   */
  visiableVolume?: number
}
export interface YapiDtoOtcPaymentVO {
  id?: number
  /**
   *  名称
   */
  name?: string
  /**
   * 支付图标
   */
  picture?: string
  sortId?: number
  /**
   * 状态(0-关闭 1-开启)
   */
  status?: number
  /**
   * 状态描述
   */
  statusString?: string
  /**
   *  类型
   */
  type?: number
  /**
   *  类型描述
   */
  typeString?: string
}

/* prettier-ignore-end */
