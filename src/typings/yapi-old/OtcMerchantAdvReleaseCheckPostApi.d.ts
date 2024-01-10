/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [点击发布广告按钮时执行检查↗](https://yapi.coin-online.cc/project/72/interface/api/2378) 的 **请求类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `POST /otc/merchant/adv/release/check`
 * @更新时间 `2022-08-29 15:32:09`
 */
export interface YapiPostOtcMerchantAdvReleaseCheckApiRequest {}

/**
 * 接口 [点击发布广告按钮时执行检查↗](https://yapi.coin-online.cc/project/72/interface/api/2378) 的 **返回类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `POST /otc/merchant/adv/release/check`
 * @更新时间 `2022-08-29 15:32:09`
 */
export interface YapiPostOtcMerchantAdvReleaseCheckApiResponse {
  code?: number
  data?: YapiDtoRelaseAdvCheckVO
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoRelaseAdvCheckVO {
  /**
   * 发布购买广告是否达到限制
   */
  buyLimit?: boolean
  /**
   * 发布出售广告是否达到限制
   */
  sellLimit?: boolean
}

/* prettier-ignore-end */
