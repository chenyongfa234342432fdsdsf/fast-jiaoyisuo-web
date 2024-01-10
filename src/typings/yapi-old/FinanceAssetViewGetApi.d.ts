/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [热币理财资产总览↗](https://yapi.coin-online.cc/project/72/interface/api/1631) 的 **请求类型**
 *
 * @分类 [热币宝理财↗](https://yapi.coin-online.cc/project/72/interface/api/cat_452)
 * @标签 `热币宝理财`
 * @请求头 `GET /finance/asset/view`
 * @更新时间 `2022-08-29 13:58:12`
 */
export interface YapiGetFinanceAssetViewApiRequest {}

/**
 * 接口 [热币理财资产总览↗](https://yapi.coin-online.cc/project/72/interface/api/1631) 的 **返回类型**
 *
 * @分类 [热币宝理财↗](https://yapi.coin-online.cc/project/72/interface/api/cat_452)
 * @标签 `热币宝理财`
 * @请求头 `GET /finance/asset/view`
 * @更新时间 `2022-08-29 13:58:12`
 */
export interface YapiGetFinanceAssetViewApiResponse {
  code?: number
  data?: YapiDtoFinAssetTotalDTO
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoFinAssetTotalDTO {
  assetsInCny?: string
  assetsInUsdt?: string
}

/* prettier-ignore-end */
