/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [positionAdjustExport↗](https://yapi.coin-online.cc/project/72/interface/api/2441) 的 **请求类型**
 *
 * @分类 [newex-dax-perpetual-rest↗](https://yapi.coin-online.cc/project/72/interface/api/cat_473)
 * @请求头 `GET /v1/perpetual/log/position-adjust/export`
 * @更新时间 `2022-08-29 15:55:03`
 */
export interface YapiGetV1PerpetualLogPositionAdjustExportApiRequest {
  contractCode?: string
  side?: string
  type?: string
  /**
   * 开始日期
   */
  startDate?: string
  /**
   * 结束日期
   */
  endDate?: string
}

/**
 * 接口 [positionAdjustExport↗](https://yapi.coin-online.cc/project/72/interface/api/2441) 的 **返回类型**
 *
 * @分类 [newex-dax-perpetual-rest↗](https://yapi.coin-online.cc/project/72/interface/api/cat_473)
 * @请求头 `GET /v1/perpetual/log/position-adjust/export`
 * @更新时间 `2022-08-29 15:55:03`
 */
export interface YapiGetV1PerpetualLogPositionAdjustExportApiResponse {}

/* prettier-ignore-end */
