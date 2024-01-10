/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [ 获取谷歌key↗](https://yapi.coin-online.cc/project/72/interface/api/1715) 的 **请求类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `POST /getGoogleKey`
 * @更新时间 `2022-09-05 11:20:48`
 */
export interface YapiPostGetGoogleKeyApiRequest {
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
  qrUrl: string
  secret: string
}

/**
 * 接口 [ 获取谷歌key↗](https://yapi.coin-online.cc/project/72/interface/api/1715) 的 **返回类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `POST /getGoogleKey`
 * @更新时间 `2022-09-05 11:20:48`
 */
export interface YapiPostGetGoogleKeyApiResponse {
  code?: number
  data?: string
  dataView: YapiDtoundefined
}
/**
 * data参数格式（仅展示）
 */
export interface YapiDtoundefined {
  qrUrl: string
  secret: string
}

/* prettier-ignore-end */
