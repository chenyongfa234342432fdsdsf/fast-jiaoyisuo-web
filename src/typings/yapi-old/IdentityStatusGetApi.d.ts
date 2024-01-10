/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [用户认证状态↗](https://yapi.coin-online.cc/project/72/interface/api/1769) 的 **请求类型**
 *
 * @分类 [实人认证↗](https://yapi.coin-online.cc/project/72/interface/api/cat_434)
 * @标签 `实人认证`
 * @请求头 `GET /identity/status`
 * @更新时间 `2022-08-29 13:58:17`
 */
export interface YapiGetIdentityStatusApiRequest {}

/**
 * 接口 [用户认证状态↗](https://yapi.coin-online.cc/project/72/interface/api/1769) 的 **返回类型**
 *
 * @分类 [实人认证↗](https://yapi.coin-online.cc/project/72/interface/api/cat_434)
 * @标签 `实人认证`
 * @请求头 `GET /identity/status`
 * @更新时间 `2022-08-29 13:58:17`
 */
export interface YapiGetIdentityStatusApiResponse {
  code?: number
  data?: YapiDtoIdentityDataVO
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
/**
 * 用户认证状态实体类
 */
export interface YapiDtoIdentityDataVO {
  /**
   * 国家简称
   */
  country?: string
  /**
   * 用户认证状态
   */
  statusList?: YapiDtoIdentityStatusVO[]
}
/**
 * 用户认证状态
 */
export interface YapiDtoIdentityStatusVO {
  /**
   * 身份认证状态 0等待审核 1审核通过 2审核不通过 3未认证
   */
  identityStatus?: number
  /**
   * 身份认证类型 0未认证 1个人标准认证 2个人高级认证 3企业认证
   */
  identityType?: number
}

/* prettier-ignore-end */
