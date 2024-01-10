/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [otc系统参数接口↗](https://yapi.coin-online.cc/project/72/interface/api/2348) 的 **请求类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `GET /otc/common/systemArgs`
 * @更新时间 `2022-08-29 15:32:08`
 */
export interface YapiGetOtcCommonSystemArgsApiRequest {}

/**
 * 接口 [otc系统参数接口↗](https://yapi.coin-online.cc/project/72/interface/api/2348) 的 **返回类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `GET /otc/common/systemArgs`
 * @更新时间 `2022-08-29 15:32:08`
 */
export interface YapiGetOtcCommonSystemArgsApiResponse {
  code?: number
  data?: YapiDtoOtcSystemArgsVO
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoOtcSystemArgsVO {
  /**
   * app取消时间
   */
  appCancellationTime?: number
  currencyList?: YapiDtoOtcCurrencyVO[]
  otcCoinList?: YapiDtoOtcCoinVO[]
  paymentList?: YapiDtoOtcPaymentVO[]
}
export interface YapiDtoOtcCurrencyVO {
  /**
   * 中文名称
   */
  chineseName?: string
  /**
   * 创建时间
   */
  createTime?: number
  /**
   * 英文简称
   */
  englishName?: string
  /**
   * id
   */
  id?: number
  /**
   * 初始费率
   */
  initialExchangeRate?: number
  /**
   * 名称
   */
  name?: string
  /**
   * 次序
   */
  order?: number
  /**
   * 支付方式(翻译)，多个以逗号分隔
   */
  otcPaments?: string
  /**
   * 支付方式id，多个以逗号分隔
   */
  otcPaymentIds?: string
  /**
   * 支付状态(1-正常 2修改中)
   */
  payStatus?: number
  /**
   * 支付状态翻译
   */
  payStatusDesc?: string
  /**
   * 精度
   */
  precision?: number
  /**
   * 状态
   */
  status?: number
  /**
   * 状态描述
   */
  statusString?: string
  /**
   * 货币符号
   */
  symbol?: string
  /**
   * 修改时间
   */
  updateTime?: number
}
export interface YapiDtoOtcCoinVO {
  /**
   * 数量精度 1 表示小数点后1位  2小数点后两位
   */
  amountAccuracy?: number
  /**
   * 币种id
   */
  coinId?: number
  /**
   * 是否启用
   */
  enable?: boolean
  /**
   * 主键
   */
  id?: number
  /**
   * logo
   */
  logo?: string
  /**
   * 一键买币上限金额
   */
  maxAmount?: number
  /**
   * 一键买币上限数量
   */
  maxNum?: number
  /**
   * 一键买币下限金额
   */
  minAmount?: number
  /**
   * 一键买币下限数量
   */
  minNum?: number
  /**
   * 次序
   */
  sort?: number
  /**
   * 币种symbol
   */
  symbol?: string
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
