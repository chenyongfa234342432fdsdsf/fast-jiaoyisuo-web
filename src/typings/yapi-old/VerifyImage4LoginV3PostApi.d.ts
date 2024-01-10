/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [登录先验证极验\/图形验证码，再验证账号密码↗](https://yapi.coin-online.cc/project/72/interface/api/2288) 的 **请求类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `POST /v3/verifyImage4Login`
 * @更新时间 `2022-09-02 12:02:39`
 */
export interface YapiPostV3VerifyImage4LoginApiRequest {
  /**
   * 加密后的业务数据
   */
  bizData?: string
  bizDataView: YapiDtoundefined
  /**
   * 随机向量
   */
  randomIv?: string
  /**
   * 随机密钥
   */
  randomKey?: string
  /**
   * 签名串
   */
  signature?: string
  targetObj?: {}
  /**
   * 时间戳
   */
  timestamp?: number
}
/**
 * bizData的请求参数格式（仅展示）
 */
export interface YapiDtoundefined {
  /**
   * 极验参数
   */
  gtChallenge?: string
  /**
   * 极验参数
   */
  gtValidate?: string
  /**
   * 极验参数
   */
  gtSeccode?: string
  /**
   * 图片imageToken
   */
  imageToken?: string
  /**
   * 图片数字
   */
  validCode?: string
  /**
   * 邮箱或手机：登录必传
   */
  address: string
  /**
   * 密码：登录必传
   */
  pwd: string
}

/**
 * 接口 [登录先验证极验\/图形验证码，再验证账号密码↗](https://yapi.coin-online.cc/project/72/interface/api/2288) 的 **返回类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `POST /v3/verifyImage4Login`
 * @更新时间 `2022-09-02 12:02:39`
 */
export interface YapiPostV3VerifyImage4LoginApiResponse {
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
