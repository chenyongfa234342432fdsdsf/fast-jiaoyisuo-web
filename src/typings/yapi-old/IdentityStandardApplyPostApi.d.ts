/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [个人标准认证↗](https://yapi.coin-online.cc/project/72/interface/api/1766) 的 **请求类型**
 *
 * @分类 [实人认证↗](https://yapi.coin-online.cc/project/72/interface/api/cat_434)
 * @标签 `实人认证`
 * @请求头 `POST /identity/standard/apply`
 * @更新时间 `2022-08-29 13:58:17`
 */
export interface YapiPostIdentityStandardApplyApiRequest {
  /**
   * 出生日期
   */
  birthday?: string
  /**
   * 证件背面
   */
  cardBackPhotoUrl?: string
  /**
   * 证件正面
   */
  cardFrontPhotoUrl?: string
  /**
   * 1-驾驶证 2-身份证 3-护照
   */
  cardType?: number
  /**
   * 国家或地区，例如中国 传CN
   */
  country?: string
  /**
   * 证件号
   */
  idNo?: string
  /**
   * 姓
   */
  lastName?: string
  /**
   * 中间名字
   */
  middleName?: string
  /**
   * 姓名
   */
  name?: string
  /**
   * 人物信息图片
   */
  realPersonPhotoUrl?: string
}

/**
 * 接口 [个人标准认证↗](https://yapi.coin-online.cc/project/72/interface/api/1766) 的 **返回类型**
 *
 * @分类 [实人认证↗](https://yapi.coin-online.cc/project/72/interface/api/cat_434)
 * @标签 `实人认证`
 * @请求头 `POST /identity/standard/apply`
 * @更新时间 `2022-08-29 13:58:17`
 */
export interface YapiPostIdentityStandardApplyApiResponse {
  code?: number
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}

/* prettier-ignore-end */
