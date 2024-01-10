/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [领取优惠券↗](https://yapi.nbttfc365.com/project/44/interface/api/18894) 的 **请求类型**
 *
 * @分类 [优惠券↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1026)
 * @请求头 `POST /v1/coupon/template/acquire`
 * @更新时间 `2023-11-28 15:36:08`
 */
export interface YapiPostV1CouponTemplateAcquireApiRequest {
  /**
   * 券模板ID
   */
  id: number
  /**
   * 卡劵渠道类型，activity 活动, mission 任务
   */
  welfareType: string
  /**
   * 发放ID
   */
  issueId: string
}

/**
 * 接口 [领取优惠券↗](https://yapi.nbttfc365.com/project/44/interface/api/18894) 的 **返回类型**
 *
 * @分类 [优惠券↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1026)
 * @请求头 `POST /v1/coupon/template/acquire`
 * @更新时间 `2023-11-28 15:36:08`
 */
export interface YapiPostV1CouponTemplateAcquireApiResponse {
  /**
   * 200-成功，其他错误码见备注
   */
  code: number
  /**
   * 描述信息
   */
  message: string
  data?: YapiPostV1CouponTemplateAcquireListData[]
}
export interface YapiPostV1CouponTemplateAcquireListData {
  /**
   * 券ID
   */
  couponId: string
  /**
   * 状态
   */
  status: string
  /**
   * 失效时间
   */
  invalidByTime: string
}

// 以下为自动生成的 api 请求，需要使用的话请手动复制到相应模块的 api 请求层
// import request, { MarkcoinRequest } from '@/plugins/request'

// /**
// * [领取优惠券↗](https://yapi.nbttfc365.com/project/44/interface/api/18894)
// **/
// export const postV1CouponTemplateAcquireApiRequest: MarkcoinRequest<
//   YapiPostV1CouponTemplateAcquireApiRequest,
//   YapiPostV1CouponTemplateAcquireApiResponse['data']
// > = data => {
//   return request({
//     path: "/v1/coupon/template/acquire",
//     method: "POST",
//     data
//   })
// }

/* prettier-ignore-end */
