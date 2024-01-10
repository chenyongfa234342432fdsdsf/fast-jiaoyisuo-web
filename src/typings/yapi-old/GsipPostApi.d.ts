/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [APP配置接口-获取系统初始化参数接口↗](https://yapi.coin-online.cc/project/72/interface/api/2540) 的 **请求类型**
 *
 * @分类 [其他加密返回接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_476)
 * @请求头 `POST /gsip`
 * @更新时间 `2022-09-05 11:36:24`
 */
export interface YapiPostGsipApiRequest {
  /**
   * 加密后的业务数据
   */
  bizData?: string
  /**
   * bizData的请求参数格式（仅展示）
   */
  bizDataView: {}
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
 * 接口 [APP配置接口-获取系统初始化参数接口↗](https://yapi.coin-online.cc/project/72/interface/api/2540) 的 **返回类型**
 *
 * @分类 [其他加密返回接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_476)
 * @请求头 `POST /gsip`
 * @更新时间 `2022-09-05 11:36:24`
 */
export interface YapiPostGsipApiResponse {
  code?: number
  data?: string
  dataView: YapiDtoundefined
}
/**
 * data参数格式（仅展示）
 */
export interface YapiDtoundefined {
  /**
   * 签名秘钥
   */
  ssk: string
}

/* prettier-ignore-end */
