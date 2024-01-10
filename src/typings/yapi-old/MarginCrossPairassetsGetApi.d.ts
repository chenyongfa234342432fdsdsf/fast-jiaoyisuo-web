/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [根据交易对查询杠杆用户资产↗](https://yapi.coin-online.cc/project/72/interface/api/1874) 的 **请求类型**
 *
 * @分类 [全仓杠杆模块接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_422)
 * @标签 `全仓杠杆模块接口`
 * @请求头 `GET /margin/cross/pairAssets`
 * @更新时间 `2022-08-29 13:58:21`
 */
export interface YapiGetMarginCrossPairAssetsApiRequest {
  /**
   * tradeId
   */
  tradeId: string
}

/**
 * 接口 [根据交易对查询杠杆用户资产↗](https://yapi.coin-online.cc/project/72/interface/api/1874) 的 **返回类型**
 *
 * @分类 [全仓杠杆模块接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_422)
 * @标签 `全仓杠杆模块接口`
 * @请求头 `GET /margin/cross/pairAssets`
 * @更新时间 `2022-08-29 13:58:21`
 */
export interface YapiGetMarginCrossPairAssetsApiResponse {
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
