/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [上传文件V2↗](https://yapi.coin-online.cc/project/72/interface/api/2432) 的 **请求类型**
 *
 * @分类 [oss_server↗](https://yapi.coin-online.cc/project/72/interface/api/cat_467)
 * @请求头 `POST /oss_server/v2/upload`
 * @更新时间 `2022-08-29 15:52:40`
 */
export interface YapiPostOssServerV2UploadApiRequest {
  /**
   * MultipartFile文件
   */
  file: FileData
  /**
   * 自定义编号
   */
  uniqueCode?: string
  /**
   * 文件目录
   */
  fileDir: string
  /**
   * 是否原名存储
   */
  isOriginNameStore?: string
}

/**
 * 接口 [上传文件V2↗](https://yapi.coin-online.cc/project/72/interface/api/2432) 的 **返回类型**
 *
 * @分类 [oss_server↗](https://yapi.coin-online.cc/project/72/interface/api/cat_467)
 * @请求头 `POST /oss_server/v2/upload`
 * @更新时间 `2022-08-29 15:52:40`
 */
export interface YapiPostOssServerV2UploadApiResponse {
  code?: number
  data?: {}
  msg?: string
  time?: number
}

/* prettier-ignore-end */
