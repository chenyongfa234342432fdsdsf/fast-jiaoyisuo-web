/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [广告管理-发布广告↗](https://yapi.coin-online.cc/project/72/interface/api/2375) 的 **请求类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `POST /otc/merchant/adv/release`
 * @更新时间 `2022-09-02 14:12:11`
 */
export interface YapiPostOtcMerchantAdvReleaseApiRequest {
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
   * 市场
   */
  currencyId: number
  /**
   * 购买还是出售，购买传1 出售传2
   */
  side: number
  /**
   * 币种Id
   */
  coinId: number
  /**
   * 价格类型(1 浮动价格，2 固定价格)
   */
  priceType: number
  /**
   * 浮动比例，如果价格类型为浮动则需要设置此属性
   */
  floatRatio?: number
  /**
   * 价格
   */
  price?: number
  /**
   * 当前广告币种最大购买或出售数量
   */
  volume: number
  /**
   * 最小单笔限额
   */
  minCurrency: number
  /**
   * 最大单笔限额
   */
  maxCurrency: number
  /**
   * 付款最大期限，单位分钟
   */
  maxPaytime: number
  /**
   * 支付方式的id集合
   */
  bankInfoIdList: number[]
  /**
   * 广告备注
   */
  advRemark?: string
  /**
   * 自动回复
   */
  autoReplyMsg?: string
  /**
   * 资金密码
   */
  capitalPwd: string
}

/**
 * 接口 [广告管理-发布广告↗](https://yapi.coin-online.cc/project/72/interface/api/2375) 的 **返回类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `POST /otc/merchant/adv/release`
 * @更新时间 `2022-09-02 14:12:11`
 */
export interface YapiPostOtcMerchantAdvReleaseApiResponse {
  code?: number
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}

/* prettier-ignore-end */
