/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [validateAddress↗](https://yapi.coin-online.cc/project/72/interface/api/1514) 的 **请求类型**
 *
 * @分类 [充提币相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_419)
 * @标签 `充提币相关接口`
 * @请求头 `POST /capital/validateAddress`
 * @更新时间 `2022-08-29 13:58:07`
 */
export interface YapiPostCapitalValidateAddressApiRequest {
  /**
   * scene
   */
  scene?: string
  /**
   * address
   */
  address: string
  /**
   * coinId
   */
  coinId: string
  /**
   * memo
   */
  memo?: string
}

/**
 * 接口 [validateAddress↗](https://yapi.coin-online.cc/project/72/interface/api/1514) 的 **返回类型**
 *
 * @分类 [充提币相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_419)
 * @标签 `充提币相关接口`
 * @请求头 `POST /capital/validateAddress`
 * @更新时间 `2022-08-29 13:58:07`
 */
export interface YapiPostCapitalValidateAddressApiResponse {
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
