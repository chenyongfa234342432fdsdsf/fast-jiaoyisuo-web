/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [商家申请↗](https://yapi.coin-online.cc/project/72/interface/api/2384) 的 **请求类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `POST /otc/merchant/apply`
 * @更新时间 `2022-08-29 15:32:09`
 */
export interface YapiPostOtcMerchantApplyApiRequest {
  /**
   * 区号
   */
  areacode?: string
  /**
   * 邮箱
   */
  email?: string
  /**
   * 紧急联系人电话区号
   */
  emergencyContactAreacode?: string
  /**
   * 紧急联系人
   */
  emergencyContactName?: string
  /**
   * 紧急联系人电话
   */
  emergencyContactTelephone?: string
  /**
   * 常住地址
   */
  permanentAddress?: string
  /**
   * 身份证明
   */
  photo?: string
  /**
   * 与本人关系（1-亲人  2-朋友	3-同事）
   */
  relation?: number
  /**
   * 电话
   */
  telephone?: string
  /**
   * 视频证明
   */
  video?: string
  /**
   * 微信
   */
  wechat?: string
}

/**
 * 接口 [商家申请↗](https://yapi.coin-online.cc/project/72/interface/api/2384) 的 **返回类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `POST /otc/merchant/apply`
 * @更新时间 `2022-08-29 15:32:09`
 */
export interface YapiPostOtcMerchantApplyApiResponse {
  code?: number
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}

/* prettier-ignore-end */
