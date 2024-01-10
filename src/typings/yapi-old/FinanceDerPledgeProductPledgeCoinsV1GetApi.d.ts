/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [可质押币详细下拉列表↗](https://yapi.coin-online.cc/project/72/interface/api/2111) 的 **请求类型**
 *
 * @分类 [质押借币产品APP端-可用币管理↗](https://yapi.coin-online.cc/project/72/interface/api/cat_458)
 * @标签 `质押借币产品APP端-可用币管理`
 * @请求头 `GET /v1/finance/der/pledge-product/pledge-coins`
 * @更新时间 `2022-08-29 13:58:30`
 */
export interface YapiGetV1FinanceDerPledgeProductPledgeCoinsApiRequest {}

/**
 * 接口 [可质押币详细下拉列表↗](https://yapi.coin-online.cc/project/72/interface/api/2111) 的 **返回类型**
 *
 * @分类 [质押借币产品APP端-可用币管理↗](https://yapi.coin-online.cc/project/72/interface/api/cat_458)
 * @标签 `质押借币产品APP端-可用币管理`
 * @请求头 `GET /v1/finance/der/pledge-product/pledge-coins`
 * @更新时间 `2022-08-29 13:58:30`
 */
export interface YapiGetV1FinanceDerPledgeProductPledgeCoinsApiResponse {
  code?: number
  data?: YapiDtoPledgeCoinProductDetailListRespVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoPledgeCoinProductDetailListRespVO {
  /**
   * 补仓质押率
   */
  callMarginRate?: string
  /**
   * 平仓质押率
   */
  closeOutRate?: string
  /**
   * 币种id
   */
  coinId?: number
  /**
   * 质押币id
   */
  id?: number
  /**
   * 初始质押率
   */
  initPledgeRate?: string
  /**
   * 质押币-币种简称
   */
  pledgeSymbol?: string
  /**
   * 排序id
   */
  sortId?: number
  /**
   * 是否非默认：false 默认， true 非默认
   */
  undefault?: boolean
  /**
   * 当前用户可用币数量
   */
  validAmount?: string
  /**
   * 可质押币webLogo
   */
  webLogo?: string
}

/* prettier-ignore-end */
