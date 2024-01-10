/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [是否关闭弹窗--取↗](https://yapi.coin-online.cc/project/72/interface/api/1973) 的 **请求类型**
 *
 * @分类 [币币优化↗](https://yapi.coin-online.cc/project/72/interface/api/cat_440)
 * @标签 `币币优化`
 * @请求头 `GET /popup/getStatus`
 * @更新时间 `2022-08-29 13:58:24`
 */
export interface YapiGetPopupGetStatusApiRequest {}

/**
 * 接口 [是否关闭弹窗--取↗](https://yapi.coin-online.cc/project/72/interface/api/1973) 的 **返回类型**
 *
 * @分类 [币币优化↗](https://yapi.coin-online.cc/project/72/interface/api/cat_440)
 * @标签 `币币优化`
 * @请求头 `GET /popup/getStatus`
 * @更新时间 `2022-08-29 13:58:24`
 */
export interface YapiGetPopupGetStatusApiResponse {
  code?: number
  data?: YapiDtoPopStatusVO
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoPopStatusVO {
  /**
   * 计划委托弹窗 1开启 2关闭
   */
  entrustStatus?: number
  /**
   * 计划委托弹窗 1开启 2关闭
   */
  etfStatus?: number
}

/* prettier-ignore-end */
