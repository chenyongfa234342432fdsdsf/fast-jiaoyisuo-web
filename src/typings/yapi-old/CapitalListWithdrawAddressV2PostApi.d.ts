/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [查询提现地址↗](https://yapi.coin-online.cc/project/72/interface/api/2543) 的 **请求类型**
 *
 * @分类 [其他加密返回接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_476)
 * @请求头 `POST /v2/capital/list_withdraw_address`
 * @更新时间 `2022-09-05 11:41:51`
 */
export interface YapiPostV2CapitalListWithdrawAddressApiRequest {
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
   * 币种id
   */
  coinId: number
}

/**
 * 接口 [查询提现地址↗](https://yapi.coin-online.cc/project/72/interface/api/2543) 的 **返回类型**
 *
 * @分类 [其他加密返回接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_476)
 * @请求头 `POST /v2/capital/list_withdraw_address`
 * @更新时间 `2022-09-05 11:41:51`
 */
export interface YapiPostV2CapitalListWithdrawAddressApiResponse {
  code?: number
  data?: string
  /**
   * data参数格式（仅展示）
   */
  dataView: YapiDtoundefined[]
}
export interface YapiDtoundefined {
  /**
   * 主键ID
   */
  fid: number
  /**
   * 虚拟币ID
   */
  fcoinid: number
  /**
   * 虚拟币地址
   */
  fadderess: string
  /**
   * 用户ID
   */
  fuid: number
  /**
   * 创建时间
   */
  fcreatetime: string
  /**
   * 版本号
   */
  version: string
  /**
   * 是否初始化
   */
  init: boolean
  /**
   * 备注
   */
  fremark: string
  /**
   * 地址标签
   */
  memo: string
  /**
   * WEB站LOGO
   */
  webLogo: string
  /**
   * 简称
   */
  shortName: string
}

/* prettier-ignore-end */
