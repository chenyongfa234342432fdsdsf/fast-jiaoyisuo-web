/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [生成扫码登录二维码token,前端获取到该token之后生成二维码图片↗](https://yapi.coin-online.cc/project/72/interface/api/2009) 的 **请求类型**
 *
 * @分类 [扫码登录↗](https://yapi.coin-online.cc/project/72/interface/api/cat_446)
 * @标签 `扫码登录`
 * @请求头 `GET /scanLogin/generateQRCodeToken`
 * @更新时间 `2022-08-29 13:58:26`
 */
export interface YapiGetScanLoginGenerateQrCodeTokenApiRequest {}

/**
 * 接口 [生成扫码登录二维码token,前端获取到该token之后生成二维码图片↗](https://yapi.coin-online.cc/project/72/interface/api/2009) 的 **返回类型**
 *
 * @分类 [扫码登录↗](https://yapi.coin-online.cc/project/72/interface/api/cat_446)
 * @标签 `扫码登录`
 * @请求头 `GET /scanLogin/generateQRCodeToken`
 * @更新时间 `2022-08-29 13:58:26`
 */
export interface YapiGetScanLoginGenerateQrCodeTokenApiResponse {
  code?: number
  data?: YapiDtoGenerateQRCodeTokenResp
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
/**
 * 生成qrcode token
 */
export interface YapiDtoGenerateQRCodeTokenResp {
  /**
   * 二维码token
   */
  qrCodeToken?: string
}

/* prettier-ignore-end */
