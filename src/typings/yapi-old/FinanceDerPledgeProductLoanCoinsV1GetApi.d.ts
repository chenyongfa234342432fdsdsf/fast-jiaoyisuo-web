/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [可借出币详细下拉列表↗](https://yapi.coin-online.cc/project/72/interface/api/2102) 的 **请求类型**
 *
 * @分类 [质押借币产品APP端-可用币管理↗](https://yapi.coin-online.cc/project/72/interface/api/cat_458)
 * @标签 `质押借币产品APP端-可用币管理`
 * @请求头 `GET /v1/finance/der/pledge-product/loan-coins`
 * @更新时间 `2022-08-29 13:58:29`
 */
export interface YapiGetV1FinanceDerPledgeProductLoanCoinsApiRequest {}

/**
 * 接口 [可借出币详细下拉列表↗](https://yapi.coin-online.cc/project/72/interface/api/2102) 的 **返回类型**
 *
 * @分类 [质押借币产品APP端-可用币管理↗](https://yapi.coin-online.cc/project/72/interface/api/cat_458)
 * @标签 `质押借币产品APP端-可用币管理`
 * @请求头 `GET /v1/finance/der/pledge-product/loan-coins`
 * @更新时间 `2022-08-29 13:58:29`
 */
export interface YapiGetV1FinanceDerPledgeProductLoanCoinsApiResponse {
  code?: number
  data?: YapiDtoLoanCoinProductDetailListRespVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoLoanCoinProductDetailListRespVO {
  /**
   * 币种id
   */
  coinId?: number
  /**
   * 借出币id
   */
  id?: number
  /**
   * 已借出数量
   */
  loanAmount?: string
  /**
   * 借出币-币种简称
   */
  loanSymbol?: string
  /**
   * 总量设置
   */
  loanTotalAmount?: string
  /**
   * 单次最大可借
   */
  maxLoanAmountPer?: string
  /**
   * 单次最小可借
   */
  minLoanAmountPer?: string
  /**
   * 订单手续费，范围：0.00～30.00
   */
  orderFeeRate?: string
  /**
   * 周期年利率集合
   */
  periodRateDTOList?: YapiDtoPeriodRateProductVO[]
  /**
   * 排序id
   */
  sortId?: number
  /**
   * 库存数量
   */
  storageAmount?: string
  /**
   * 是否非默认：false 默认， true 非默认
   */
  undefault?: boolean
  /**
   * 可借币webLogo
   */
  webLogo?: string
}
export interface YapiDtoPeriodRateProductVO {
  /**
   * 年利率
   */
  annualRate: string
  /**
   * 日利率
   */
  dayRate: string
  /**
   * itemId
   */
  id: number
  /**
   * 周期
   */
  period: number
}

/* prettier-ignore-end */
