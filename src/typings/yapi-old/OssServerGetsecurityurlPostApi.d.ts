/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [获取临时授权链接↗](https://yapi.coin-online.cc/project/72/interface/api/2426) 的 **请求类型**
 *
 * @分类 [oss_server↗](https://yapi.coin-online.cc/project/72/interface/api/cat_467)
 * @请求头 `POST /oss_server/getSecurityUrl`
 * @更新时间 `2022-08-29 15:52:28`
 */
export interface YapiPostOssServerGetSecurityUrlApiRequest {
  /**
   * 文件路径
   */
  fileUrl: string
}

/**
 * 接口 [获取临时授权链接↗](https://yapi.coin-online.cc/project/72/interface/api/2426) 的 **返回类型**
 *
 * @分类 [oss_server↗](https://yapi.coin-online.cc/project/72/interface/api/cat_467)
 * @请求头 `POST /oss_server/getSecurityUrl`
 * @更新时间 `2022-08-29 15:52:28`
 */
export interface YapiPostOssServerGetSecurityUrlApiResponse {
  code?: number
  data?: {}
  msg?: string
  time?: number
}

/* prettier-ignore-end */
