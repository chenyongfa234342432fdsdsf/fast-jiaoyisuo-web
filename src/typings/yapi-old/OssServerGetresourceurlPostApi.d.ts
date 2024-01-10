/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [获取资源地址↗](https://yapi.coin-online.cc/project/72/interface/api/2429) 的 **请求类型**
 *
 * @分类 [oss_server↗](https://yapi.coin-online.cc/project/72/interface/api/cat_467)
 * @请求头 `POST /oss_server/getResourceUrl`
 * @更新时间 `2022-08-29 15:52:34`
 */
export interface YapiPostOssServerGetResourceUrlApiRequest {
  /**
   * 文件目录
   */
  fileDir: string
  /**
   * 文件名
   */
  fileName: string
}

/**
 * 接口 [获取资源地址↗](https://yapi.coin-online.cc/project/72/interface/api/2429) 的 **返回类型**
 *
 * @分类 [oss_server↗](https://yapi.coin-online.cc/project/72/interface/api/cat_467)
 * @请求头 `POST /oss_server/getResourceUrl`
 * @更新时间 `2022-08-29 15:52:34`
 */
export interface YapiPostOssServerGetResourceUrlApiResponse {
  code?: number
  data?: {}
  msg?: string
  time?: number
}

/* prettier-ignore-end */
