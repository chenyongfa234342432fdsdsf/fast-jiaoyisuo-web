/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [注册前校验第二步，添加极验等↗](https://yapi.coin-online.cc/project/72/interface/api/2294) 的 **请求类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `POST /v4/registerCheck2`
 * @更新时间 `2022-09-02 13:37:23`
 */
export interface YapiPostV4RegisterCheck2ApiRequest {
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
   * 手机号码或者邮箱，手机号格式 86-15711941299
   */
  address: string
  /**
   * 邮箱或手机验证码
   */
  validCode: string
  /**
   * 极验或图片验证码
   */
  imageCode?: string
}

/**
 * 接口 [注册前校验第二步，添加极验等↗](https://yapi.coin-online.cc/project/72/interface/api/2294) 的 **返回类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `POST /v4/registerCheck2`
 * @更新时间 `2022-09-02 13:37:23`
 */
export interface YapiPostV4RegisterCheck2ApiResponse {
  code?: number
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}

/* prettier-ignore-end */
