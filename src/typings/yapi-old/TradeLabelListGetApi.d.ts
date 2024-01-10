/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [查询标签信息↗](https://yapi.coin-online.cc/project/72/interface/api/2078) 的 **请求类型**
 *
 * @分类 [币币优化↗](https://yapi.coin-online.cc/project/72/interface/api/cat_440)
 * @标签 `币币优化`
 * @请求头 `GET /trade_label/list`
 * @更新时间 `2022-08-29 13:58:28`
 */
export interface YapiGetTradeLabelListApiRequest {}

/**
 * 接口 [查询标签信息↗](https://yapi.coin-online.cc/project/72/interface/api/2078) 的 **返回类型**
 *
 * @分类 [币币优化↗](https://yapi.coin-online.cc/project/72/interface/api/cat_440)
 * @标签 `币币优化`
 * @请求头 `GET /trade_label/list`
 * @更新时间 `2022-08-29 13:58:28`
 */
export interface YapiGetTradeLabelListApiResponse {
  code?: number
  data?: YapiDtoTradeLabelVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoTradeLabelVO {
  /**
   * 币种Logo
   */
  id?: number
  /**
   * 中文标签
   */
  labelCn?: string
  /**
   * 英文标签
   */
  labelEn?: string
  /**
   * 次序
   */
  sort?: number
}

/* prettier-ignore-end */
