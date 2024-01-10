/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [获取虚拟币充值地址↗](https://yapi.coin-online.cc/project/72/interface/api/2537) 的 **请求类型**
 *
 * @分类 [其他加密返回接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_476)
 * @请求头 `POST /recharge/coin_address`
 * @更新时间 `2022-09-05 11:30:30`
 */
export interface YapiPostRechargeCoinAddressApiRequest {
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
  symbol: number
}

/**
 * 接口 [获取虚拟币充值地址↗](https://yapi.coin-online.cc/project/72/interface/api/2537) 的 **返回类型**
 *
 * @分类 [其他加密返回接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_476)
 * @请求头 `POST /recharge/coin_address`
 * @更新时间 `2022-09-05 11:30:30`
 */
export interface YapiPostRechargeCoinAddressApiResponse {
  code?: number
  data?: string
  dataView: YapiDtoundefined
}
/**
 * data参数格式（仅展示）
 */
export interface YapiDtoundefined {
  /**
   * 主键ID
   */
  fid: string
  /**
   * 虚拟币ID
   */
  fcoinid: string
  /**
   * 虚拟币地址
   */
  fadderess: string
  /**
   * 用户ID
   */
  fuid: string
  /**
   * 创建时间
   */
  fcreatetime: string
  /**
   * 地址标签
   */
  memo: string
  /**
   * 充值提示语
   */
  rechargeWarnWord: string
  /**
   * 是否使用地址标签
   */
  isUseMemo: boolean
  fshortname: string
  secret: string
}

/* prettier-ignore-end */
