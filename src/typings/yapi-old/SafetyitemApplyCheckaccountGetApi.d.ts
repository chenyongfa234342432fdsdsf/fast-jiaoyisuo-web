/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [安全项丢失申请帐号检查↗](https://yapi.coin-online.cc/project/72/interface/api/2003) 的 **请求类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `GET /safetyItem/apply/checkAccount`
 * @更新时间 `2022-08-29 13:58:25`
 */
export interface YapiGetSafetyItemApplyCheckAccountApiRequest {
  /**
   * 账号
   */
  account?: string
  /**
   * 极验或图片验证码
   */
  imageCode?: string
}

/**
 * 接口 [安全项丢失申请帐号检查↗](https://yapi.coin-online.cc/project/72/interface/api/2003) 的 **返回类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `GET /safetyItem/apply/checkAccount`
 * @更新时间 `2022-08-29 13:58:25`
 */
export interface YapiGetSafetyItemApplyCheckAccountApiResponse {
  code?: number
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}

/* prettier-ignore-end */
