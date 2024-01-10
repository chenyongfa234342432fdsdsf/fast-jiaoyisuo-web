/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [获取安全设置记录（最近10条）↗](https://yapi.coin-online.cc/project/72/interface/api/2087) 的 **请求类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `GET /user/getSecurityLogs`
 * @更新时间 `2022-08-29 13:58:29`
 */
export interface YapiGetUserGetSecurityLogsApiRequest {}

/**
 * 接口 [获取安全设置记录（最近10条）↗](https://yapi.coin-online.cc/project/72/interface/api/2087) 的 **返回类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `GET /user/getSecurityLogs`
 * @更新时间 `2022-08-29 13:58:29`
 */
export interface YapiGetUserGetSecurityLogsApiResponse {
  code?: number
  data?: YapiDtoSecurityLogVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoSecurityLogVO {
  /**
   * 城市
   */
  city?: string
  /**
   * 登陆方式: 1-web，2-android, 3-api, 4-h5, 5-ios
   */
  client?: number
  /**
   * 时间
   */
  createTime?: number
  /**
   * ip
   */
  ipAddress?: string
  /**
   * 安全设置
   */
  securityDesc?: string
}

/* prettier-ignore-end */
