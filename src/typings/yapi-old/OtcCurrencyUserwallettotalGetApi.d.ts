/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [获取用户币币账户余额↗](https://yapi.coin-online.cc/project/72/interface/api/2354) 的 **请求类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `GET /otc/currency/userWalletTotal`
 * @更新时间 `2022-08-29 15:32:08`
 */
export interface YapiGetOtcCurrencyUserWalletTotalApiRequest {
  /**
   * coinId
   */
  coinId: string
}

/**
 * 接口 [获取用户币币账户余额↗](https://yapi.coin-online.cc/project/72/interface/api/2354) 的 **返回类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `GET /otc/currency/userWalletTotal`
 * @更新时间 `2022-08-29 15:32:08`
 */
export interface YapiGetOtcCurrencyUserWalletTotalApiResponse {
  code?: number
  data?: YapiDtoUserCoinWalletTotalVO
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoUserCoinWalletTotalVO {
  /**
   * 币币余额
   */
  total?: number
  totalStr?: string
}

/* prettier-ignore-end */
