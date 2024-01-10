/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [根据交易对查询杠杆用户资产↗](https://yapi.coin-online.cc/project/72/interface/api/1925) 的 **请求类型**
 *
 * @分类 [逐仓杠杆交易↗](https://yapi.coin-online.cc/project/72/interface/api/cat_461)
 * @标签 `逐仓杠杆交易`
 * @请求头 `GET /margin/isolated/pairAssets`
 * @更新时间 `2022-08-29 13:58:23`
 */
export interface YapiGetMarginIsolatedPairAssetsApiRequest {
  /**
   * tradeId
   */
  tradeId: string
}

/**
 * 接口 [根据交易对查询杠杆用户资产↗](https://yapi.coin-online.cc/project/72/interface/api/1925) 的 **返回类型**
 *
 * @分类 [逐仓杠杆交易↗](https://yapi.coin-online.cc/project/72/interface/api/cat_461)
 * @标签 `逐仓杠杆交易`
 * @请求头 `GET /margin/isolated/pairAssets`
 * @更新时间 `2022-08-29 13:58:23`
 */
export interface YapiGetMarginIsolatedPairAssetsApiResponse {
  code?: number
  data?: {}
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}

/* prettier-ignore-end */
