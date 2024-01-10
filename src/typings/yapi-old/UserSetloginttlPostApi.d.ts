/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [保持登录时长↗](https://yapi.coin-online.cc/project/72/interface/api/2090) 的 **请求类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `POST /user/setLoginTTL`
 * @更新时间 `2022-08-29 13:58:29`
 */
export interface YapiPostUserSetLoginTtlApiRequest {
  /**
   * 保持登录时长，单位小时
   */
  ttl?: number
}

/**
 * 接口 [保持登录时长↗](https://yapi.coin-online.cc/project/72/interface/api/2090) 的 **返回类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `POST /user/setLoginTTL`
 * @更新时间 `2022-08-29 13:58:29`
 */
export interface YapiPostUserSetLoginTtlApiResponse {
  code?: number
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}

/* prettier-ignore-end */
