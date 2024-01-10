/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [验证极验\/图形验证码↗](https://yapi.coin-online.cc/project/72/interface/api/2285) 的 **请求类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `POST /v3/verifyImage`
 * @更新时间 `2022-08-29 13:58:36`
 */
export interface YapiPostV3VerifyImageApiRequest {
  /**
   * 极验参数
   */
  gtChallenge?: string
  /**
   * 极验参数
   */
  gtSeccode?: string
  /**
   * 极验参数
   */
  gtValidate?: string
  /**
   * 图片imageToken
   */
  imageToken?: string
  /**
   * 图片数字
   */
  validCode?: string
}

/**
 * 接口 [验证极验\/图形验证码↗](https://yapi.coin-online.cc/project/72/interface/api/2285) 的 **返回类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `POST /v3/verifyImage`
 * @更新时间 `2022-08-29 13:58:36`
 */
export interface YapiPostV3VerifyImageApiResponse {
  code?: number
  data?: YapiDtoVerifyGtImageVO
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoVerifyGtImageVO {
  /**
   * 验证结果： 1-成功， 2-失败
   */
  status?: number
  /**
   * 极验版本号
   */
  version?: string
}

/* prettier-ignore-end */
