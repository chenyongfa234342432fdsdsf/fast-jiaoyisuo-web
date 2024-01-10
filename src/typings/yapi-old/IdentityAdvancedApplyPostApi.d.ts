/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [个人高级认证↗](https://yapi.coin-online.cc/project/72/interface/api/1718) 的 **请求类型**
 *
 * @分类 [实人认证↗](https://yapi.coin-online.cc/project/72/interface/api/cat_434)
 * @标签 `实人认证`
 * @请求头 `POST /identity/advanced/apply`
 * @更新时间 `2022-08-29 13:58:16`
 */
export interface YapiPostIdentityAdvancedApplyApiRequest {
  /**
   * 地址证明
   */
  addressProof?: string
  /**
   * 城市
   */
  city?: string
  /**
   * 国家或地区，例如中国 传CN
   */
  country?: string
  /**
   * 地址
   */
  street?: string
}

/**
 * 接口 [个人高级认证↗](https://yapi.coin-online.cc/project/72/interface/api/1718) 的 **返回类型**
 *
 * @分类 [实人认证↗](https://yapi.coin-online.cc/project/72/interface/api/cat_434)
 * @标签 `实人认证`
 * @请求头 `POST /identity/advanced/apply`
 * @更新时间 `2022-08-29 13:58:16`
 */
export interface YapiPostIdentityAdvancedApplyApiResponse {
  code?: number
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}

/* prettier-ignore-end */
