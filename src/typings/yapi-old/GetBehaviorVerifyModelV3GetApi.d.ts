/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [获取当前行为验证模型↗](https://yapi.coin-online.cc/project/72/interface/api/2204) 的 **请求类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `GET /v3/getBehaviorVerifyModel`
 * @更新时间 `2022-08-29 13:58:33`
 */
export interface YapiGetV3GetBehaviorVerifyModelApiRequest {}

/**
 * 接口 [获取当前行为验证模型↗](https://yapi.coin-online.cc/project/72/interface/api/2204) 的 **返回类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `GET /v3/getBehaviorVerifyModel`
 * @更新时间 `2022-08-29 13:58:33`
 */
export interface YapiGetV3GetBehaviorVerifyModelApiResponse {
  code?: number
  data?: YapiDtoBehaviorVerifyVO
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoBehaviorVerifyVO {
  /**
   * 行为验证类型: 1-极验验证, 2-图片验证
   */
  behaviorVerifyType?: string
  geeTest?: YapiDtoGeeTest
  kaptchaImage?: YapiDtoKaptchaImage
}
export interface YapiDtoGeeTest {
  challenge?: string
  gt?: string
  new_captcha?: boolean
  success?: number
}
export interface YapiDtoKaptchaImage {
  image?: string
  imgToken?: string
}

/* prettier-ignore-end */
