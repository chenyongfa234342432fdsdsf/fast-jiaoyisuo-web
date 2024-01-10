/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [买家申诉删除图片↗](https://yapi.coin-online.cc/project/72/interface/api/2345) 的 **请求类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `POST /otc/buyer/appeal/photo/del`
 * @更新时间 `2022-08-29 15:32:08`
 */
export interface YapiPostOtcBuyerAppealPhotoDelApiRequest {
  /**
   * 图片url,多个以逗号分隔
   */
  imageUrl?: string
  /**
   * 订单号
   */
  orderNo?: string
}

/**
 * 接口 [买家申诉删除图片↗](https://yapi.coin-online.cc/project/72/interface/api/2345) 的 **返回类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `POST /otc/buyer/appeal/photo/del`
 * @更新时间 `2022-08-29 15:32:08`
 */
export interface YapiPostOtcBuyerAppealPhotoDelApiResponse {
  code?: number
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}

/* prettier-ignore-end */
