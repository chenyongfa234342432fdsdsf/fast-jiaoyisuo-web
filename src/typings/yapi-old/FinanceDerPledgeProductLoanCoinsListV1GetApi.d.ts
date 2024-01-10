/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [可借出币简易下拉列表↗](https://yapi.coin-online.cc/project/72/interface/api/2108) 的 **请求类型**
 *
 * @分类 [质押借币产品APP端-可用币管理↗](https://yapi.coin-online.cc/project/72/interface/api/cat_458)
 * @标签 `质押借币产品APP端-可用币管理`
 * @请求头 `GET /v1/finance/der/pledge-product/loan-coins/list`
 * @更新时间 `2022-08-29 13:58:30`
 */
export interface YapiGetV1FinanceDerPledgeProductLoanCoinsListApiRequest {}

/**
 * 接口 [可借出币简易下拉列表↗](https://yapi.coin-online.cc/project/72/interface/api/2108) 的 **返回类型**
 *
 * @分类 [质押借币产品APP端-可用币管理↗](https://yapi.coin-online.cc/project/72/interface/api/cat_458)
 * @标签 `质押借币产品APP端-可用币管理`
 * @请求头 `GET /v1/finance/der/pledge-product/loan-coins/list`
 * @更新时间 `2022-08-29 13:58:30`
 */
export interface YapiGetV1FinanceDerPledgeProductLoanCoinsListApiResponse {
  code?: number
  data?: YapiDtoLoanCoinProductListRespVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoLoanCoinProductListRespVO {
  /**
   * 币种id
   */
  coinId?: number
  /**
   * 借出币id
   */
  id?: number
  /**
   * 借出币-币种简称
   */
  loanSymbol?: string
  /**
   * 借出币webLogo
   */
  webLogo?: string
}

/* prettier-ignore-end */
