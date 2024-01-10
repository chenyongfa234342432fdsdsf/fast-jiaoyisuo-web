/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [注册极光推送回调↗](https://yapi.coin-online.cc/project/72/interface/api/1835) 的 **请求类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `POST /jcallback`
 * @更新时间 `2022-09-02 11:36:04`
 */
export interface YapiPostJcallbackApiRequest {
  /**
   * 加密后的业务数据（后台未使用该字段）
   */
  bizData?: string
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
 * 接口 [注册极光推送回调↗](https://yapi.coin-online.cc/project/72/interface/api/1835) 的 **返回类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `POST /jcallback`
 * @更新时间 `2022-09-02 11:36:04`
 */
export interface YapiPostJcallbackApiResponse {
  code?: number
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}

/* prettier-ignore-end */
