/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [文件上传↗](https://yapi.coin-online.cc/project/72/interface/api/2312) 的 **请求类型**
 *
 * @分类 [oss_server↗](https://yapi.coin-online.cc/project/72/interface/api/cat_467)
 * @请求头 `GET /oss_server/upload`
 * @更新时间 `2022-08-29 15:51:44`
 */
export interface YapiGetOssServerUploadApiRequest {
  /**
   * MultipartFile文件
   */
  file: string
  /**
   * 自定义编号
   */
  uniqueCode?: string
  /**
   * 文件目录
   */
  fileDir: string
}

/**
 * 接口 [文件上传↗](https://yapi.coin-online.cc/project/72/interface/api/2312) 的 **返回类型**
 *
 * @分类 [oss_server↗](https://yapi.coin-online.cc/project/72/interface/api/cat_467)
 * @请求头 `GET /oss_server/upload`
 * @更新时间 `2022-08-29 15:51:44`
 */
export interface YapiGetOssServerUploadApiResponse {
  code?: number
  data?: {}
  msg?: string
  time?: number
}

/* prettier-ignore-end */
