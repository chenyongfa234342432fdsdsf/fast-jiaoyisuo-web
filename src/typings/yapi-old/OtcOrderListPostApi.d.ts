/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [订单管理-列表(商户和普通用户都是通过该接口查看订单)↗](https://yapi.coin-online.cc/project/72/interface/api/2411) 的 **请求类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `POST /otc/order/list`
 * @更新时间 `2022-09-05 11:50:52`
 */
export interface YapiPostOtcOrderListApiRequest {
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
   * 币种
   */
  coinId?: number
  /**
   * 类型(1-买入 2-卖出)，不传查所有
   */
  type?: number
  /**
   * 时间范围(1：一周内，2：一月内，3：一年内)
   */
  timeRange?: number
  /**
   * 订单状态（1-已取消 2-已完成 3-进行中），不传查所有状态
   */
  status?: number
}

/**
 * 接口 [订单管理-列表(商户和普通用户都是通过该接口查看订单)↗](https://yapi.coin-online.cc/project/72/interface/api/2411) 的 **返回类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `POST /otc/order/list`
 * @更新时间 `2022-09-05 11:50:52`
 */
export interface YapiPostOtcOrderListApiResponse {
  code?: number
  data?: string
  /**
   * data参数格式（仅展示）
   */
  dataView: YapiDtoundefined[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoundefined {
  /**
   * 时间
   */
  time: number
  /**
   * 买卖方向(1买入，2卖出)，买家和卖家看到的方向相反
   */
  side: string
  /**
   * 买卖方向描述
   */
  sideDesc: string
  /**
   * 订单号
   */
  orderNo: string
  /**
   * 数量
   */
  quantity: string
  /**
   * 币种id
   */
  coinId: string
  /**
   * 单价
   */
  price: string
  /**
   * 单价单位
   */
  currency: string
  /**
   * 货币符号
   */
  currencySymbol: string
  /**
   * 币种单位
   */
  coinShortName: string
  /**
   * 币种logo
   */
  logo: string
  /**
   * 金额
   */
  amount: string
  /**
   * 交易对象用户id，买方的交易对象是卖方，卖方的交易对象是买方
   */
  tradeUserId: string
  /**
   * 交易对象，买方的交易对象是卖方，卖方的交易对象是买方
   */
  tradeUserRealName: string
  /**
   * 交易对象头像
   */
  tradeUserPhoto: string
  /**
   * 交易对象昵称
   */
  tradeUserNickName: string
  /**
   * 交易对象是否为vip
   */
  tradeUserIsVip: string
  /**
   * 订单状态(1-已取消 2-已完成 3-买方未付款 4-卖方未放币)
   */
  status: string
  /**
   * 申诉状态 1申诉中，2买方胜诉，3卖方胜诉，4申诉完成
   */
  appealStatus: string
  /**
   * 转账剩余时间，单位秒，只有在未付款状态下才会有值
   */
  remainTime: number
  /**
   * 订单如果未付款自动取消订单期限，单位分钟
   */
  maxPaytime: number
  /**
   * 收款方式
   */
  bankInfoList: YapiDtoundefined1[]
  /**
   * 申诉图片地址,多个以逗号分隔
   */
  otcAppealImageUrl: string
  /**
   * 订单id
   */
  orderId: number
  /**
   * 标记付款方式
   */
  markBankInfoId: number
}
export interface YapiDtoundefined1 {
  /**
   * 支付方式id
   */
  bankInfoId: number
  /**
   * 支付方式id
   */
  paymentId: number
  /**
   * 支付方式名
   */
  paymentName: string
  /**
   * 支付方式描述
   */
  paymentChineseDesc: string
  /**
   * 支付方式描述
   */
  paymentEnglistDesc: string
  /**
   * 支付方式Logo
   */
  paymentLogo: string
  /**
   * 姓名
   */
  name: string
  /**
   * 开户银行
   */
  bankName: string
  /**
   * 开户支行
   */
  branchName: string
  /**
   * 银行卡号 或 支付宝账号 或 微信账号
   */
  bankCardNumber: string
  /**
   * 收款二维码照片url
   */
  qrCodeUrl: string
  /**
   * 开启状态，1开启，2关闭
   */
  openStatus: string
  /**
   * 开启状态描述，开启，关闭
   */
  openStatusDesc: string
  logo: string
  /**
   * 实名名称与收款名称是否一致,true-一致,false
   */
  isNameSame: string
}

/* prettier-ignore-end */
