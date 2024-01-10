/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [发送短信验证码↗](https://yapi.coin-online.cc/project/72/interface/api/2180) 的 **请求类型**
 *
 * @分类 [验证码↗](https://yapi.coin-online.cc/project/72/interface/api/cat_464)
 * @标签 `验证码`
 * @请求头 `POST /v2/sendPhone`
 * @更新时间 `2022-08-29 13:58:32`
 */
export interface YapiPostV2SendPhoneApiRequest {
  /**
   * phone
   */
  phone?: string
  /**
   * area
   */
  area?: string
  /**
   * imgCode
   */
  imgCode?: string
  /**
   * type
   */
  type: string
}

/**
 * 接口 [发送短信验证码↗](https://yapi.coin-online.cc/project/72/interface/api/2180) 的 **返回类型**
 *
 * @分类 [验证码↗](https://yapi.coin-online.cc/project/72/interface/api/cat_464)
 * @标签 `验证码`
 * @请求头 `POST /v2/sendPhone`
 * @更新时间 `2022-08-29 13:58:32`
 */
export interface YapiPostV2SendPhoneApiResponse {
  code?: number
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}

/* prettier-ignore-end */
