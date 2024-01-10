/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [otc商户个人信息↗](https://yapi.coin-online.cc/project/72/interface/api/2390) 的 **请求类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `GET /otc/merchant/info`
 * @更新时间 `2022-08-29 15:32:10`
 */
export interface YapiGetOtcMerchantInfoApiRequest {}

/**
 * 接口 [otc商户个人信息↗](https://yapi.coin-online.cc/project/72/interface/api/2390) 的 **返回类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `GET /otc/merchant/info`
 * @更新时间 `2022-08-29 15:32:10`
 */
export interface YapiGetOtcMerchantInfoApiResponse {
  code?: number
  data?: YapiDtoMerchantVO
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoMerchantVO {
  /**
   * 平均放心时间 单位秒
   */
  averageTime?: number
  /**
   * 买广告列表
   */
  buyAdvList?: YapiDtoOtcAdvertVo[]
  /**
   * 历史成交买单
   */
  buyOrderNumAll?: number
  /**
   * 30日成交买单
   */
  buyOrderNumIn30Day?: number
  /**
   * 头像
   */
  facePhoto?: string
  /**
   * 首次访问法币交易时间
   */
  firstVisitTime?: number
  /**
   * 是否是商户
   */
  isMerchant?: boolean
  /**
   * 是否在线
   */
  isOnline?: boolean
  /**
   * 是否绑定交易密码
   */
  isTradePwd?: boolean
  /**
   * 是否黑名单
   */
  isblacklist?: boolean
  /**
   * 是否邮箱验证
   */
  mailAuth?: boolean
  /**
   * 姓名
   */
  name?: string
  /**
   * 开启的支付方式数量
   */
  openBankInfoNum?: number
  /**
   * 30日完成率
   */
  orderFillRateIn30Day?: number
  /**
   * 历史成交订单
   */
  orderNumAll?: number
  /**
   * 30日成交订单
   */
  orderNumIn30Day?: number
  /**
   * 进行中的广告数量
   */
  processAdvNum?: number
  /**
   * 是否实名认证
   */
  realPersonAuth?: boolean
  /**
   * 注册时间
   */
  registerTime?: number
  /**
   * 卖广告列表
   */
  sellAdvList?: YapiDtoOtcAdvertVo1[]
  /**
   * 历史成交卖单
   */
  sellOrderNumAll?: number
  /**
   * 30日成交卖单
   */
  sellOrderNumIn30Day?: number
  /**
   * 商户状态，查本人才会有值
   */
  status?: number
  /**
   * 是否手机验证
   */
  telephoneAuth?: boolean
  /**
   * 未实名用户可OTC卖出
   */
  unrealFiatWithdraw?: boolean
  /**
   * 是否vip
   */
  vip?: boolean
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
export interface YapiDtoOtcAdvertVo1 {
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
  paymentIdList?: YapiDtoOtcPaymentVO1[]
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
export interface YapiDtoOtcPaymentVO1 {
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
