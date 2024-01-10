/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [广告管理-修改广告状态↗](https://yapi.coin-online.cc/project/72/interface/api/2381) 的 **请求类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `POST /otc/merchant/adv/updateStatus`
 * @更新时间 `2022-08-29 15:32:09`
 */
export interface YapiPostOtcMerchantAdvUpdateStatusApiRequest {
  /**
   * 广告id
   */
  advId?: number
  /**
   * 状态,1开启，2关闭，3下架
   */
  status?: number
}

/**
 * 接口 [广告管理-修改广告状态↗](https://yapi.coin-online.cc/project/72/interface/api/2381) 的 **返回类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `POST /otc/merchant/adv/updateStatus`
 * @更新时间 `2022-08-29 15:32:09`
 */
export interface YapiPostOtcMerchantAdvUpdateStatusApiResponse {
  code?: number
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}

/* prettier-ignore-end */
