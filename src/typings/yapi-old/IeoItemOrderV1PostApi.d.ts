/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [认购↗](https://yapi.coin-online.cc/project/72/interface/api/2117) 的 **请求类型**
 *
 * @分类 [ieo-item↗](https://yapi.coin-online.cc/project/72/interface/api/cat_404)
 * @标签 `ieo-item`
 * @请求头 `POST /v1/ieo/item/order`
 * @更新时间 `2022-08-29 13:58:30`
 */
export interface YapiPostV1IeoItemOrderApiRequest {
  /**
   * 购买usdt数量
   */
  amount?: string
  /**
   * 项目id
   */
  itemId?: string
  /**
   * 认购码
   */
  code?: string
}

/**
 * 接口 [认购↗](https://yapi.coin-online.cc/project/72/interface/api/2117) 的 **返回类型**
 *
 * @分类 [ieo-item↗](https://yapi.coin-online.cc/project/72/interface/api/cat_404)
 * @标签 `ieo-item`
 * @请求头 `POST /v1/ieo/item/order`
 * @更新时间 `2022-08-29 13:58:30`
 */
export interface YapiPostV1IeoItemOrderApiResponse {
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
