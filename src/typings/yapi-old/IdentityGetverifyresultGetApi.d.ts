/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [查询认证结果↗](https://yapi.coin-online.cc/project/72/interface/api/1763) 的 **请求类型**
 *
 * @分类 [实人认证↗](https://yapi.coin-online.cc/project/72/interface/api/cat_434)
 * @标签 `实人认证`
 * @请求头 `GET /identity/getVerifyResult`
 * @更新时间 `2022-08-29 13:58:17`
 */
export interface YapiGetIdentityGetVerifyResultApiRequest {
  /**
   * 身份认证类型 1个人标准认证 2个人高级认证 3企业认证
   */
  identityType?: string
  /**
   * uid
   */
  userId?: string
}

/**
 * 接口 [查询认证结果↗](https://yapi.coin-online.cc/project/72/interface/api/1763) 的 **返回类型**
 *
 * @分类 [实人认证↗](https://yapi.coin-online.cc/project/72/interface/api/cat_434)
 * @标签 `实人认证`
 * @请求头 `GET /identity/getVerifyResult`
 * @更新时间 `2022-08-29 13:58:17`
 */
export interface YapiGetIdentityGetVerifyResultApiResponse {
  code?: number
  data?: YapiDtoIdentityResultVO
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
/**
 * 查看不同用户类型所拥有的权益
 */
export interface YapiDtoIdentityResultVO {
  /**
   * 法币充值&提现额度 --K
   */
  fiatDailyLimit?: string
  /**
   * 身份认证状态 0等待审核 1审核通过 2审核不通过 3未认证
   */
  identityStatus?: number
  /**
   * 身份认证类型 0未认证 1个人标准认证 2个人高级认证 3企业认证
   */
  identityType?: number
  /**
   * 驳回理由
   */
  reason?: string
  /**
   * 数字货币提现额度--不除
   */
  withdrawCryptoDailyLimit?: string
}

/* prettier-ignore-end */
