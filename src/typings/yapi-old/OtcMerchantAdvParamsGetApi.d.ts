/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [获取发布广告参数↗](https://yapi.coin-online.cc/project/72/interface/api/2372) 的 **请求类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `GET /otc/merchant/adv/params`
 * @更新时间 `2022-09-05 17:03:53`
 */
export interface YapiGetOtcMerchantAdvParamsApiRequest {
  currencyId: string
  coinId: string
}

/**
 * 接口 [获取发布广告参数↗](https://yapi.coin-online.cc/project/72/interface/api/2372) 的 **返回类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `GET /otc/merchant/adv/params`
 * @更新时间 `2022-09-05 17:03:53`
 */
export interface YapiGetOtcMerchantAdvParamsApiResponse {
  code?: number
  data?: YapiDtoAdvReferenceParameterVo
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoAdvReferenceParameterVo {
  /**
   * 自动回复
   */
  autoReply?: string
  /**
   * 可用量
   */
  availableAmount?: string
  /**
   * 币种精度
   */
  coinPrecision?: number
  /**
   * 参考价
   */
  marketPrice?: number
  /**
   * 广告金额上限 ,广告的金额 *数量 不得超过这个值
   */
  maxAmount?: number
  /**
   * 最大价
   */
  maxPrice?: number
  /**
   * 最大付款时间
   */
  maxTime?: number
  /**
   * 广告金额下限,广告的金额 *数量 不得小于这个值
   */
  minAmount?: number
  /**
   * 最小价
   */
  minPrice?: number
  /**
   * 最小付款时间
   */
  minTime?: number
  /**
   * 支付方式id
   */
  paymentIds?: number[]
  /**
   * 价钱精度
   */
  precision?: number
  /**
   * 价格偏移上限，单位 %
   */
  priceDevMax?: number
  /**
   * 价格偏移下限，单位 %
   */
  priceDevMin?: number
  /**
   * 交易备注
   */
  remark?: string
  /**
   * 单笔订单金额上限
   */
  singleOrderMaxAmount?: number
  /**
   * 单笔订单金额下限
   */
  singleOrderMinAmount?: number
}

/* prettier-ignore-end */
