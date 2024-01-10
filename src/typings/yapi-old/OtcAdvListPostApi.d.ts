/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [广告大厅↗](https://yapi.coin-online.cc/project/72/interface/api/2327) 的 **请求类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `POST /otc/adv/list`
 * @更新时间 `2022-08-29 15:32:07`
 */
export interface YapiPostOtcAdvListApiRequest {
  /**
   * 币种id，必填
   */
  coinId?: number
  /**
   * 是否返回总记录数，默认true
   */
  count?: boolean
  /**
   * 支付货币id
   */
  currencyId?: number
  /**
   * 页码
   */
  pageNum?: number
  /**
   * 每页显示条数
   */
  pageSize?: number
  /**
   * 支付方式id
   */
  paymentId?: number
  /**
   * 买卖方向，必填，1买，2卖
   */
  side?: number
}

/**
 * 接口 [广告大厅↗](https://yapi.coin-online.cc/project/72/interface/api/2327) 的 **返回类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `POST /otc/adv/list`
 * @更新时间 `2022-08-29 15:32:07`
 */
export interface YapiPostOtcAdvListApiResponse {
  code?: number
  data?: YapiDtoOtcAdvertVo[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoOtcAdvertVo {
  /**
   * 广告id
   */
  advId?: number
  /**
   * 交易备注
   */
  advRemark?: string
  /**
   * 广告主id
   */
  advUserId?: number
  /**
   * 价格数量精度
   */
  amountPrecision?: number
  /**
   * 币种id
   */
  coinId?: number
  /**
   * 币种数量精度
   */
  coinPrecision?: number
  coinSort?: number
  /**
   * 市场英文名称
   */
  currencyEnglishName?: string
  /**
   * 市场id
   */
  currencyId?: number
  /**
   * 市场符号
   */
  currencySymbol?: string
  /**
   * 是否在线
   */
  isOnline?: boolean
  /**
   * 币种logo
   */
  logo?: string
  /**
   * 付款时间
   */
  maxPaytime?: number
  /**
   * 最大金额
   */
  maxVolume?: number
  /**
   * 最小金额
   */
  minVolume?: number
  /**
   * 昵称
   */
  name?: string
  openTime?: string
  /**
   * 30天完成率
   */
  orderFillRateIn30Day?: number
  /**
   * 30天完成订单数
   */
  orderNumIn30Day?: number
  /**
   * 可以的支付方式id
   */
  paymentIdList?: YapiDtoOtcPaymentVO[]
  /**
   * 单价
   */
  price?: number
  /**
   * 买卖方向，1买入，2卖出
   */
  side?: number
  /**
   * 币种symbol
   */
  symbol?: string
  /**
   * 头像
   */
  userPhoto?: string
  /**
   * 加v
   */
  vip?: boolean
  /**
   * 广告数量
   */
  volume?: number
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
