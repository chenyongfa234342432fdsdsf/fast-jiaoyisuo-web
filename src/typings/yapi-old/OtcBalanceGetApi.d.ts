/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [根据币种获取帐户余额↗](https://yapi.coin-online.cc/project/72/interface/api/2330) 的 **请求类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `GET /otc/balance`
 * @更新时间 `2022-08-29 15:32:07`
 */
export interface YapiGetOtcBalanceApiRequest {
  /**
   * coinId
   */
  coinId: string
}

/**
 * 接口 [根据币种获取帐户余额↗](https://yapi.coin-online.cc/project/72/interface/api/2330) 的 **返回类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `GET /otc/balance`
 * @更新时间 `2022-08-29 15:32:07`
 */
export interface YapiGetOtcBalanceApiResponse {
  code?: number
  data?: YapiDtoOtcBalanceVO
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoOtcBalanceVO {
  /**
   * 币种id
   */
  coinId?: number
  /**
   * 可用
   */
  total?: number
  /**
   * 可用(字符串)
   */
  totalStr?: string
}

/* prettier-ignore-end */
