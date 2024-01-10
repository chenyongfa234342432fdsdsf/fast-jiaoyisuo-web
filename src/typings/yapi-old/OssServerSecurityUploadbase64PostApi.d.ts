/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [base64上传↗](https://yapi.coin-online.cc/project/72/interface/api/2324) 的 **请求类型**
 *
 * @分类 [oss_server↗](https://yapi.coin-online.cc/project/72/interface/api/cat_467)
 * @请求头 `POST /oss_server/security/uploadBase64`
 * @更新时间 `2022-08-29 15:52:22`
 */
export interface YapiPostOssServerSecurityUploadBase64ApiRequest {
  /**
   * 字符串
   */
  file: string
  /**
   * 代码
   */
  uniqueCode?: string
  /**
   * 文件目录
   */
  fileDir: string
  /**
   * 文件名
   */
  fileExtensName: string
}

/**
 * 接口 [base64上传↗](https://yapi.coin-online.cc/project/72/interface/api/2324) 的 **返回类型**
 *
 * @分类 [oss_server↗](https://yapi.coin-online.cc/project/72/interface/api/cat_467)
 * @请求头 `POST /oss_server/security/uploadBase64`
 * @更新时间 `2022-08-29 15:52:22`
 */
export interface YapiPostOssServerSecurityUploadBase64ApiResponse {
  code?: number
  data?: {}
  msg?: string
  time?: number
}

/* prettier-ignore-end */
