/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [杠杆-平仓↗](https://yapi.coin-online.cc/project/72/interface/api/1904) 的 **请求类型**
 *
 * @分类 [逐仓杠杆交易↗](https://yapi.coin-online.cc/project/72/interface/api/cat_461)
 * @标签 `逐仓杠杆交易`
 * @请求头 `POST /margin/isolated/closePosition`
 * @更新时间 `2022-08-29 13:58:22`
 */
export interface YapiPostMarginIsolatedClosePositionApiRequest {
  deviceInfo?: YapiDtoDeviceInfo
  /**
   * ip
   */
  ip?: string
  /**
   * 逐仓币对id
   */
  tradeId?: number
  userId?: number
}
export interface YapiDtoDeviceInfo {
  buildCode?: string
  deviceId?: string
  deviceModel?: string
  ip?: string
  platform?: number
  requestClientEnum?: 'WEB' | 'ANDROID' | 'API' | 'H5' | 'IOS' | 'ALL' | 'AGENT' | 'WINDOWS' | 'MAC'
  sysVer?: string
  versionCode?: string
}

/**
 * 接口 [杠杆-平仓↗](https://yapi.coin-online.cc/project/72/interface/api/1904) 的 **返回类型**
 *
 * @分类 [逐仓杠杆交易↗](https://yapi.coin-online.cc/project/72/interface/api/cat_461)
 * @标签 `逐仓杠杆交易`
 * @请求头 `POST /margin/isolated/closePosition`
 * @更新时间 `2022-08-29 13:58:22`
 */
export interface YapiPostMarginIsolatedClosePositionApiResponse {
  code?: number
  data?: {}
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}

/* prettier-ignore-end */
