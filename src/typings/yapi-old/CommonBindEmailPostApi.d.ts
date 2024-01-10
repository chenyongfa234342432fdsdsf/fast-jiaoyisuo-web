/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [绑定邮箱↗](https://yapi.coin-online.cc/project/72/interface/api/1547) 的 **请求类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `POST /common/bind_email`
 * @更新时间 `2022-09-02 11:28:40`
 */
export interface YapiPostCommonBindEmailApiRequest {
  /**
   * 加密后的业务数据
   */
  bizData?: string
  bizDataView?: YapiDtoundefined
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
   * code
   */
  code: string
  /**
   * email邮箱
   */
  email: string
}

/**
 * 接口 [绑定邮箱↗](https://yapi.coin-online.cc/project/72/interface/api/1547) 的 **返回类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `POST /common/bind_email`
 * @更新时间 `2022-09-02 11:28:40`
 */
export interface YapiPostCommonBindEmailApiResponse {
  code?: number
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}

/* prettier-ignore-end */
