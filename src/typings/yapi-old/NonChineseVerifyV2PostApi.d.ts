/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [nonChineseVerify↗](https://yapi.coin-online.cc/project/72/interface/api/2165) 的 **请求类型**
 *
 * @分类 [user-api-v-2-controller↗](https://yapi.coin-online.cc/project/72/interface/api/cat_416)
 * @标签 `user-api-v-2-controller`
 * @请求头 `POST /v2/nonChineseVerify`
 * @更新时间 `2022-08-29 13:58:32`
 */
export interface YapiPostV2NonChineseVerifyApiRequest {
  /**
   * 真实姓名
   */
  realName: string
  /**
   * 证件号
   */
  idcardNumber: string
  /**
   * 证件正面照片
   */
  idcardFrontImage: string
  /**
   * 手持证件照
   */
  idcardImage: string
  /**
   * 类型  1身份证 2护照  3驾驶证
   */
  type: string
}

/**
 * 接口 [nonChineseVerify↗](https://yapi.coin-online.cc/project/72/interface/api/2165) 的 **返回类型**
 *
 * @分类 [user-api-v-2-controller↗](https://yapi.coin-online.cc/project/72/interface/api/cat_416)
 * @标签 `user-api-v-2-controller`
 * @请求头 `POST /v2/nonChineseVerify`
 * @更新时间 `2022-08-29 13:58:32`
 */
export interface YapiPostV2NonChineseVerifyApiResponse {
  code?: number
  data?: {}
  msg?: string
  time?: number
}

/* prettier-ignore-end */
