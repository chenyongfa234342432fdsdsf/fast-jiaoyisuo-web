/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [文件上传↗](https://yapi.coin-online.cc/project/72/interface/api/2315) 的 **请求类型**
 *
 * @分类 [oss_server↗](https://yapi.coin-online.cc/project/72/interface/api/cat_467)
 * @请求头 `POST /oss_server/upload`
 * @更新时间 `2022-08-29 15:52:03`
 */
export interface YapiPostOssServerUploadApiRequest {
  /**
   * MultipartFile文件
   */
  file: string
  /**
   * 代码
   */
  uniqueCode?: string
  /**
   * 文件路径
   */
  fileDir: string
}

/**
 * 接口 [文件上传↗](https://yapi.coin-online.cc/project/72/interface/api/2315) 的 **返回类型**
 *
 * @分类 [oss_server↗](https://yapi.coin-online.cc/project/72/interface/api/cat_467)
 * @请求头 `POST /oss_server/upload`
 * @更新时间 `2022-08-29 15:52:03`
 */
export interface YapiPostOssServerUploadApiResponse {
  code?: number
  data?: {}
  msg?: string
  time?: number
}

/* prettier-ignore-end */
