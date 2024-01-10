/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [注册前校验第二步↗](https://yapi.coin-online.cc/project/72/interface/api/2264) 的 **请求类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `POST /v3/registerCheck2`
 * @更新时间 `2022-08-29 13:58:36`
 */
export interface YapiPostV3RegisterCheck2ApiRequest {
  /**
   * 手机号码或者邮箱，手机号格式 86-15711941299
   */
  address?: string
  /**
   * 极验或图片验证码
   */
  imageCode?: string
  /**
   * 邮箱或手机验证码
   */
  validCode?: string
}

/**
 * 接口 [注册前校验第二步↗](https://yapi.coin-online.cc/project/72/interface/api/2264) 的 **返回类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `POST /v3/registerCheck2`
 * @更新时间 `2022-08-29 13:58:36`
 */
export interface YapiPostV3RegisterCheck2ApiResponse {
  code?: number
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}

/* prettier-ignore-end */
